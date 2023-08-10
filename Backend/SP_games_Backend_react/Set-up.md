# Project Set-up Procedure
This document outlines the set-up procedure for the project, including both backend and frontend components. Please follow the steps below to get the project up and running.

## Backend Set-up
Change Directory to Backend: Open your terminal or command prompt and navigate to the Backend directory of the project by using the following command:

`cd ./Backend`

Run Backend Script: After changing the directory, execute the following script to start the set-up procedure

- npm run project -- `<MYSQL IP ADDRESS> <USERNAME> <PASSWD>`

Replace `<MYSQL IP ADDRESS>, <USERNAME>, and <PASSWD>` with appropriate values for your MySQL database configuration. For example : `npm run project -- 127.0.0.1 root password`

Once the Set-up for the Database is successful, Start Backend Server: You have two options to start the backend server, either using Nodemon or Node. Use one of the following commands:

Using `Nodemon` (recommended for development):

`nodemon server.js`

Using `Node` (for production):

`node server.js`

The backend server should now be up and running.

## Frontend Set-up
Install Frontend Dependencies: Before starting the frontend, ensure you have all the necessary dependencies installed. In the root directory of the project, execute the following command:


`npm install`
Start Frontend Server: To start the frontend server, use the following command:


`npm start`
The frontend application will be accessible at http://localhost:3000 in your web browser.

## Accessing the Application

### Admin Login:
Username: 1user@gmail.com
Password: password1
Use these credentials to log in as an admin user.

### Customer Login:
Username: 3user@gmail.com
Password: password3

Use these credentials to log in as a customer.

Please ensure you have the correct roles assigned to the respective users for accessing the application features.

Now that you have completed the set-up procedure, you should be able to use the project successfully. 