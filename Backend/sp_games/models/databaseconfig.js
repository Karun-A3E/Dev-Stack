var mysql = require('mysql');

var dbconnect = {
  getConnection: () => {
    var conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "sp_games"
    });
    return conn;
  }
};
module.exports = dbconnect;