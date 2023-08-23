const db = require('./databaseconfig');

const games = {
  getAllPlatforms: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM platforms';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  getAllGames: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM games';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  findById: (id, callback) => {
    let conn = db.getConnection();
    let query = `SELECT * FROM games WHERE platform_compatible like "%${id}%"`;
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  
}



module.exports=games