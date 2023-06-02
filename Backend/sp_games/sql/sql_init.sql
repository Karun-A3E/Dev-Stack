drop database sp_games;
create database sp_games;	
use sp_games;

--change database name--

CREATE table users (
  userid int not null AUTO_INCREMENT, 
  username varchar(100) UNIQUE not NULL UNIQUE,
  password varchar(500) not null,
  email VARCHAR(100) not NULL UNIQUE,
  -- ProfilePic BLOB CHECK (LENGTH(ProfilePic) <= 1048576),
  profile_pic_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  primary key(id)
);

CREATE table games (
  gameid int not null AUTO_INCREMENT,
  title varchar(100) UNIQUE not NULL,
  description varchar(500),
  price VARCHAR(255) not null,
  platformid varchar(100) not null,
  categoryid VARCHAR(100) not NULL,
  released_year year,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY key(gameid)
);

CREATE TABLE category (
  catid int not null AUTO_INCREMENT,
  catname varchar(100) UNIQUE not NULL,
  cat_description varchar(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(catid)

);

CREATE TABLE platform (
  platformid int not null AUTO_INCREMENT,
  platform_name varchar(100) UNIQUE not NULL,
  platform_description varchar(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(platformid)

);

CREATE table reviews (
  reviewid int not null AUTO_INCREMENT,
  user_id int not NULL,
  game_id int not NULL,
  rating not null INT CHECK (rating >= 0 AND rating <= 10)
  review VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  PRIMARY key(reviewid)
);


