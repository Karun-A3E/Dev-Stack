
const model = require('../configurations/template')

//* ++ Add New Category => Category Table only
//* ++ Add New Platform => Platform Table Only

//* ++ Edit Existing Category => Category Table only --> Only Catname and Description
//* ++ Edit Existing Platform => Platform Table only --> Only platform_name and Description

//* ++ Delete Platform => Platform table, Platform_game
//* ++ Delte Category => Category Table, Catgory_game

//* ++ Get Category Columns => Name and Description
//* ++ Get Plaform Columns => Name and Description
//! ++ Total Endpoints : 8

const platform_category_endpoints = {
  addNewCategory: async (values) => {
    try {
      return model.async_template('INSERT INTO category (catname, cat_description) VALUES (?, ?)', values)
    } catch (error) {
      throw error
    }
  },
  addNewPlatform: async (values) => {
    try {
      return model.async_template('INSERT INTO platform (platform_name, platform_description) VALUES (?, ?)', values)
    } catch (error) {
      throw error
    }
  },
  editPlatform: async (values) => {
    try {
      Object.keys(values[0]).forEach(key => {
        if (key == 'created_at' || key == 'platformid') { delete values[0][key] }
      });
      return model.async_template('UPDATE platform set platform_name = ?,platform_description =? where platformid = ?',values)
    } catch (error) {
      throw error
    }
  },
  editCategory: async (values) => {
    try {
      Object.keys(values[0]).forEach(key => {
        if (key == 'created_at' || key == 'catid') { delete values[0][key] }
      });
      return model.async_template('UPDATE category set catname=?, cat_description=? where catid = ?', values)
    } catch (error) {
      throw error
    }
  },
  deletePlatform: async function ({ id }) {
    try {
      return model.async_template('DELETE FROM platform where platformid = ? ', id)
    } catch (error) {
      throw error
    }
  },
  deleteCategory: async function ({ id }) {
    try {
      return model.async_template('DELETE FROM category where catid = ? ', id)
    } catch (error) {
      throw error
    }
  },
  getCategoryInfo: async () => {
    try {
      return model.async_template('SELECT * from used_category  ')

    } catch (error) {
      throw error
    }
  },
  getPlatformInfo: async () => {
    try {
      return model.async_template('SELECT * from used_platform  ')
    } catch (error) {
      throw error
    }
  },
  getPlatformPaged: async (page, pageSize, search, columns) => {
    try {
      const offset = (page - 1) * pageSize;
      let query = 'SELECT * FROM platform';
      const values = [];
      let whereClauses = []; // Initialize an empty array to store WHERE clauses
  
      // Check for filtering conditions and build the WHERE clauses and values array
      if (search && columns && columns.length > 0) {
        // Build separate LIKE conditions for each column and enclose them in parentheses
        const searchClauses = columns.map(column => ` ${column} LIKE ?`);
        whereClauses.push(`(${searchClauses.join(' OR ')})`);
        columns.forEach(column => values.push(`%${search}%`)); // Use 'search' instead of 'column'
      }
  
      // Combine all the WHERE clauses using the AND operator
      if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
      }
  
      // Add the pagination limit and offset to the main query
      query += ' LIMIT ?, ?';
      values.push(offset,parseInt(pageSize));
  
      // Get the filtered results
      const results = await model.async_template(query, values);
  
      // Create a new query for counting the total results with the same filters
      const countQuery = 'SELECT COUNT(*) FROM platform' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '');
  
      // Get the total count based on the filtered query
      const totalCountResults = await model.async_template(countQuery, values);
  
      const total_count = totalCountResults[0]['COUNT(*)'];
      const maxPages = Math.ceil(total_count / pageSize);
  
      return page > maxPages
        ? { 'maxPage': maxPages }
        : {
          'maxPages': maxPages,
          "Page Index": `Page ${page}/${maxPages}`,
          "results": results
        };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getCategoryPaged: async (page, pageSize, search, columns) => {
    try {
      const offset = (parseInt(page) - 1) * pageSize;
      let query = 'SELECT * FROM category';
      const values = [];
      let whereClauses = []; // Initialize an empty array to store WHERE clauses
  
      // Check for filtering conditions and build the WHERE clauses and values array
      if (search && columns && columns.length > 0) {
        // Build separate LIKE conditions for each column and enclose them in parentheses
        const searchClauses = columns.map(column => ` ${column} LIKE ?`);
        whereClauses.push(`(${searchClauses.join(' OR ')})`);
        columns.forEach(column => values.push(`%${search}%`)); // Use 'search' instead of 'column'
      }
  
      // Combine all the WHERE clauses using the AND operator
      if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
      }
  
      // Add the pagination limit and offset to the main query
      query += ' LIMIT ?, ?';
      values.push(offset, parseInt(pageSize));
  
      // Get the filtered results
      const results = await model.async_template(query, values);
  
      // Create a new query for counting the total results with the same filters
      const countQuery = 'SELECT COUNT(*) FROM category' + (whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '');
  
      // Get the total count based on the filtered query
      const totalCountResults = await model.async_template(countQuery, values);
  
      const total_count = totalCountResults[0]['COUNT(*)'];
      const maxPages = Math.ceil(total_count / pageSize);
  
      return page > maxPages
        ? { 'maxPage': maxPages }
        : {
          'maxPages': maxPages,
          "Page Index": `Page ${page}/${maxPages}`,
          "results": results
        };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  addNewGameCategory : async (gameid,catname) =>{
    try {
      return model.async_template('Insert into games_category (gameid,category_id) values (?,(select catid from category where catname = ?))',[gameid,catname])
    } catch (error) {
      throw error
    }
  },  
  addNewGamePlatform : async (gameid,platform_name,price) =>{
    try {
      console.log(price)
      return model.async_template('Insert into games_platform (gameid,platform_id,price) values (?,(select platformid from platform where platform_name = ?),?)',[gameid,platform_name,price])
    } catch (error) {
      throw error
    }
  },
  deleteGamePlatform : async (gameid,catname) =>{
    try {
      return model.async_template('delete from games_platform where gameid =? and platform_id = (select platformid from platform where platform_name =?)',[gameid,catname])
    } catch (error) {
      throw error
    }
  },  
  deleteGameCategory : async (gameid,platform_name) =>{
    try {
      return model.async_template('delete from games_category where gameid =? and category_id = (select catid from category where catname =?)',[gameid,platform_name])
    } catch (error) {
      throw error
    }
  },
  getCategoryPlatfromRecordByID: async (tablename, idName, idValue) => {
    try {
      return model.async_template('SELECT * from ?? where ?? = ?', [tablename, idName, parseInt(idValue)]);
    } catch (error) {
      // Handle error appropriately
    }
  }
  
};

module.exports = platform_category_endpoints;
