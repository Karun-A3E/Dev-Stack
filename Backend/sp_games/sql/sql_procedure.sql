CREATE DEFINER=`root`@`localhost` PROCEDURE `filter_values`(INOUT platform_ids VARCHAR(255), INOUT category_ids VARCHAR(255))
BEGIN
    DECLARE filtered_platformid VARCHAR(255);
    DECLARE filtered_categoryid VARCHAR(255);

    -- Check if the platformid values exist in the platforms table
    SELECT GROUP_CONCAT(p.platformid) INTO filtered_platformid
    FROM platforms p
    WHERE FIND_IN_SET(p.platformid, platform_ids) > 0;

    SELECT GROUP_CONCAT(c.catid) INTO filtered_categoryid
    FROM category c
    WHERE FIND_IN_SET(c.catid, category_ids) > 0;

    -- Set the filtered platformid and categoryid values
    SET platform_ids = filtered_platformid;
    SET category_ids = filtered_categoryid;
END
