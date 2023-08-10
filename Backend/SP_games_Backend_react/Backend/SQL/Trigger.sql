DELIMITER $$
CREATE TRIGGER enforce_platform_id_constraint
BEFORE INSERT ON order_details
FOR EACH ROW
BEGIN
  DECLARE game_platform_id INT;
  SELECT platform_id INTO game_platform_id FROM games_platform WHERE gameid = NEW.ProductID;
  IF NEW.Platformid != game_platform_id THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Platformid must match the corresponding game platformid';
  END IF;
END$$
DELIMITER ;