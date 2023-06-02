CREATE TABLE temporary_users (
  userid INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  type enum('customer','admin') not null,
  password varchar(100),
  profile_pic_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userid)
) 
ENGINE = InnoDB;

DELIMITER //

CREATE EVENT delete_old_records_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
BEGIN
  DELETE FROM temporary_users WHERE created_at < (NOW() - INTERVAL 15 DAY);
END//

DELIMITER ;


CREATE DEFINER=`root`@`localhost` TRIGGER `users_AFTER_DELETE` AFTER DELETE ON `users` FOR EACH ROW BEGIN
  INSERT INTO temporary_users (userid, username, email, profile_pic_url,type,password,created_at)
    VALUES (OLD.userid, OLD.username, OLD.email, OLD.profile_pic_url,old.type,old.password,old.created_at);
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `restore_user`(IN user_id INT)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if the user exists in the temporary_users table
    SELECT COUNT(*) INTO user_exists FROM temporary_users WHERE userid = user_id;
    
    IF user_exists = 1 THEN
        -- Restore user by inserting into the users table
        INSERT INTO users (id, username, email, type,profile_pic, created_at,password)
        SELECT userid, username, email,type, profile_pic_url, created_at,password
        FROM temporary_users
        WHERE userid = user_id;
        
        -- Delete the restored user from the temporary_users table
        DELETE FROM temporary_users WHERE userid = user_id;
        
        SELECT 'User restored successfully.';
    ELSE
        SELECT 'User not found in temporary table.';
    END IF;
END