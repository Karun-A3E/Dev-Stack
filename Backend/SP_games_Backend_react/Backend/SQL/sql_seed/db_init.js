const mysql = require('mysql');
const fs = require('fs');

const host = process.argv[2];      // to refe to the process string that was entered
const user = process.argv[3]; // to refe to the process string that was entered
const password = process.argv[4]; // to refe to the process string that was entered

const connection = mysql.createConnection({
	host,
	user,
	password,
	multipleStatements: true // this is to allow multiple SQL statements to be ran per file
});

function createDatabase(databaseName) {
	connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (error) => { // creating the database given that it exists
		if (error) {
			console.error(`Error creating database: ${error}`);
			connection.end(); // Close the MySQL connection
			process.exit(1); // Terminate the script with an error
			return;
		}

		console.log(`Database "${databaseName}" created.`);
		connection.query(`USE ${databaseName}`, (error) => {
			if (error) {
				console.error(`Error selecting database: ${error}`);
				connection.end(); // Close the MySQL connection
				process.exit(1); // Terminate the script with an error
				return;
			}
			executeSqlFiles();
		});
	});
}

function executeSqlFiles() {
	const sqlFiles = ['../sql_init.sql','../sql_views.sql','./sql_seed.sql'];
	const status = [
		'\x1b[34mÎõ Tables initialized...\x1b[0m',
		'\x1b[34mÎõ Views Initialized...\x1b[0m',
		'\x1b[32mÎõ Data Inserted...\x1b[0m'
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
// ...


// Connect to the MySQL server
connection.connect((err) => {
	if (err) {
		console.error(`Error connecting to the MySQL server: ${err}`);
		return;
	}

	console.log('Connected to the MySQL server.');

	createDatabase('sp_game');
});

