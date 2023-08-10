use sp_game;
CREATE TABLE users (
  userid INT NOT NULL AUTO_INCREMENT, 
  username VARCHAR(100) UNIQUE NOT NULL,
  type ENUM('customer','admin') NOT NULL,
  password VARCHAR(500) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  profile_pic_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(userid)
);

CREATE TABLE games (
  gameid INT NOT NULL AUTO_INCREMENT,
  profile_pic_url VARCHAR(255),
  title VARCHAR(600) UNIQUE NOT NULL,
  description VARCHAR(800),
  released_year YEAR NOT NULL,
  status ENUM('Upcoming','Released') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(gameid)
);

CREATE TABLE category (
  catid INT NOT NULL AUTO_INCREMENT,
  catname VARCHAR(100) UNIQUE NOT NULL,
  cat_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(catid)
);

CREATE TABLE platform (
  platformid INT NOT NULL AUTO_INCREMENT,
  platform_name VARCHAR(100) UNIQUE NOT NULL,
  platform_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(platformid)
);

CREATE TABLE games_category (
  gameid INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY(gameid, category_id),
  KEY fk_games_category_category_id (category_id),
  CONSTRAINT fk_games_category_category_id FOREIGN KEY (category_id) REFERENCES category (catid) ON DELETE CASCADE,
  CONSTRAINT fk_games_category_game_id FOREIGN KEY (gameid) REFERENCES games (gameid) ON DELETE CASCADE
);

CREATE TABLE games_platform (
  gameid INT NOT NULL,
  platform_id INT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY(gameid, platform_id),
  KEY fk_games_platform_platform_id (platform_id),
  CONSTRAINT fk_games_platform_game_id FOREIGN KEY (gameid) REFERENCES games (gameid) ON DELETE CASCADE,
  CONSTRAINT fk_games_platform_platform_id FOREIGN KEY (platform_id) REFERENCES platform (platformid) ON DELETE CASCADE
);

CREATE TABLE games_bookmarks (
  gameid INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY(gameid, user_id),
  KEY fk_games_bookmarks_game_id (gameid),
  CONSTRAINT fk_games_bookmarks_game_id FOREIGN KEY (gameid) REFERENCES games (gameid) ON DELETE CASCADE,
  CONSTRAINT fk_games_bookmarks_user_id FOREIGN KEY (user_id) REFERENCES users (userid) ON DELETE CASCADE
);

CREATE TABLE reviews (
  review_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  review TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
  rating INT DEFAULT NULL,
  PRIMARY KEY(review_id),
  KEY user_id (user_id),
  KEY game_id (game_id),
  CONSTRAINT reviews_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (userid),
  CONSTRAINT reviews_ibfk_2 FOREIGN KEY (game_id) REFERENCES games (gameid) ON DELETE CASCADE,
  CONSTRAINT reviews_chk_1 CHECK (rating BETWEEN 0 AND 5)
);

CREATE TABLE orders (
  orderID INT NOT NULL AUTO_INCREMENT,
  userID INT NOT NULL,
  orderStatus ENUM("Processing","Shipped","Delivered"),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (orderID),
  FOREIGN KEY (userID) REFERENCES users (userid) ON DELETE CASCADE
);

CREATE TABLE order_details (
  orderDetailID INT NOT NULL AUTO_INCREMENT,
  orderID INT NOT NULL,
  ProductID INT NOT NULL,
  Platformid INT NOT NULL,
  amount_of_items INT NOT NULL,
  PRIMARY KEY (orderDetailID),
  FOREIGN KEY (orderID) REFERENCES orders (orderID) ON DELETE CASCADE,
  FOREIGN KEY (ProductID, Platformid) REFERENCES games_platform (gameid, platform_id) ON DELETE CASCADE
);


CREATE TABLE paymentInformation (
  paymentID INT NOT NULL AUTO_INCREMENT,
  userID INT NOT NULL,
  paymentType ENUM("Visa","Mastercard","PayPal") NOT NULL,
  LastDigits INT NOT NULL,
  PRIMARY KEY (paymentID),
  FOREIGN KEY (userID) REFERENCES users (userid)
);
