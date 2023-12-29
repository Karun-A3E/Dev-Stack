var express = require('express');
var bodyParser = require('body-parser');
const path = require('path')
const cookieparser = require('cookie-parser');
const url = require('url');
const fs = require('fs')
var jwt = require('jsonwebtoken');
const multer = require('multer');



var app = express();

app.use(cookieparser())
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);


//! Authentication
var config = require('../auth/secretKey'); //* Used for the JWT Secret Key Token
const verifyToken = require('../auth/VerifyToken') //* The token that will verify the incoming Token to see if the user is Authenticated



function checkRole(role) {
  return function (req, res, next) {
    if (req.role && req.role === role) {
      next();
    } else {
      res.status(403);
      return res.send({ auth: false, message: 'Insufficient permissions!' });
    }
  };
}


const checkAdminRole = checkRole('admin');
function checkMemberPermission(req, res, next) {
  const requestedUserId = req.params.userid;
  if (req.role === 'admin' ||parseInt(req.userId) === parseInt(requestedUserId)) {
    // Admins or the user themselves have permission
    next();
  } else {
    // res.status(403).send({ auth: false, message: 'Insufficient permissions!' });
    return res.redirect(`/users/${req.userId}`);
  }
}
const memberRestriction = checkMemberPermission

//! 

//? Endpoint Modules 
const userEndpoints = require('../models/api/user')
const taskEndpoints = require('../models/api/tasks')
const taskProgressEndpoints = require('../models/api/task_progress')
const guildEndpoints = require('../models/api/guild_Socials')
const questEndpoints = require('../models/api/quest_users');
const Guild = require('../models/api/guild_Socials');
const guildRoles = require('../models/api/guildRole')
const misc = require('../models/misc')
//? 

//*
const error_msges = '../models/errorMsg.json'
const errorMessages = misc.readJsonFile(error_msges)['sqlErrors']
//*

//? -------------------Multer Configuration----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const fileName = uniqueSuffix + extension;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Add any file filtering logic here if needed
    cb(null, true);
  },
});

//? -------------------------------------------------------------------

//! User Authentication and Persistent Accessibility
app.post('/login', async (req, res) => {
  let access_token; let refreshToken;
  const { email, password } = req.body;
  try {
    if(!email || !password){
      return res.status(400).send('Bad request')
    }
    // let data = [email[0],password[0]]
    let data = [email, password]
    // console.log(data)
    let UserAmount = await userEndpoints.findUserCount(data);

    if (UserAmount.length>0) {
      let UserInfo = await userEndpoints.getUserByID(UserAmount[0].id)
      UserInfo = UserInfo[0]
      access_token = jwt.sign({ id: UserInfo.user_id, role: UserInfo.role }, config.key, { expiresIn: '2h' });
      refreshToken = jwt.sign({ id: UserInfo.user_id, role: UserInfo.role }, config.refresh, { expiresIn: '24h' });
      access_token = "Bearer " + access_token
      res.status(201).send({ id: UserInfo.user_id, type: UserInfo.role, refreshTkt: refreshToken, accessTkt: access_token })
    }
    else {    
      return res.status(404).send('User Unknown')
    }
  } catch (error) {
    console.log(error)
  }
})


app.post('/refresh', async (req, res) => {
  const refreshToken = req.headers['refresh-token'];
  if (!refreshToken) {
    res.status(403);
    return res.send({ auth: false, message: 'No refresh token provided!' });
  }

  jwt.verify(refreshToken, config.refresh, (err, decoded) => {
    if (err) {
      res.status(403);
      return res.send({ auth: false, message: 'Invalid refresh token!' });
    }

    // Generate a new access token
    const newAccessToken = "Bearer " + jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.key,
      { expiresIn: 20 }
    );

    res.status(200).send({ accessTkt: newAccessToken });
  });
});



//!

