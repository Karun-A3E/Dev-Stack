const model = require('./template');
const validation = require('./validation')
var user_database = {
  getUsers: (callback) => {
    model.template('SELECT * FROM trial.users_view;', callback);
  },
  getById: (id, callback) => {
    var sql = 'SELECT * FROM trial.users_view WHERE userid = ' + id + ';';
    model.template(sql, callback);
  },
  postNEW: (values, callback) => {
    let conn = db.getConnection();
    const query = 'INSERT INTO users (username, email, type,password) VALUES (?, ?,?, ?)';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, data, (error, results) => {
        return error ? callback(error, null) : conn.query('SELECT users.id as userid from users where users.email = ? ', values[1],(erro,resu)=>{
          return erro ? callback(erro,null) : callback(resu,null)
        });
      });
    });
  },
  post_category : (values,callback) => {
    model.template('INSERT INTO category (catname, cat_description) VALUES (?, ?)',values,callback)
  },
  post_platform : (values,callback) =>{ 
    model.template('INSERT INTO platforms (platform_name, platform_description  ) VALUES (?, ?)',values,callback)
  },
  getReview:  (id,callback) =>{
    model.template(`SELECT r.game_id,r.review as content,r.rating, u.username,r.created_at
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    where r.game_id= ? `,id,callback)
  },
  postReview : (values,callback) =>{
    model.template(`INSERT INTO reviews (game_id,user_id,review,rating) values (?,?, ? , ?)`,values,callback)
  },
  get_games_list: (gamename,callback)=> {
    const query = "SELECT g.gameid,g.title,g.description,g.price,p.platform_name as platform,g.categoryid as catid, IFNULL(GROUP_CONCAT(c.catname ORDER BY c.catid SEPARATOR ', '), '***') AS catname,g.year,g.created_at FROM games g JOIN platforms p ON FIND_IN_SET(p.platformid, g.platformid) LEFT JOIN category c ON FIND_IN_SET(c.catid, g.categoryid) where p.platform_name = ? GROUP BY g.gameid;"
    model.template(query,gamename,callback)
  },
  post_new_game : (values,callback) =>{
    model.template('INSERT INTO games (title, description, price, platformid, categoryid, year) VALUES (?, ?, ?, ?, ?, ?)', values, callback);
 },

  update_game : (values,callback)=>{
    model.template('UPDATE games SET ? WHERE gameid = ?',values,callback)
  },
  cascade_delete_game : (values,callback)=>{
    model.template('DELETE FROM games WHERE gameid = ?',values,callback)
  },
  async_getUser : (page,pageSize) =>{
    try{
      const offset = (page - 1) * pageSize;
      const query = 'SELECT * FROM trial.users_view LIMIT ?, ?;';
      const values = [offset, pageSize];
      return model.async_template(query, values).then(results =>{
        return model.async_template('SELECT COUNT(*) FROM users_view;').then(totalCountResults=>{
        const total_count = totalCountResults[0]['COUNT(*)']
        const maxPages = Math.ceil(total_count / pageSize);
        return (page>maxPages) ? {'maxPage': maxPages} :  {
          'totalCount' : total_count,
          'maxPages' : maxPages,
          "Page Index" : `Page ${page}/${maxPages}`,
          "results" : results
        }
        })
      })

    }catch (err) {
      console.log(err)
      throw err;}
  },
}



module.exports = user_database


