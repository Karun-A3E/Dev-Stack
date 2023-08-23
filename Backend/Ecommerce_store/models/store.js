const db = require('./databaseconfig');

const store ={
  findAll: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM users';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  insert: (data, callback) => {
    let conn = db.getConnection();
    let query = 'INSERT INTO users (username,email,password) values (?,?,?)';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, data, (error, results) => {
        conn.end()
        return error ? (callback(error, null),console.error(error)) : callback(null, results);
      });
    });
  },
  products_findall: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM products';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  product_insert: (data, callback) => {
    let conn = db.getConnection();
    let query = 'INSERT INTO products (name,price,description) values (?,?,?)';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, data, (error, results) => {
        conn.end()
        return error ? (callback(error, null),console.error(error)) : callback(null, results);
      });
    });
  },
  findById: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM table_name WHERE id_column = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  find_orders: (callback) => {
    let conn = db.getConnection();
    let query = 'select o.id,o.user_id,u.username,p.name,p.description,o.total_amount FROM orders o JOIN users u on o.user_id = u.id JOIN products p on o.total_amount=p.price';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? (callback(error, null),console.error(error)) : callback(null, results);
      });
    });
  }
};


module.exports = store