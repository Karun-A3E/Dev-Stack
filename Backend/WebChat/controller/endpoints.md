## Users API
- GET /users: Get all users.
- GET /users/:userid: Get user by ID.
- DELETE /users/:userid: Delete user by ID.
- POST /users: Create a new user.
- PUT /users/:userid: Update user by ID.


## Task API
- GET /tasks: Get all tasks.
- GET /tasks/:taskID: Get task by ID.
- POST /tasks: Create a new task.
- DELETE /tasks/:taskID: Delete task by ID.
- PUT /tasks/:taskID: Update task by ID.


## Task Progress API
- GET /progress/:progressID: Get task progress by ID.
- DELETE /progress/:progressID: Delete task progress by ID.
- POST /progress: Create a new task progress.
- PUT /progress/:progressID: Update task progress by ID.


## Guild
- GET /guild: Get all guilds.
- GET /guild/:guildID: Get guild by ID.
- POST /guild: Create a new guild.
- DELETE /guild/:GuildID: Delete guild by ID.
- PUT /guild/:GuildID: Update guild by ID.


## Guild Membership
- POST /guild/member: Add a new member to the guild.
- DELETE /guild/member/:memberID: Remove a member from the guild.
- GET /guild/:guildID/members: Get all members of a specific guild.


## Guild Member Information
- GET /guild/:guildID/myInfo/:memberID: Get the info of a member of a guild.
- PUT /guild/:guildID/myInfo/:memberID: Edit the nickname property of the member.


## Channels
- POST /guild/:GuildID/channel: Create a new channel for a guild.
- GET /guild/:GuildID/channel: Get all channels belonging to the guild.
- DELETE /guild/channel/:ChannelID: Delete the channel.
- PUT /guild/channel/:ChannelID: Edit the channel information.


## Channel Membership
- POST /guild/:guildID/channel/:ChannelID: Add a guild member to the guild channel.
- DELETE /guild/channel/:ChannelID: Remove a guild member from a guild channel.
- GET /guild/:guildID/channel/:ChannelID: Get all members of a specific voice or text channel.


## Quests
- GET /quests: Get all quests.
- GET /quests/:questID: Get quest by ID.
- POST /quests: Create a new quest.
- DELETE /quests/:questID: Delete quest by ID.
- PUT /quests/:questID: Update quest by ID.


## Quest Content
- POST /quest-content: Add content, levels, and parts for quests.
- GET /quest-content/:questID: Get all content for a specific quest.
- GET /quest-content/:questID/:level: Get content by level and part for a specific quest.
- DELETE /quest-content/:contentID: Remove content by content ID.
- PUT /quest-content/:contentID: Edit content by content ID.


## User Quest Participation
- POST /user-quest-participation: Add user to quest participation.
- DELETE /user-quest-participation/:userID/:questID: Remove user participation in a quest.
- PUT /user-quest-completion/:userID/:questID: Set completion status of a user for a quest.
- GET /user-quests/:userID: Get the quests of a user.


## User Authentication
- POST /login : Login of users
- POST /refresh : Refresh access token of User


## Protected Routes

1. **Users API Endpoints:**

   - `GET /users` - Get all users => allow only admins
   - `GET /users/:userid` - Get a specific user by ID => use the JWT to get UserID
   - `DELETE /users/:userid` - Delete a user by ID => only admins and users can access this route
   - `POST /users` - Add a new user => only admins role
   - `PUT /users/:userid` - Update a user by ID => admin role and userID from token

2. **Task API Endpoints:**

   - `GET /tasks` - Get all tasks => only admin || user can then access only his
   - `GET /tasks/:taskID` - Get a specific task by ID => admin can access all || user can only access his

3. **Task Progress API Endpoints:**

   - `GET /progress/:progressID` - Get progress by ID

4. **Guild Endpoints:**

   - `GET /guild` - Get all guilds
   - `GET /guild/:guildID` - Get a specific guild by ID
   - ... (Other guild endpoints)

5. **Guild Membership Endpoints:**

   - `POST /guild/member` - Add a member to the guild
   - ... (Other guild membership endpoints)

6. **Channel Endpoints:**

   - `POST /guild/:GuildID/channel` - Create a new channel
   - ... (Other channel endpoints)

7. **Quest Endpoints:**

   - `GET /quests` - Get all quests
   - ... (Other quest endpoints)

8. **Quest Content Endpoints:**

   - `POST /quest-content` - Add quest content
   - ... (Other quest content endpoints)

9. **User Quest Participation Endpoints:**

   - `POST /user-quest-participation` - Add user quest participation
   - ... (Other user quest participation endpoints)
