
## Database Set-up

```
CREATE DATABASE `SP_Tasks`;
USE `SP_Tasks`;
CREATE TABLE `User` (
 `user_id` INT PRIMARY KEY AUTO_INCREMENT,
 `username` TEXT,
 `email` TEXT
);
CREATE TABLE `Task` (
 `task_id` INT PRIMARY KEY AUTO_INCREMENT,
 `title` TEXT,
 `description` TEXT,
 `points` INT
);
CREATE TABLE `TaskProgress` (
 `progress_id` INT PRIMARY KEY AUTO_INCREMENT,
 `user_id` INT NOT NULL,
 `task_id` INT NOT NULL,
 `completion_date` TIMESTAMP,
 `notes` TEXT
);

```

The basic Requirements are the three tables : 
1. Users
2. Task
3. Task Progress

## Endpoints


1. Post /users -- Creating new users by providing their username and email in the request body
  - Successful - Status Code : 201 Created
  - Error - Status Code : 409 -- Duplicate Email found
  - Error - Status Code : 400 -- Missing parameters for username/email
2. Get /users
  - Retrieves the list of all the users with their user_id, username, email
  - Successful - Status Code : 200 OK
3. Get /users/{userid}
  - Retrieves the user details based on the userid
  - Returns the user_id,username,email and total_points of the user
  - Successful - Status Code : 200 OK
  - Error - Status Code : 404 -- Not found if userid is not in the table
4. Put /users/{userid}
  - Updates the user details by providing the user_id, able to update either the username or the email
  - If successful, the response should return the user_id, username and email of the user
  - Successful - Status Code : 200 OK
  - Error - Status Code : 404 Not Found
  - Erorr - Status Code : 409 Duplicate Email/Username Entry
5. Delete /users/{userid} 
  - Deletes the user based on the userid
  - Successful - Status Code : 204 No Content
  - Error - Status Code : 404 Not Found

6. Post /tasks
  - Creates a new task by providing the *title*, *description* , *points*
  - Returns the task_id along with the previous parameters
  - Successful - Status Code : 201 Created
  - Error - Status Code : 400 Bad Request
7. Get /tasks
  - Retrives the list of all the taks with the *task_id*, *title*, *description*, *points*
  - Successful - Status Code : 200 OK
8. Get /tasks/{task_id}
  - Retrives the details of the task based on the ID
  - Successful - Status Code : 200 OK
  - Error - Status Code : 404 Not Found
9. Put /tasks/{task_id}
  - Update the task details based on the task_id in the URL
  - Able to update the **title**, **description**, **points**
  - Successful : Status Code : 200 OK
  - Error - Status Code : 404 Not Found
  - Error - Status Code : 400 Bad Request
10. Delete /tasks/{task_id}
  - Delete the taks by providing the task_id
  - Successful - Status Code : 204 No Content
  - Error - Status Code : 404 Not Found

11. Post /task_progress 
  - Create a new task progress for a user by providing the *user_id*, *task_id*, *completion_date*, and optional *notes* in the request body.
  - Return the aforementioned parameters along with *progress_id*
  - Successful - Status Code : 201 Created
  - Error - Status Code : 404 Not Found
  - Error - Status Code : 400 Bad Request
12.  Get /progress/{progress_id}
  - Retrives the details of the progress based on the ID
  - Successful - Status Code : 200 OK
  - Error - Status Code : 404 Not Found
13. Put /progress/{progress_id}
  - Update the progress details based on the IF in the URL
  - Able to update the **Notes**
  - Successful : Status Code : 200 OK
  - Error - Status Code : 404 Not Found
  - Error - Status Code : 400 Bad Request
14. Delete /progress/{progress_id}
  - Delete the progress by providing the progress_id
  - Successful - Status Code : 204 No Content
  - Error - Status Code : 404 Not Found 


<!-- Additional Endpoints -->
Guild Endpoints:
Create Guild:

Endpoint: POST /guilds
Description: Create a new guild.
Request Body: Guild information (guild_name, owner_id, description, banner, logo).
Response:
201 Created: Guild created successfully.
400 Bad Request: Invalid request payload.
409 Conflict: Guild with the same name already exists.
Get Guild Information:

