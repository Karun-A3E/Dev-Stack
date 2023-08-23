CREATE or replace view user_profiles_view AS
SELECT userid, username, email, profile_pic_url,type,created_at
FROM users;


CREATE or replace VIEW game_reviews_view AS
SELECT r.review_id, r.game_id, r.user_id, r.review, r.rating, u.username, u.email,u.profile_pic_url
FROM reviews r
JOIN users u ON r.user_id = u.userid;


CREATE VIEW game_categories_view AS
SELECT g.gameid, g.title, c.catname
FROM games g
JOIN games_category gc ON g.gameid = gc.gameid
JOIN category c ON gc.category_id = c.catid;


CREATE VIEW game_platforms_view AS
SELECT g.gameid, g.title, p.platform_name, gp.price
FROM games g
JOIN games_platform gp ON g.gameid = gp.gameid
JOIN platform p ON gp.platform_id = p.platformid;


CREATE VIEW user_bookmarks_view AS
SELECT u.userid, u.username, g.gameid, g.title, g.description, g.released_year
FROM users u
JOIN games_bookmarks gb ON u.userid = gb.user_id
JOIN games g ON gb.gameid = g.gameid;


Create view used_category as 
SELECT c.catid,c.catname ,COUNT(gc.category_id) AS usage_count
FROM category c
JOIN games_category gc ON gc.category_id = c.catid
GROUP BY c.catid
ORDER BY usage_count DESC;

Create view used_platform as 
SELECT p.platformid,p.platform_name ,COUNT(gc.platform_id) AS usage_count
FROM platform p
JOIN games_platform gc ON gc.platform_id = p.platformid
GROUP BY p.platformid
ORDER BY usage_count DESC;

CREATE or replace VIEW game_details_summary_view AS
SELECT g.gameid, g.title, g.description, g.released_year,g.profile_pic_url,g.status,
       COUNT(DISTINCT gb.user_id) AS bookmark_count,
       GROUP_CONCAT(DISTINCT c.catname) AS categories,
       GROUP_CONCAT(DISTINCT p.platform_name) AS platforms,
       GROUP_CONCAT(gp.price) AS prices,
       GROUP_concat(distinct concat(p.platform_name,"-",gp.price) separator ',') as platform_price,
       GROUP_concat(distinct concat(p.platformid) separator ',') as platformIDS,
       AVG(r.rating) AS average_rating
FROM games g
LEFT JOIN games_bookmarks gb ON g.gameid = gb.gameid
LEFT JOIN games_category gc ON g.gameid = gc.gameid
LEFT JOIN category c ON gc.category_id = c.catid
LEFT JOIN games_platform gp ON g.gameid = gp.gameid	
LEFT JOIN platform p ON gp.platform_id = p.platformid
LEFT JOIN game_reviews_view r ON g.gameid = r.game_id
GROUP BY g.gameid
ORDER BY average_rating DESC;


CREATE OR REPLACE VIEW filtered_game_details_view AS
SELECT
  g.gameid,
  g.title,
  g.description,
  g.released_year,
  COUNT(DISTINCT gb.user_id) AS bookmark_count,
  GROUP_CONCAT(DISTINCT c.catname) AS categories,
  GROUP_CONCAT(DISTINCT CONCAT(p.platform_name)) AS platforms,
  gp.price
FROM games g
LEFT JOIN games_bookmarks gb ON g.gameid = gb.gameid
LEFT JOIN games_category gc ON g.gameid = gc.gameid
LEFT JOIN category c ON gc.category_id = c.catid
JOIN games_platform gp ON g.gameid = gp.gameid
JOIN platform p ON gp.platform_id = p.platformid
GROUP BY g.gameid, p.platformid;    

CREATE OR REPLACE VIEW consolidated_order_info AS
SELECT 
    o.orderID,
    o.userID,
    u.username,
    GROUP_CONCAT(CONCAT(gm.title, '-@-', p.price) SEPARATOR ', ') AS product_info,
    SUM(od.amount_of_items * p.price) AS total_price,
    o.orderStatus AS OrderStats
FROM 
    orders o
INNER JOIN 
    users u ON o.userID = u.userID
INNER JOIN 
    order_details od ON o.orderID = od.orderID
INNER JOIN 
    games_platform p ON od.ProductID = p.gameid
INNER JOIN
    games gm ON od.ProductID = gm.gameid
WHERE
    p.platform_id = od.Platformid
GROUP BY 
    o.orderID, o.userID, u.username;