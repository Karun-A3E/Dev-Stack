const db = require('./databaseconfig');

const bloggingPlatform = {
  getUserCred_category_post_all: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT p.id,u.username,p.title,p.content,p.category_id as categordid,c.name,p.created_at,p.updated_at FROM posts p  JOIN users u ON p.user_id = u.id JOIN categories c on p.category_id = c.id';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  findById: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT p.title,u.username,c.name,co.content FROM posts p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id JOIN comments co ON p.id = co.post_id where p.id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  getPostbyID: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT p.id,u.username,p.title,p.content,p.category_id as categordid,c.name,p.created_at,p.updated_at FROM posts p  JOIN users u ON p.user_id = u.id JOIN categories c on p.category_id = c.id where p.id=?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? (console.error(error),callback(error, null)) : callback(null, results);
      });
    });
  },
  categoryid_find: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT p.title,u.username,c.name,co.content FROM posts p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id JOIN comments co ON p.id = co.post_id where c.id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  }
}














module.exports = bloggingPlatform