Endpoint: GET /guilds/{guild_id}
Description: Retrieve information about a specific guild.
Response:
200 OK: Guild information retrieved successfully.
404 Not Found: Guild not found.
Update Guild Information:

Endpoint: PUT /guilds/{guild_id}
Description: Update information for a specific guild.
Request Body: Updated guild information.
Response:
200 OK: Guild information updated successfully.
400 Bad Request: Invalid request payload.
404 Not Found: Guild not found.
Delete Guild:

Endpoint: DELETE /guilds/{guild_id}
Description: Delete a guild and associated data.
Response:
204 No Content: Guild deleted successfully.
404 Not Found: Guild not found.
Guild Membership Endpoints:


Join Guild:

Endpoint: POST /guilds/{guild_id}/join
Description: Join a guild.
Request Body: Member information (member_id, rank, nickname, is_admin).
Response:
201 Created: Joined guild successfully.
400 Bad Request: Invalid request payload.
409 Conflict: Member already part of the guild.
Leave Guild:

Endpoint: POST /guilds/{guild_id}/leave
Description: Leave a guild.
Response:
200 OK: Left guild successfully.
404 Not Found: Guild not found.
Get Guild Members:

Endpoint: GET /guilds/{guild_id}/members
Description: Retrieve a list of members in a guild.
Response:
200 OK: Members retrieved successfully.
404 Not Found: Guild not found.
Update Member Information in Guild:

Endpoint: PUT /guilds/{guild_id}/members/{member_id}
Description: Update member information in a guild.
Request Body: Updated member information.
Response:
200 OK: Member information updated successfully.
400 Bad Request: Invalid request payload.
404 Not Found: Guild or member not found.
Channel Endpoints:
Create Channel:

Endpoint: POST /guilds/{guild_id}/channels
Description: Create a new channel within a guild.
Request Body: Channel information (channel_type, channel_name).
Response:
201 Created: Channel created successfully.
400 Bad Request: Invalid request payload.
409 Conflict: Channel with the same name already exists.
Get Channel Information:

Endpoint: GET /guilds/{guild_id}/channels/{channel_id}
Description: Retrieve information about a specific channel in a guild.
Response:
200 OK: Channel information retrieved successfully.
404 Not Found: Guild or channel not found.
Update Channel Information:

Endpoint: PUT /guilds/{guild_id}/channels/{channel_id}
Description: Update information for a specific channel in a guild.
Request Body: Updated channel information.
Response:
200 OK: Channel information updated successfully.
400 Bad Request: Invalid request payload.
404 Not Found: Guild or channel not found.
Delete Channel:

Endpoint: DELETE /guilds/{guild_id}/channels/{channel_id}
Description: Delete a channel in a guild.
Response:
204 No Content: Channel deleted successfully.
404 Not Found: Guild or channel not found.
Channel Membership Endpoints:
Join Channel:

Endpoint: POST /guilds/{guild_id}/channels/{channel_id}/join
Description: Join a channel within a guild.
Request Body: Member information (member_id, is_admin).
Response:
201 Created: Joined channel successfully.
400 Bad Request: Invalid request payload.
409 Conflict: Member already part of the channel.
Leave Channel:

Endpoint: POST /guilds/{guild_id}/channels/{channel_id}/leave
Description: Leave a channel within a guild.
Response:
200 OK: Left channel successfully.
404 Not Found: Guild or channel not found.
Get Channel Members:

Endpoint: GET /guilds/{guild_id}/channels/{channel_id}/members
Description: Retrieve a list of members in a channel.
Response:
200 OK: Members retrieved successfully.
404 Not Found: Guild or channel not found.
Update Member Information in Channel:

Endpoint: PUT /guilds/{guild_id}/channels/{channel_id}/members/{member_id}
Description: Update member information in a channel.
Request Body: Updated member information.
Response:
200 OK: Member information updated successfully.
400 Bad Request: Invalid request payload.
404 Not Found: Guild, channel, or member not found.

