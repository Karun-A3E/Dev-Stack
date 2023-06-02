-- Inserting seed values for the category table
INSERT INTO category (catname, cat_description) VALUES
  ('Action', 'Games involving exciting and dynamic gameplay'),
  ('Adventure', 'Games with immersive storytelling and exploration'),
  ('Strategy', 'Games that require critical thinking and planning');

-- Inserting seed values for the platform table
INSERT INTO platform (platform_name, platform_description) VALUES
  ('PC', 'Personal Computer'),
  ('PlayStation', 'Sony PlayStation gaming console'),
  ('Xbox', 'Microsoft Xbox gaming console');

-- Inserting seed values for the games table
INSERT INTO games (title, description, price, platformid, categoryid, released_year) VALUES
  ('Game A', 'Exciting action-packed game', '69.90', '1,2,3', '1,2', 2022),
  ('Game B', 'Thrilling adventure game', '23.90', '2,3', '2', 2021),
  ('Game C', 'Strategic warfare game', '69.90', '1', '3', 2020);

-- Inserting seed values for the users table
-- INSERT INTO users (username, password, email, profile_pic_url) VALUES
--   ('john_doe', 'mypassword123', 'john.doe@example.com', 'https://cdn.example.com/profile_pic.jpg');