//! Users API
app.get('/users',verifyToken,checkAdminRole, async (req, res) => {
  try {
    let users = await userEndpoints.getAllUsers()
    res.status(200).send({ 'success': true, 'data': users })
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})

app.get('/users/:userid',verifyToken,memberRestriction, async (req, res) => {
  const userid = req.params.userid
  try {
    let users = await userEndpoints.getUserByID(userid)
    res.status(users.length === 0 ? 404 : 200).send(
      users.length === 0 ? 'Not Found' : { 'success': true, 'data': users }
    );
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})

/*
  In the app delete, admins can access everyone whereas as a user he/she can only his/her own profile
  by doing so it succeeds in deleting except 1 issue

  ! Deleting User means the user does not exist but the Tokens are still valid
  * To resolve this issue there are 2 forseeable methods to be implemented : 
  ? 1. Add in Set called tokenBlacklist then add in the tokens after which use the function below to chekc token status :: 
  In-memory token blacklist (replace this with a persistent storage in production)
  * const tokenBlacklist = new Set();

  Middleware to check if a token is blacklisted
  *function checkTokenBlacklist(req, res, next) {
  *  const token = req.headers.authorization;
  *  if (token && tokenBlacklist.has(token)) {
  *    res.status(401).send('Unauthorized: Token revoked');
  *  } else {
  *    next();
  *  }
  *}

  ? By doing so the token can be verified, but this is not a good method

  ? 2. RECOMMEDED METHOD : Use a in-memory database like Redis
  * By implementing a redis database to store the blacklist we can remove access to users temporarily
  * After 2 hours the tokens can be removed, as by then the token is basically invalid

  ? 3. RECOMMEDED METHOD : In the front end, use AxisInterceptors to remove the headers of authorization and refresh token
*/
app.delete('/users/:userid',verifyToken,memberRestriction, async (req, res) => {
  const userid = req.params.userid;

  try {

    const userCount = await userEndpoints.getUserCountByID(userid);

    if (userCount.length === 0) {
      res.status(404).send('Not Found');
    } else {
      let users = await userEndpoints.deleteUserByID(userid);
      res.status(204).send({ 'success': true, 'data': users });
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);

    console.error(error);
  }
});


app.post('/users', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).send('Bad Request: Both username and email are required');
      return;
    }
    const type = 'member'
    const values = [username, email, password, type];
    const results = await userEndpoints.addNewUser(values)
    let insert_id = results.insertId;
    res.status(201).send(`{"userID" : ${insert_id}}`);
  } catch (error) {
    if (error) {
      const error_obj = errorMessages && errorMessages[error.code];

      const status = error_obj ? error_obj.responseCode : 500;
      const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

      res.status(status).send(message);

    }
  }
})

app.put('/users/:userid',verifyToken,checkAdminRole, async (req, res) => {
  const userid = req.params.userid;
  const userCount = await userEndpoints.getUserCountByID(userid)
  if (userCount == 0) {
    res.status(404).send('Not Found');
  }
  else {
    const { username, email, password } = req.body

    try {
      const updateFields = {};
      if (username) {
        updateFields.username = username;
      }
      if (email) {
        updateFields.email = email;
      }
      if (password) {
        updateFields.password = password;
      }
      const updatedUser = await userEndpoints.updateUserByID(userid, updateFields);
      res.status(200).json(updatedUser);

    } catch (error) {
      console.error("Error updating user information:", error);
      const error_obj = errorMessages && errorMessages[error.code];

      const status = error_obj ? error_obj.responseCode : 500;
      const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

      res.status(status).send(message);
    }
  }
})

//!

