# Game Platform API
The Game Platform API is a RESTful API that provides information about games, platforms, categories, and user-related functionalities. It allows users to retrieve, create, update, and delete data related to games, platforms, categories, and user accounts.

# Features
1. Get a list of all users
2. Get detailed information about a specific user
3. Add a new user
4. Get games by platform
5. Create a new game entry
7. Update an existing game entry
8. Delete a game entry
9. Get reviews of a particular game
10. Add a review for a game
11. Add A New Category

# Technologies Used
  1. Node.js
  2. Express.js
  3. MySQL (or any other database of your choice)
  4. JavaScript
## Installation

  1. Clone the repository: git clone <repository-url>
  2. Install dependencies: npm install
    2.1 *npm install express --save*
    2.2 *npm install mysql --save*
    2.3 *npm install body-parsre*
  3. Set up the database:
    3.1 Create a new database (e.g., game_platform_db) in your MySQL server
    3.2 Import the database schema, and run the files in the sql Folder : 
      3.2a sql_init.sql
      3.2b recovery_sql.sql
      3.2c sql_seed.sql
      3.2d sql_procedure.sql
      3.2e sql_trigger.sql
      3.2f views.sql
    3.3 Update the database connection configuration in databaseconfig.js file
  4. Star the server: npm start server.js / node server.js / nodemon server.js


# Error Handling
In case of any errors, the API will respond with appropriate status codes and error messages to indicate the issue. Here are the common error responses:

1. 400 Bad Request: The request is invalid or missing required parameters.
2. 404 Not Found: The requested resource was not found.
3. 422 Unprocessable Entity: The request was understood, but it contained invalid parameters or conflicts with existing data.
4. 500 Internal Server Error: An unexpected error occurred on the server.

# Details
Author : Karun
Class : DISM 22 / 5667