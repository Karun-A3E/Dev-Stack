const model = require('../configurations/template');
const validation = require('../misc/sqlTableValidations')
const games = {
    /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use a different method for getting game pagination (e.g., games.getGamesByPage).
   * The reason for deprecation: This method has been replaced with a more efficient implementation.
   */
  getAllGames: async () => {
    return model.async_template('select * from games')
  },
  getGamePagination: async (page, pageSize) => { //this is the async_getUser method, there is already a sync method for getting users 
    try { //? Reason for this method : This method can decrease the load made on the sql Server Response as well as the program running making the API function faster in some sense 
      const offset = (page - 1) * pageSize;
      const query = 'SELECT * FROM game_details_summary_view LIMIT ?, ?;';
      const values = [offset, pageSize];
      return model.async_template(query, values).then(async results => {
        return model.async_template('SELECT COUNT(*) FROM game_details_summary_view;').then(totalCountResults => {
          const total_count = totalCountResults[0]['COUNT(*)']
          const maxPages = Math.ceil(total_count / pageSize);
          return (page > maxPages) ? { 'maxPage': maxPages } :
            {
              'maxPages': maxPages,
              "Page Index": `Page ${page}/${maxPages}`,
              "results": results
            }

        })
      })
    } catch (err) {
      console.log(err)
      throw err;
    }
  },
  deleteGame: async (id) => {
    try {
      return model.async_template('delete from games where gameid = ? ', id)
    } catch (error) {
      throw error
    }
  },
  getSpecificGame: async (gameName) => {
    try {
      return model.async_template('SELECT * from game_details_summary_view where gameid = ?', gameName);
    } catch (error) {
      throw error
    }
  },
  getCategoryFiltering: async (values) => {
    try {
      const query = `SELECT *
      FROM game_details_summary_view
      WHERE (categories IN (?) )`;
      return model.async_template(query, values);
    } catch (error) {
      throw error;
    }
  },
  getPlatformFiltering: async (values) => {
    try {
      const query = `SELECT *
      FROM game_details_summary_view
      WHERE (platform IN (?) )`;
      return model.async_template(query, values);
    } catch (error) {
      throw error;
    }
  },
  update_game: async (gameid, values) => {
    Object.keys(values).forEach(key => {
      if (key === 'created_at' || key === 'gameid') {
        delete values[key];
      }
      else if (key === 'year') {
        values.released_year = values[key];
        delete values[key];
      }
    });
    return model.async_template('UPDATE games SET ? WHERE gameid = ?', [values, gameid]);
  },
  createNewGame: async (values) => {
    try {
      return model.async_template('insert into games (title,description,released_year,profile_pic_url) values (?,?,?,?)', values)
    } catch (error) {
      throw error
    }
  },
  InsertIntoGamesPlatform: async (values) => {
    try {
      return model.async_batch_insertion('INSERT INTO games_platform (gameid, platform_id,price) VALUES ? ', values)
    } catch (error) {
      throw error
    }
  },
  InsertIntoGamesCategory: async (values) => {
    try {
      return model.async_batch_insertion(`INSERT INTO games_category (gameid,category_id) VALUES ?`, values)
    } catch (error) {
      throw error
    }
  },
  topGames: async () => {
    return model.async_template('SELECT * from game_details_summary_view limit 8')
  },
  getBasicCategoryColumn: async () => {
    return model.async_template('SELECT distinct(status) from games')
  },
  getRecentGames: async () => {
    return model.async_template(`    SELECT gameid, title, status,released_year FROM ( SELECT * FROM games WHERE status = 'released' ORDER BY created_at DESC LIMIT 10 ) AS released_games UNION ALL SELECT gameid, title, status,released_year FROM ( SELECT * FROM games WHERE status = 'upcoming' ORDER BY created_at DESC LIMIT 10 ) AS upcoming_games;`);
  },
  getRandom10: async (value) => {
    let randValue = value;
    if (!value) { randValue = 8 }
    return model.async_template('SELECT * from filtered_game_details_view order by rand() limit ?', parseInt(randValue));
  },
  getGamePaginationWithFilter: async (page, pageSize, yearRange, minRating, maxRating, platforms, category, search, columns) => {
    try {
      const offset = (page - 1) * pageSize;
      let query = (search || search!=null) ? 'SELECT * FROM filtered_game_details_view' : 'SELECT * FROM game_details_summary_view';
      const values = [];
      let whereClauses = []; // Initialize an empty array to store WHERE clauses

      // Check for filtering conditions and build the WHERE clauses and values array
      if (yearRange && yearRange.length === 2) {
        whereClauses.push(' released_year BETWEEN ? AND ?');
        values.push(yearRange[0], yearRange[1]);
      }
      if (minRating && maxRating) {
        whereClauses.push(' average_rating BETWEEN ? AND ?');
        values.push(minRating, maxRating);
      }
      if (platforms && platforms.length > 0) {
        // Build separate LIKE conditions for each platform and enclose them in parentheses
        const platformClauses = platforms.map(() => ' platforms LIKE ?');
        whereClauses.push(`(${platformClauses.join(' OR ')})`);
        platforms.forEach(platform => values.push(`%${platform}%`));
      }
      if (category && category.length > 0) {
        // Build separate LIKE conditions for each category and enclose them in parentheses
        const categoryClauses = category.map(() => ' categories LIKE ?');
        whereClauses.push(`(${categoryClauses.join(' OR ')})`);
        category.forEach(category => values.push(`%${category}%`));
      }
      if (search && columns && columns.length > 0) {
        // Build separate LIKE conditions for each column and enclose them in parentheses
        const searchClauses = columns.map(column => ` ${column} LIKE ?`);
        whereClauses.push(`(${searchClauses.join(' OR ')})`);
        columns.forEach(column => values.push(`%${search}%`));
      }


      // Combine all the WHERE clauses using the AND operator
      if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
      }

      // Add the pagination limit and offset to the main query
      query += ' LIMIT ?, ?';
      values.push(offset, pageSize);
      // Get the filtered results
      console.log(query, values)
      const results = await model.async_template(query, values);

      // Create a new query for counting the total results with the same filters
      const countQuery = search ?'SELECT COUNT(*) FROM filtered_game_details_view' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '') :'SELECT COUNT(*) FROM game_details_summary_view' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '')

      // Get the total count based on the filtered query
      const totalCountResults = await model.async_template(countQuery, values);

      const total_count = totalCountResults[0]['COUNT(*)'];
      const maxPages = Math.ceil(total_count / pageSize);

      return page > maxPages
        ? { 'maxPage': maxPages }
        : {
          'maxPages': maxPages,
          'Page Index': `Page ${page}/${maxPages}`,
          'results': results,
        };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getgames: async (values) => {
    return model.async_template(`SELECT gameid,title from games where title like concat('%',?,'%') limit 8`, values)
  },
  getCategoryIdByName: async (categoryname) => {
    try {
      const result = await model.async_template('SELECT catid FROM category WHERE catname = ?', [categoryname]);
      return result[0].catid;
    } catch (error) {
      throw error;
    }
  },
  getPlatformIdByName: async (platformname) => {
    try {
      const result = await model.async_template('SELECT platformid FROM platform WHERE platform_name = ?', [platformname]);
      return result[0].platformid;
    } catch (error) {
      throw error;
    }
  },
  
}


module.exports = games