//! Task API 
app.get('/tasks', async (req, res) => {
  try {
    const results = await taskEndpoints.getAllTasks()
    return res.status(200).send({ 'success': true, 'data': results })
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

app.get('/tasks/:taskID', async (req, res) => {
  const taskID = req.params.taskID;
  try {
    const results = await taskEndpoints.getTaskByID(taskID)
    res.status(results.length === 0 ? 404 : 200).send(
      results.length === 0 ? 'Not Found' : { 'success': true, 'data': results }
    );
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

app.post('/tasks', async (req, res) => {
  try {
    let { title, description, points } = req.body
    let values = [title, description, points]
    const results = await taskEndpoints.createNewTask(values)
    let insert_id = results.insertId;
    res.status(201).send(`{"taskID" : ${insert_id}}`);
  } catch (error) {
    if (error.errno == 1062) {
      res.status(422).send('Unprocessable Entity');
    } else {
      res.status(500).send('Internal Server Error');
    }
    console.error(err);
  }

})

app.delete('/tasks/:taskID', async (req, res) => {
  const taskID = req.params.taskID;

  try {
    const taskCount = await taskEndpoints.getTaskCountByID(taskID);

    if (taskCount.length === 0) {
      res.status(404).send('Not Found');
    } else {
      const results = await taskEndpoints.removeTaskByID(taskID);
      res.status(200).send({ 'success': true, 'data': results });
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

app.put('/tasks/:taskID', async (req, res) => {
  const taskID = req.params.taskID;
  const { title, description, points } = req.body;

  try {
    // Check the progress count before updating
    const progressCount = await taskEndpoints.getTaskCountByID(taskID);

    if (progressCount.length === 0) {
      res.status(404).json({ error: 'Progress not found for the task' });
    } else {
      // Progress exists, proceed with the update
      const updateFields = {};
      if (title) {
        updateFields.title = title;
      }
      if (description) {
        updateFields.description = description;
      }
      if (points) {
        updateFields.points = points;
      }

      const updatedTask = await taskEndpoints.updateTaskByID(taskID, updateFields);
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error("Error updating task information:", error);
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//!

//! Task Progress API
app.get('/progress/:progressID', async (req, res) => {
  const progressID = req.params.progressID;

  try {

    const results = await taskProgressEndpoints.getTaskProgressByID(progressID);
    res.status(results.length === 0 ? 404 : 200).send(
      results.length === 0 ? 'Not Found' : { 'success': true, 'data': results }
    );
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

app.delete('/progress/:progressID', async (req, res) => {
  const progressID = req.params.progressID;

  try {

    const progressCount = await taskProgressEndpoints.getProgressCount(progressID);
    if (progressCount.length === 0) {
      res.status(404).send('Not Found');
    } else {
      const results = await taskProgressEndpoints.deleteProgress(taskID);
      res.status(200).send({ 'success': true, 'data': results });
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

app.post('/progress', async (req, res) => {
  const { user_id, task_id, completion_Date } = req.body
  const notes = req.body.notes ? req.body.notes : 'Nill'
  if (!user_id || !task_id) {
    return res.status(400).send('User ID, task ID, and completion date are required.');
  }

  try {
    const results = await taskProgressEndpoints.postProgress([user_id, task_id, completion_Date, notes])
    let insert_id = results.insertId;
    res.status(201).send(`{"ProgressID" : ${insert_id}}`);
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

app.put('/progress/:progressID', async (req, res) => {
  const notes = req.body.notes;
  const progressID = req.params.progressID;

  try {
    const updateFields = {};
    if (notes) {
      updateFields.notes = notes;
    }

    const updatedProgress = await taskProgressEndpoints.updateProgress(updateFields, progressID);
    if (updatedProgress.affectedRows === 0) {
      res.status(404).json({ error: "Resource not found" });
    } else {
      res.status(200).json(updatedProgress);
    }
  } catch (error) {
    console.error("Error updating progress:", error);

    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});
//!


//! Guild Roles, and Permissions

async function checkOwnerAccess(req, res, next) {
  const GuildID = (req.params.guildID);
  const userIDFromToken = (req.userId); // Assuming your user ID is stored in req.userId after token verification

  try {
    const guildMembership = await guildRoles.checkOwnerAccess(GuildID,userIDFromToken);
    // console.log(guildMembership)
    if (!guildMembership || !guildMembership[0]['count']) {
      res.status(403).send('Forbidden: Insufficient permissions!');
    } else {
      next(); // Continue to the next middleware or route handler
    }
  } catch (error) {
    console.error(error);
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
}

async function checkMemberAccess(req, res, next) {
  const GuildID = (req.params.guildID);
  const userIDFromToken = (req.userId); // Assuming your user ID is stored in req.userId after token verification

  try {
    const guildMembership = await guildRoles.checkIfuserIsPartOfGuild(GuildID,userIDFromToken);
    // console.log(guildMembership)
    if (!guildMembership || !guildMembership[0]['count']) {
      res.status(403).send('Forbidden: Insufficient permissions!');
    } else {
      next(); // Continue to the next middleware or route handler
    }
  } catch (error) {
    console.error(error);
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
}

async function memberPerm(permID, userId, guildId) {
  try {
      const hasPermission = await guildRoles.checkUserPerm(userId, guildId, permID);
      if(hasPermission[0]['member']!=0){
        return true
      }
      else{
        return false
      }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function checkGuildExistence(req, res, next){
  const GuildID = req.params.guildID
  try {
    const guildCount = await guildEndpoints.getGuildCount(GuildID)
    if (guildCount[0]['count(*)'] === 0) {
      res.status(404).send('Not Found')
    }
    else{
      next()
    }
  } catch (error) {
    
  }
}

async function checkChannelMembership(req, res, next) {
  const GuildID = (req.params.guildID);
  const userIDFromToken = (req.userId); // Assuming your user ID is stored in req.userId after token verification
  const channelID = req.params.ChannelID
  try {
    const guildMembership = await guildRoles.checkChannelAccess(channelID,GuildID,userIDFromToken);
    // console.log(guildMembership)
    if (!guildMembership || !guildMembership[0]['count']) {
      res.status(403).send('Forbidden: Insufficient permissions!');
    } else {
      next(); // Continue to the next middleware or route handler
    }
  } catch (error) {
    console.error(error);
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
}

//!


//! Guild


//* Get all the guilds
app.get('/guild',verifyToken, async (req, res) => {
  try {
    const results = await Guild.getAllGuilds()
    res.status(200).send({ Success: true, Data: results })
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Get a specific Guild By ID
app.get('/guild/:guildID',verifyToken,checkGuildExistence, async (req, res) => {
  const guildID = req.params.guildID;
  try {
    const results = await guildEndpoints.GetGuildInfo(guildID);

    if (results.length === 0) {
      res.status(404).send('Not Found');
    } else {
      const guildInfo = results[0];

      // Check if the guild has a banner
      if (guildInfo.banner) {
        // If the guild has a banner, add an imageView object to the response
        guildInfo.imageView = {
          url: `/guild/${guildID}/banner`,
          alt: 'Guild Banner',
        };
      }

      res.status(200).send({
        success: true,
        data: guildInfo,
      });
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//* Get the Banner Image  of a Specific GuildID
app.get('/guild/:guildID/banner',verifyToken,checkGuildExistence, async (req, res) => {
  const guildID = req.params.guildID;

  try {
    const results = await guildEndpoints.GetGuildInfo(guildID);

    if (results.length === 0 || !results[0].banner) {
      res.status(404).send('Not Found');
    } else {
      const bannerPath = results[0].banner;

      // Convert the relative path to an absolute path
      const absolutePath = path.join(__dirname,'../', bannerPath);

      // Send the file
      res.sendFile(absolutePath);
    }
  } catch (error) {
    console.error(error)
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//* Create a new guild
app.post('/guild',verifyToken,upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), async (req, res) => {
  try {
    const { guild_name, description } = req.body;
    const bannerPath = req.files['banner'] ? req.files['banner'][0].path : null;
    const logoPath = req.files['logo'] ? req.files['logo'][0].path : null;
  
    if (!guild_name) {
      return res.status(400).send('Guild Name and Master ID are required.');
    }
    const sanitizedDescription = description || null;

    const results = await Guild.CreateNewGuild([guild_name, sanitizedDescription, bannerPath, logoPath])
    let insert_id = results.insertId;
    if(insert_id){
      const creator_id = req.userId; // Assuming you have userId available in req from verifyToken middleware
      const role_id = 1;
      const is_admin = true;
      const creatorNickname = (await userEndpoints.getUsername(creator_id))[0].username;
  
      await guildEndpoints.addGuildMember([creator_id,role_id,creatorNickname,is_admin,insert_id]);
    }
    res.status(201).send(`{"Guild ID" : ${insert_id}}`);
  } catch (error) {
    console.log(error)
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Delete a Guild
app.delete('/guild/:guildID',verifyToken,checkGuildExistence,checkOwnerAccess, async (req, res) => {
  const GuildID = req.params.guildID;
  try {
    const GuildCount = await guildEndpoints.getGuildCount(GuildID);

    if (GuildCount[0]['count(*)'] === 0) {
      res.status(404).send('Not Found');
    } else {
      const guildInfo = await guildEndpoints.GetGuildInfo(GuildID);
      const results = await guildEndpoints.DeleteGuild(GuildID);
      if (guildInfo.length > 0 && guildInfo[0].banner) {
        // console.log(guildInfo[0].banner)
        const bannerPath = guildInfo[0].banner;
        const absolutePath = path.join(__dirname,'../',bannerPath);
        // console.log(absolutePath)
        // Delete the file
        await fs.promises.unlink(absolutePath);
      }

      res.status(200).send({ 'success': true, 'data': results });
    }
  } catch (error) {
    console.error(error)
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Edit Guild Information
app.put('/guild/:guildID', verifyToken,checkGuildExistence,checkOwnerAccess, async (req, res) => {
  let updateFields = {}
  try {
    const GuildID = req.params.guildID;
    const GuildCount = await guildEndpoints.getGuildCount(GuildID);
    // console.log(GuildCount)
    if (GuildCount[0]['count(*)'] === 0) {
      res.status(404).send('Not Found');
    } else {
      const { guild_name, description, banner, logo } = req.body;
      if (guild_name) {
        updateFields.guild_name = guild_name
      }
      if (description) {
        updateFields.description = description
      }
      if (banner) {
        updateFields.banner = banner
      }
      if (logo) {
        updateFields.logo = logo
      }
      // console.log(updateFields)
        const results = await guildEndpoints.UpdateGuild(req.body, GuildID)
        return res.status(201).send(results)

    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//? Guild Membership

//* Add in a new member to the Guild
app.post('/guild/:guildID/member',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const { member_id, nickname } = req.body;
  const guild_id = req.params.guildID
  const is_admin = false;
  const role_id = 5
  let sanitizedNickname = nickname || (await userEndpoints.getUsername(member_id))[0].username
  try {
    const hasPermission =await memberPerm(2, req.userId, guild_id);
    if(hasPermission){
      const results = await guildEndpoints.addGuildMember([member_id,role_id, sanitizedNickname, is_admin, guild_id])
      return res.status(200).send({ Status: "Success", data: results })
    }
    else{
      return res.status(403).send('Unauthorized Permission')
    }

  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})



//* Remove a member from the guild
app.delete('/guild/:guildID/member', verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const {member_id} = req.body
  const guild_id = req.params.guildID
  try {
    const hasPermission =await memberPerm(3, req.userId, guild_id);
    if(hasPermission){
      const results = await guildEndpoints.RemoveGuildMember(member_id, guild_id)
      // console.log(results)
      res.status(204).send(results)
    }
    else{
      return res.status(403).send('Unauthorized Permission')
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Get all members of a specific Guild
app.get('/guild/:guildID/member', verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const guildID = req.params.guildID
  try {
    const results = await guildEndpoints.getGuildMembers(guildID)
    res.status(200).send({ Success: true, data: results })
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Get the Guilds I am part of 
app.get('/myGuild',verifyToken, async(req,res)=>{
  let userId=req.userId;
  try {
    const guild_participation =await guildEndpoints.getAllGuildOfMine(userId)
    // console.log(guild_participation)
    res.status(200).send(guild_participation)
  } catch (error) {
    console.log(error)
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})


//?


//? Guild Member Information

//* Get the Info of a Member of a Guild that you belong to
app.get('/guild/:guildID/member/:memberID',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const memberID = req.params.memberID;
  const guildId = req.params.guildID
  try {
    const results = await guildEndpoints.getGuildMemberProfile(guildId,memberID)
    res.status(results.length === 0 ? 404 : 200).send(
      results.length === 0 ? 'Not Found' : { 'success': true, 'data': results }
    );
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Edit the NickName Property of the Member 
app.put('/guild/:guildID/myInfo',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const memberID = req.userId
  const guildId = req.params.guildID
  const { nickname } = req.body;
  updateFields = {}
  try {
    if (nickname) {
      updateFields.nickname = nickname
    }
    const resullts = await guildEndpoints.editMemberInfo(memberID, guildId, updateFields)
    res.status(201).send(resullts)
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//?

//? Guild Roles Create New, Update New Delete Some Custom Roles

//* Create New Roles with Perm
app.post('/guild/:guildID/role',verifyToken,checkGuildExistence,checkMemberAccess,async(req,res)=>{
  const guild_id = req.params.guildID;
  const {role_name,permission_string}=req.body
  let perm_array = permission_string.split(',')
  let default_role = 0
  try {
    const hasPermission =await memberPerm(10, req.userId, guild_id);
    if(hasPermission){
      const results = await guildRoles.postNewRole([role_name,default_role,guild_id])
      const insert_id = results.insertId;
      const permissionsMap = perm_array.reduce((acc, value, index) => {
        if (value === '1') {
          acc.push(index + 1);
        }
        return acc;
      }, []);
      const permissionsInserts = permissionsMap.map(async (permissionIndex) => {
        const permResults = await guildRoles.postNewPerm([insert_id, permissionIndex]);
        return permResults.insertId;
      });

      const permissionInsertIds = await Promise.all(permissionsInserts);
      res.status(201).send({ success: true, role_id: insert_id, permissions: permissionInsertIds });
    }
    else{
      return res.status(403).send('Insufficient Permissions')
    }
    
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})
//* Assign Users with Roles
app.patch('/guild/:guildID/member/role', verifyToken, checkGuildExistence, checkMemberAccess, async (req, res) => {
  const { member_id, new_role_id } = req.body;
  const guild_id = req.params.guildID;
  try {
    const memberExistsInGuild = await guildEndpoints.checkIFActiveMemberInGuild(member_id, guild_id);
    // console.log(memberExistsInGuild)
    if (!(memberExistsInGuild[0][ 'count(*)']>0)) {
      return res.status(404).send('Member not found in the guild');
    }

    const hasPermission = await memberPerm(11, req.userId, guild_id);

    if (hasPermission) {
      const results = await guildEndpoints.ChangeMemberRole(member_id, guild_id, new_role_id);
      // console.log(results);
      res.status(200).send(results);
    } else {
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});
//* Delete Non-Default Roles of A Guild
app.delete('/guild/:guildID/role/:roleID', verifyToken, checkGuildExistence, checkMemberAccess, async (req, res) => {
  const role_id = req.params.roleID;
  const guild_id = req.params.guildID; // Assuming checkGuildExistence sets req.guild_id

  try {
    // Check if the guild role is custom and belongs to the user's guild
    const isCustomGuildRole = await guildRoles.CheckCustomGuildRole(role_id, guild_id);
    if (!isCustomGuildRole) {
      return res.status(404).send('Custom guild role not found');
    }

    // Delete the custom guild role
    const deleteResult = await guildRoles.DeleteCustomGuildRole(role_id, guild_id);
    // console.log(deleteResult)

    res.status(204).send(); // Assuming successful deletion returns no content
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});
//* Assign New Perm For Role
app.post('/guild/:guildID/role/permission', verifyToken, checkGuildExistence, checkMemberAccess, async (req, res) => {
  const { role_id, permission_id } = req.body;
  const guild_id = req.params.guildID;

  try {
    // Check if the guild role is custom and belongs to the user's guild
    const isCustomGuildRole = await guildRoles.CheckCustomGuildRole(role_id, guild_id);
    if (!isCustomGuildRole) {
      return res.status(404).send('Custom guild role not found');
    }

    const hasPermission = await memberPerm(10, req.userId, guild_id);

    if (hasPermission) {
      const results = await guildRoles.AddGuildRolePermission(role_id, permission_id);
      res.status(200).send(results);
    } else {
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//* Remove Perm For Role
app.delete('/guild/:guildID/permission/role', verifyToken, checkGuildExistence, checkMemberAccess, async (req, res) => {
  const { role_id, permission_id } = req.body;
  console.log(permission_id)
  const guild_id = req.params.guildID; // Assuming checkGuildExistence sets req.guild_id
  console.log(role_id,guild_id)
  try {
    // Check if the guild role is custom and belongs to the user's guild
    const isCustomGuildRole = await guildRoles.CheckCustomGuildRole(role_id, guild_id);
    
    if (!isCustomGuildRole) {
      return res.status(404).send('Custom guild role not found');
    }

    const hasPermission = await memberPerm(10, req.userId, guild_id);

    if (hasPermission) {
      const results = await guildRoles.RemoveGuildRolePermission(role_id, permission_id);
      console.log(results);
      res.status(204).send(results);
    } else {
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//?

//! Channels

//? Channel Creation, removal, edit and get

//* Create a new channel for a Guild
app.post("/guild/:guildID/channel",verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const guild_ID = req.params.guildID;
  const { channel_type, channel_name } = req.body
  let sanitizedType = channel_type || 'chat'
  try {
    const hasPermission = await memberPerm(5, req.userId, guild_ID);
    if (hasPermission) {
      const createNewChannel = await guildEndpoints.createChannel([sanitizedType, channel_name, guild_ID])
      res.status(201).send(createNewChannel)
    } else {
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Get all the Channels belonging to the Guild
app.get("/guild/:guildID/channel",verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const guild_ID = req.params.guildID;
  try {
    const hasPermission = await memberPerm(4, req.userId, guild_ID);
    if(hasPermission){
      const results = await guildEndpoints.getChannelsByGuild(guild_ID)
      if (results.length == 0) {
        res.status(404).send('No Channels Created')
      }
      else {
        res.status(201).send(results)
      }
    }else{
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Delete the Channel belonging
app.delete("/guild/:guildID/channel/:ChannelID",verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const channel_id = req.params.ChannelID;
  try {
    const hasPermission = await memberPerm(7, req.userId, guild_ID);
    if(hasPermission){
      const deleteChannelContent = await guildEndpoints.deleteChannel(channel_id)
      res.status(201).send(deleteChannelContent)
    }else{
      return res.status(403).send('Unauthorized Permission');
    }

  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})

//* Edit the Channel Information
app.put('/guild/:guildID/channel/:ChannelID',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const channel_id = req.params.ChannelID;
  let updateFields = {};
  const { channel_type, channel_name } = req.body;

  try {
    const hasPermission = await memberPerm(6, req.userId, guild_ID);
    if(hasPermission){
      if (channel_type) {
        updateFields['channel_type'] = channel_type
      }
      if (channel_name) {
        updateFields['channel_name'] = channel_name
      }
      const updatedresults = await guildEndpoints.EditChannelInfo(channel_id, updateFields);
      res.status(201).send(updatedresults)
    }else{
      return res.status(403).send('Unauthorized Permission');
    }

  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})


//?


//? Channel Membership remove and add

//* Add a guild member to the guild channel
app.post('/guild/:guildID/channel/:ChannelID',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const userID = req.query.userID;
  const guildID = req.params.guildID
  const channelID = req.params.ChannelID;
  // Checks to see if the User is already in the Server
  try {
    const hasPermission = await memberPerm(8, req.userId, guildID);
    if (!hasPermission) throw new Error("You do not have permission to perform this action.")
    else{
      guildEndpoints.addChannelMember([userID, guildID, channelID], (results, error) => {

        if (error) {
          console.log(error)
          res.status(500).send('Internal Server Error')
        }
        else {
          res.status(201).send(results)
        }
      })
    }
    
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})
//* Remove a Guild Member from a Guild Channel
app.delete('/guild/:guildID/channel/:ChannelID',verifyToken,checkGuildExistence,checkMemberAccess, async (req, res) => {
  const userID = req.query.userID;
  const channelID = req.params.ChannelID;
  const guildID = req.params.guildID

  try {
    const hasPermission = await memberPerm(9, req.userId, guildID);
    if(hasPermission){
      const result = await guildEndpoints.removeChannelMember([channelID, userID]);
      return res.status(204).send(result)
    }
    else{
      return res.status(403).send('Unauthorized Permission');
    }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})



//* Get all members of a specific voice or text channel
app.get('/guild/:guildID/channel/:ChannelID',verifyToken,checkGuildExistence,checkMemberAccess,checkChannelMembership, async (req, res) => {
  let channelID = req.params.ChannelID;
  let guildID = req.params.guildID
  let userID = req.query.userID;
  console.log(userID)
  try {
      const results = await guildEndpoints.getChannelMembers(guildID, channelID);
      if (results.length == 0) {
        res.status(404).json({ message: 'No members found for that channel.' })
      }
      else {
        return res.status(200).send(results)
      }
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }

})
//?

//!



//! Quests

//? Creation, Delete, Editing and Getting Of Quests

//*  Get all quests
app.get('/quests', async (req, res) => {
  try {
    const results = await questEndpoints.GetAllQuests();
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Get a specific quest by ID
app.get('/quests/:questID', async (req, res) => {
  const questID = req.params.questID;
  try {
    const results = await questEndpoints.GetQuestInfo(questID);
    res.status(results.length === 0 ? 404 : 200).send(
      results.length === 0 ? 'Not Found' : { success: true, data: results }
    );
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Create a new quest
app.post('/quests', async (req, res) => {
  try {
    const userID = req.query.userID
    const { title, description, reward_points, start_date, end_date, guildID } = req.body;

    if (!title || !start_date || !end_date || !guildID || !userID || !reward_points) {
      return res.status(400).send('Title, start date, and end date are required.');
    }
    const userCheck = await guildEndpoints.checkIFActiveMemberInGuild(userID, guildID);
    if (userCheck[0]['count(*)'] === 0) {
      return res.status(403).json({ message: 'User not a member of this server' });
    }
    else {
      // Call the CreateNewQuest function
      const results = await questEndpoints.CreateNewQuest([title, description, reward_points, start_date, end_date, userID, guildID]);

      // Extract the insert ID and send the response
      const insert_id = results.insertId;
      res.status(201).send({ success: true, insert_id });
    }

  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Delete a quest
app.delete('/quests/:questID', async (req, res) => {
  const questID = req.params.questID;
  try {
    const results = await questEndpoints.DeleteQuest(questID);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Edit quest information
app.put('/quests/:questID', async (req, res) => {
  const questID = req.params.questID;
  const updateFields = {}
  try {
    const { title, description, reward_points, start_date, end_date } = req.body;

    if (title) {
      updateFields.title = title
    }

    if (description) {
      updateFields.description = description
    }

    if (reward_points) {
      updateFields.reward_points = reward_points

    }

    if (start_date) {
      updateFields.start_date = start_date

    }

    if (end_date) {
      updateFields.end_date = end_date

    }

    // Call the UpdateQuest function
    const results = await questEndpoints.UpdateQuest(
      updateFields,
      questID
    );

    // Send the response
    res.status(201).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//?


//? Quest Content -- Add Content, Levels, and Parts, Romve content, levels, parts, Edit content,level,parts, Get conetent, level,parts
app.post('/quest-content', async (req, res) => {
  try {
    const { quest_id, level, part, content_type, content_description, pathway } = req.body;

    // Check for required fields
    if (!quest_id || !level || !part || !content_type) {
      return res.status(400).send('Quest ID, level, part, and content type are required.');
    }

    const results = await questEndpoints.AddQuestContent([quest_id, level, part, content_type, content_description, pathway]);

    // Extract the insert ID and send the response
    const insert_id = results.insertId;
    res.status(201).send({ success: true, insert_id });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Get all content for a specific quest
app.get('/quest-content/:questID', async (req, res) => {
  const questID = req.params.questID;
  try {
    const results = await questEndpoints.GetQuestContent(questID);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Get content by level and part for a specific quest
app.get('/quest-content/:questID/:level', async (req, res) => {
  const questID = req.params.questID;
  const level = req.params.level;
  try {
    const results = await questEndpoints.GetQuestContentByLevelAndPart(questID, level);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Remove content by content ID
app.delete('/quest-content/:contentID', async (req, res) => {
  const contentID = req.params.contentID;
  try {
    const results = await questEndpoints.RemoveQuestContent(contentID);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Edit content by content ID
app.put('/quest-content/:contentID', async (req, res) => {
  const contentID = req.params.contentID;
  try {
    const { level, part, content_type, content_description, pathway } = req.body;
    let updateFields = {};
    if (level) {
      updateFields['level'] = level;
    }
    if (part) {
      updateFields['part'] = part;
    }
    if (content_type) {
      updateFields['content_type'] = content_type;
    }
    if (content_description) {
      updateFields['content_description'] = content_description;
    }
    if (pathway) {
      updateFields['pathway'] = pathway;
    }
    const results = await questEndpoints.EditQuestContent(
      updateFields,
      contentID
    );
    res.status(201).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
})
//?

//? Users Quest Participation -- Add, remove, set status completion of users

app.post('/user-quest-participation', async (req, res) => {
  try {
    const { user_id, quest_id } = req.body;
    const guildID = req.query.guildID
    // Check for required fields
    if (!user_id || !quest_id) {
      return res.status(400).send('User ID, quest ID, and start date are required.');
    }
    const userCheck = await guildEndpoints.checkIFActiveMemberInGuild(user_id, guildID);
    if (userCheck[0]['count(*)'] === 0) {
      return res.status(403).json({ message: 'User not a member of this server' });
    }
    else {
      const results = await questEndpoints.AddUserQuestParticipation([user_id, quest_id]);
      const insert_id = results.insertId;
      res.status(201).send({ success: true, insert_id });
    }

  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Remove user participation in a quest
app.delete('/user-quest-participation/:userID/:questID', async (req, res) => {
  const userID = req.params.userID;
  const questID = req.params.questID;
  try {
    const results = await questEndpoints.RemoveUserQuestParticipation(userID, questID);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//*  Set completion status of a user for a quest
app.put('/user-quest-completion/:userID/:questID', async (req, res) => {
  const userID = req.params.userID;
  const questID = req.params.questID;
  try {
    const { completion_date } = req.body;

    // Check for required fields
    if (!completion_date) {
      return res.status(400).send('Completion date is required.');
    }

    const results = await questEndpoints.SetUserQuestCompletionStatus(userID, questID, completion_date);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//* Get the Quests of a user
app.get('/user-quests/:userID', async (req, res) => {
  const userID = req.params.userID;
  try {
    const results = await questEndpoints.GetUserQuests(userID);
    res.status(200).send({ success: true, data: results });
  } catch (error) {
    const error_obj = errorMessages && errorMessages[error.code];

    const status = error_obj ? error_obj.responseCode : 500;
    const message = error_obj ? error_obj.errorMessage : 'Internal Server Error';

    res.status(status).send(message);
  }
});

//?

//!





module.exports = app