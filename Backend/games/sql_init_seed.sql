Create database games;
use games;


-- Create the games table
CREATE TABLE games (
  game_id INT PRIMARY KEY,
  game_name VARCHAR(255),
  platform_compatible VARCHAR(255),
  release_date DATE,
  -- Add more columns as needed
);

-- Create the platforms table
CREATE TABLE platforms (
  platform_id INT PRIMARY KEY,
  platform_name VARCHAR(255),
  -- Add more columns as needed
);

-- Seed the platforms table
INSERT INTO platforms (platform_id, platform_name)
VALUES
  (1, 'PlayStation'),
  (2, 'Xbox'),
  (3, 'Nintendo Switch'),
  -- Add more platforms as needed
;

-- Seed the games table
INSERT INTO games (game_id, game_name, platform_compatible, release_date)
VALUES
  (1, 'Game A', '1,2,3', '2022-01-01'),
  (2, 'Game B', '2,3', '2023-02-15'),
  (3, 'Game C', '1,3', '2021-09-30'),
  -- Add more games as needed
;
