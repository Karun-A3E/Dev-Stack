const dbconnect = require('./databaseconfig');

var model = {
  template: (query, values, callback) => {
    var conn = dbconnect.getConnection()
    conn.connect((err) => {
      if (err) {
        conn.end()
        console.log(err);
        return callback(err, null);
      }
      else {
        conn.query(query, values, function(err, results) {
          conn.end();
          if (err) {console.log(err);return callback(err, null);}
          else if (results.length == 0){return callback(null,'No one')}
          else {return callback(null, results);}
        });
      }
    });
  },
  async_template: (query, values) => {
    return new Promise((resolve, reject) => {
      let conn = dbconnect.getConnection();
      conn.connect((err) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        conn.query(query, values, (err, results) => {
          conn.end();
          if (err) {
            console.log(err)
            return reject(err);
          }
          resolve(results);
        });
      });
    });
  },
}


module.exports = model