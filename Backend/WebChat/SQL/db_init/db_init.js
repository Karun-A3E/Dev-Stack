const mysql = require('mysql');
const fs = require('fs');

const host = process.argv[2];     
const user = process.argv[3];
const password = process.argv[4];
const databaseName = process.argv[5]
const connection = mysql.createConnection({
  host,
  user,
  password,
  multipleStatements: true 
});

function createDatabase(databaseName) {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (error) => {
    if (error) {
      console.error(`Error creating database: ${error}`);
      connection.end();
      process.exit(1); 

    }

    console.log(`Database "${databaseName}" created.`);
    connection.query(`USE ${databaseName}`, (error) => {
      if (error) {
        console.error(`Error selecting database: ${error}`);
        connection.end(); 
        process.exit(1); 

      }
      executeSqlFiles();
    });
  });
}

function executeSqlFiles() {
  const sqlFiles = [];
  const status = [
    '\x1b[34m⬛ Tables initialized...\x1b[0m',
    '\x1b[34m⬛ Views Initialized...\x1b[0m',
    '\x1b[35m⬤ Procedures set...\x1b[0m',
    '\x1b[35m⬤ Triggers planted...\x1b[0m',
    '\x1b[31m⬤ Recovery implemented...\x1b[0m',
    '\x1b[32m⬤ Data Inserted...\x1b[0m'
  ];
    for (let i = 0; i < sqlFiles.length; i++) {
    let sql = fs.readFileSync(sqlFiles[i], 'utf8');
    connection.query(sql, (error) => {
      if (error) {
        console.error(`Error executing SQL file ${sqlFiles[i]}: ${error}`);
        connection.end(); // Close the MySQL connection
        process.exit(1); // Terminate the script with an error
        return;
      }
    });
    console.log(status[i])
  }
  connection.end();
  console.log('\x1b[41m\x1b[1m Database Ready... \x1b[0m');
}



connection.connect((err) => {
  if (err) {
    console.error(`Error connecting to the MySQL server: ${err}`);
    return;
  }

  console.log('Connected to the MySQL server.');

  createDatabase(databaseName);
});
