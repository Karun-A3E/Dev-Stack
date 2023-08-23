-- Create the database
CREATE DATABASE BloggingPlatform;

-- Switch to the newly created database
USE BloggingPlatform;

-- Create the users table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the categories table
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create the posts table
CREATE TABLE Posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT,
    category_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Create the comments table
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_id INT,
    user_id INT,
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);



-- Insert sample users
INSERT INTO Users (username, email, password)
VALUES
    ('john.doe', 'john.doe@example.com', 'password123'),
    ('jane.smith', 'jane.smith@example.com', 'pass456'),
    ('mike.wilson', 'mike.wilson@example.com', 'secretword');

-- Insert sample categories
INSERT INTO Categories (name, description)
VALUES
    ('Technology', 'Articles related to technology and gadgets'),
    ('Travel', 'Posts about travel destinations and experiences'),
    ('Food', 'Delicious recipes and restaurant reviews');

-- Insert sample posts
INSERT INTO Posts (title, content, user_id, category_id)
VALUES
    ('Introduction to JavaScript', 'In this post, we will explore the basics of JavaScript programming language.', 1, 1),
    ('Top 10 Travel Destinations', 'Discover the top 10 travel destinations around the world and start planning your next adventure!', 2, 2),
    ('Delicious Chocolate Cake Recipe', 'Learn how to make a mouth-watering chocolate cake with this easy recipe.', 3, 3);

-- Insert sample comments
INSERT INTO Comments (content, post_id, user_id)
VALUES
    ('Great article! JavaScript is really powerful.', 1, 2),
    ('I totally agree! JavaScript is the backbone of modern web development.', 1, 3),
    ('Thanks for sharing this list of travel destinations. I can''t wait to visit them!', 2, 1),
    ('The chocolate cake recipe looks amazing. I will definitely try it out.', 3, 2);
