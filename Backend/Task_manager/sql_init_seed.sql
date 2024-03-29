-- Task Manager SQL init and Seed File

CREATE DATABASE TaskManager;

-- Switch to the newly created database
USE TaskManager;

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the teams table
CREATE TABLE Teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create the tasks table
CREATE TABLE Tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    priority INT NOT NULL DEFAULT 0,
    assigned_to INT,
    team_id INT,
    FOREIGN KEY (assigned_to) REFERENCES Users(id),
    FOREIGN KEY (team_id) REFERENCES Teams(id)
);

-- Insert sample users
INSERT INTO Users (username, email, password)
VALUES
    ('john.doe', 'john.doe@example.com', 'password123'),
    ('jane.smith', 'jane.smith@example.com', 'pass456'),
    ('mike.wilson', 'mike.wilson@example.com', 'secretword');

-- Insert sample teams
INSERT INTO Teams (name, description)
VALUES
    ('Development Team', 'Responsible for software development'),
    ('Marketing Team', 'Handles marketing and promotions'),
    ('Operations Team', 'Manages day-to-day operations');

-- Insert sample tasks
INSERT INTO Tasks (title, description, due_date, status, priority, assigned_to, team_id)
VALUES
    ('Implement login functionality', 'Implement user login and authentication', '2023-06-15', 'Pending', 1, 1, 1),
    ('Design landing page', 'Create a visually appealing landing page', '2023-06-20', 'Pending', 2, 2, 1),
    ('Prepare marketing campaign', 'Plan and prepare a marketing campaign', '2023-06-25', 'Pending', 1, 2, 2),
    ('Optimize server performance', 'Identify and optimize server bottlenecks', '2023-06-30', 'Pending', 2, 3, 3);

