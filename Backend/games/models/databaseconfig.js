var mysql = require('mysql');

var dbconnect = {
  getConnection: () => {
    var conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "kali",
      database: "games"
    });
    return conn;
  }
};
module.exports = dbconnect;