-- SQL Views

CREATE VIEW users_view AS
SELECT userid, username, email, ProfilePic, profile_pic_url, created_at
FROM users;

