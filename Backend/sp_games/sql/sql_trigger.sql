CREATE DEFINER=`root`@`localhost` TRIGGER `category_after_delete` AFTER DELETE ON `category` FOR EACH ROW BEGIN
	DECLARE deleted_catid INT;
    SET deleted_catid = OLD.catid;
    SET SQL_SAFE_UPDATES = 0;
    -- Use the `deleted_catid` in your trigger logic
    -- For example, you can update the `games` table
    UPDATE games
    SET categoryid = TRIM(BOTH ',' FROM REPLACE(CONCAT(',', categoryid, ','), CONCAT(',', deleted_catid, ','), ','))
    WHERE FIND_IN_SET(deleted_catid, categoryid) > 0;
    SET SQL_SAFE_UPDATES = 1
END


CREATE DEFINER=`root`@`localhost` TRIGGER `platforms_AFTER_DELETE` AFTER DELETE ON `platforms` FOR EACH ROW BEGIN
	DECLARE deleted_platformid INT;
    SET deleted_platformid = OLD.platformid;
    SET SQL_SAFE_UPDATES = 0;
    -- Use the `deleted_catid` in your trigger logic
    -- For example, you can update the `games` table
    UPDATE games
    SET platformid = TRIM(BOTH ',' FROM REPLACE(CONCAT(',', platformid, ','), CONCAT(',', deleted_platformid, ','), ','))
    WHERE FIND_IN_SET(deleted_platformid, platformid) > 0;
    SET SQL_SAFE_UPDATES = 1
END


CREATE DEFINER=`root`@`localhost` TRIGGER `games_BEFORE_INSERT` BEFORE INSERT ON `games` FOR EACH ROW BEGIN
CALL filter_values(NEW.platformid, NEW.categoryid);
END


CREATE DEFINER=`root`@`localhost` TRIGGER `games_BEFORE_UPDATE` BEFORE UPDATE ON `games` FOR EACH ROW BEGIN
CALL filter_values(NEW.platformid, NEW.categoryid);	
END

