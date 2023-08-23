var express = require('express');
const path = require('path')
const multer = require('multer');
var bodyParser = require('body-parser');
const fs = require('fs')
const url = require('url');
var jwt=require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const cors = require('cors')
var app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieparser())
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);
app.use(express.static("public"));
const publicDir = path.join(__dirname, '..', 'public');

// 
const usr_endpoints  = require('../models/Endpoints/usrendpoints');
const platform_category_endpoints = require('../models/Endpoints/category_platforms');
const games = require('../models/Endpoints/gamesEndpoints');
const bookmarks_view_endpoints = require('../models/Endpoints/bookmarks_views')
const rules = require('../models/Endpoints/rules')
const review_endpoints = require('../models/Endpoints/reviews')
const order = require('../models/Endpoints/orders_payment')
const order_paymentInfo = require('../models/Endpoints/orders_payment');
const search_auto = require('../models/misc/autoComplete')
const Charts = require('../models/Endpoints/Charts')
// 
const redisClient = require('../models/configurations/redisconfig')
var config=require('../auth/secretKey');
const verifyToken = require('../auth/verifyToken')
// --------------------------------------------------------------------
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

// -------------------------------------------------------------------
// -------------------------------------------------------------------
//!User Endpoints



app.get('/users',async(req,res)=>{ //* All Good but UNUSED
  try {
    let users = await usr_endpoints.getAllUsers()
    res.status(200).send({'success':true,'data':users })
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})


app.get('/users/:id', async (req, res) => { //* All good but unsused
  const id = req.params.id;
  try {
    const cacheResults = await redisClient.get(id);
    if (cacheResults) {
      const cachedData = JSON.parse(cacheResults);
      console.log(cachedData)
      const userData = cachedData[0];
      const imagePath = cachedData[1];
      if (imagePath) {
        res.set('Content-Type', 'application/json');
        res.send({ data: userData, image_url: '/users/image/' + id });
      } else {
        res.send({ data: userData });
      }
    } else {
      const results = await usr_endpoints.GetSpecificUserInfo(id);
      if (results.length > 0) {
        const { profile_pic_url, ...filteredResult } = results[0];
        const cacheData = JSON.stringify([filteredResult, profile_pic_url]);
        redisClient.set(id, cacheData);
        redisClient.expire(id, 30);
        if (profile_pic_url) {
          res.set('Content-Type', 'application/json');
          res.send({ data: filteredResult, profile_pic_url: '/users/image/' + id });
        } else {
          res.send({ data: filteredResult });
        }
      } else {
        res.status(404).send('Error Not Found');
        return;
      }
    }
  } catch (err) {
    throw err;
  }
});
app.get('/users/image/:id', async (req, res) => { //* ALL GOOD BUT UNUSED
  const id = req.params.id;
  try {
    const cacheResults = await redisClient.get(id);
    if (cacheResults) {
      const cachedData = JSON.parse(cacheResults);
      let imagePath = cachedData[1];
      console.log(imagePath)
      if (imagePath) {
        let filePath = path.join(__dirname,'..',imagePath)
        res.sendFile(filePath);
      } else {
        res.status(404).send('Image not found');
      }
    } else {
      const results = await usr_endpoints.GetSpecificUserInfo(id);
      if (results.length > 0) {
        let imagePath = results[0].profile_pic_url;
        if (imagePath) {
          let filePath = path.join(__dirname,'..',imagePath)

          res.sendFile(filePath);
        } else {
          res.status(404).send('Image not found');
        }
      } else {
        res.status(404).send('User not found');
      }
    }
  } catch (err) {
    throw err;
  }
});
app.post('/addNewUser', (req,res)=>{//* All Good BUT UNUSED
  try {
    let { username, email, password } = req.body;

    let type='customer'
    const values = [ username, email,type,password];
    usr_endpoints.addNewUser(values,(error,results)=>{
      if(error){
        if (error.errno == 1062) {
          res.status(422).send('Unprocessable Entity');
        } else {
          res.status(500).send('Internal Server Error');
        }
      }else{
        let insert_id = results.insertId;
        res.status(201).send(`{"userID" : ${insert_id}}`);
      }
    })
  } catch (error) {
    console.error(err);
  }
})
app.delete('/user/:id', async (req, res) => {//* All Good BUT UNSED => CAN BE USED EASILY
  try {
    const id = req.params.id;
    let imagePath;
    const cacheResults = await redisClient.get(id);
    if (cacheResults && cacheResults[0][1]) {
      const cachedData = JSON.parse(cacheResults[0][1]);
      imagePath = cachedData[1];
      
      // Delete the user data from Redis within the transaction
      redisClient.del(id);
    } else {
      const results = await usr_endpoints.GetSpecificUserInfo(id);
      if (results.length > 0) {
        const { profile_pic_url, ...filteredResult } = results[0];
        imagePath = profile_pic_url;
      } else {
        res.status(404).send('Error Not Found');
        return;
      }
    }
    let userDeleteStatus = await usr_endpoints.removeUser(id);
    
    // If the user had a profile picture, delete it from the filesystem (you need to implement this logic)
    if (imagePath) {
      // Implement the logic to delete the image file
      fs.unlinkSync(imagePath);
    }

    res.status(200).send(userDeleteStatus);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
// ----------------------------------------------------------------------------------------------

app.get('/user/paged', verifyToken, async (req, res) => { //? Used for Pagination
  let results;
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchInput = req.query.search || '';
    const selectedColumns = req.query.columns ? req.query.columns.split(',') : [];
    results = await usr_endpoints.getUsersPagination(page, pageSize, searchInput, selectedColumns);
    res.status(200).send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/userSpecificInformation',verifyToken, async(req,res)=>{ //? All Good USED
  //! Used to Collect Data for Checking, same as prev function byt serves diff purpose
  //* used in exchange for the /users/:ID
  try {
    const userid = req.userId;
    let userInfo = await usr_endpoints.GetSpecificUserInfo(userid);
    console.log(userInfo)
    res.status(200).send(userInfo)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
});


app.put("/users", verifyToken, upload.single("profilePic"), async (req, res) => {
  const userID = req.userId;
  const { username, email, password } = req.body;
  console.log(req.body)
  // Get the new profile picture URL from the uploaded file
  const newProfilePicUrl = req.file ? "http://localhost:8081/images/" + req.file.filename : null;

  try {
    // Create an empty object to store the fields to be updated
    const updateFields = {};

    // Check if 'username' exists in 'req.body', and add it to the updateFields object if present
    if (username) {
      updateFields.username = username;
    }

    // Check if 'password' exists in 'req.body', and add it to the updateFields object if present
    if (password) {
      updateFields.password = password;
    }

    // Check if 'profile_pic_url' exists in 'req.file', and add it to the updateFields object if present
    if (newProfilePicUrl) {
      updateFields.profile_pic_url = newProfilePicUrl;
    }

    // Check if 'email' exists in 'req.body', and add it to the updateFields object if present
    if (email) {
      updateFields.email = email;
    }

    // Assuming your User model has an UpdateUser method (change it as per your model library)
    const updatedUser = await usr_endpoints.UpdateUser(userID, updateFields);

    // If an old profile picture URL is present and it starts with '/images', delete the old file from the server
    if (req.body.old_url && req.body.old_url.includes('/images/')) {
      const oldImagePath = path.join(publicDir, url.parse(req.body.old_url).pathname);
      fs.unlinkSync(oldImagePath);
    }
  
    // Remove the oldImageURL from the values object
    delete values.oldImageURL;

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user information:", error);
    // If the error is due to a duplicate key (error code 1062), send a 409 status code
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ errorCode: 1062 });
    } else {
      res.status(500).json({ error: "Failed to update user information" });
    }
  }
});


//--------------------------------------------------------------------
//! Bookmarks and Views


app.get('/top10Games', async(req,res)=>{ //? All Good
  try {
    let results = await bookmarks_view_endpoints.getTop10GamesView();
    res.status(200).send(results)
  } catch (error) {
    res.status(500).send()
  }
})
app.get('/GetUserBookmarked', verifyToken,async(req,res)=>{ //? All Good
  try {
    const id =req.userId
    let results = await bookmarks_view_endpoints.getSpecificBookmarks(id);
    res.status(200).send(results)
  } catch (error) {
    res.status(500).send()
  }
})
app.get('/CheckIfGameBookmrked',verifyToken ,async(req,res)=>{ //? All Good
  try {
    let userid = req.userId
    let gameid = req.query.query;
    let results = await bookmarks_view_endpoints.CheckBookmarks([parseInt(gameid),parseInt(userid)]);
    console.log(results)
    res.status(200).send(results)
  } catch (error) {
    res.status(500).send()
  }
})
app.post('/newBookMark',verifyToken, async (req,res)=>{
  try {
    let userid = req.userId
    let gameid = req.query.query;
    const results = await bookmarks_view_endpoints.addNewBookmark([parseInt(gameid),parseInt(userid)]) //add in [gameid, userid];
    res.status(201).send('Bookmarked')
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})
app.delete('/removeBookmark',verifyToken, async (req,res)=>{
  try {
    let userid = req.userId
    let gameid = req.query.query;
    const results = await bookmarks_view_endpoints.removeBookmark([parseInt(gameid),parseInt(userid)]) //add in [gameid, userid];
    res.status(201).send('Removed Bookmark')
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})


// ---------------------------------------------------------------------

//! Games 
app.get('/games/allGames',async(req,res)=>{ //* UNUSED
  try {
    let game = await games.getAllGames()
    res.status(200).send({'success':true,'data':game })
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})
app.get('/games/Pagination', async(req, res) => { //* UNUSED
  let results;
  try {
    const page = parseInt(req.query.page) || 1;         // let page value to be reassigned if not default 1
    const pageSize = parseInt(req.query.pageSize) || 10;// let pageSize value to be reassigned if not default 10
    results = await games.getGamePagination(page, pageSize); //if there is no data from the redis, then the data is retrieved from the API
    res.status(200).send(results)
  } catch (err) { //* if there are any errors in the process of getting the data then the error is printed and internal server error is posted
    console.log(err)
    res.status(500).send('Internal Server Error');
  }
});



app.delete('/games/:gameid',verifyToken, async (req,res)=>{ //? All Good
  try {
   const id = req.params.gameid;
   let gameDeleteStatus = await games.deleteGame(id)
   res.status(200).send(gameDeleteStatus);
  } catch (error) {
   res.status(500).send('Internal Server Error')
  }
 });
 app.get('/games/:gameid', async (req, res) => {
  try {
    const id = req.params.gameid;
    let gameResults = await games.getSpecificGame(id);

    // Check if the profile_pic_url is provided and modify it to be an absolute URL
    if (gameResults[0].profile_pic_url && gameResults[0].profile_pic_url.startsWith('/images/')) {
      // Construct the absolute profile_pic_url
      const absoluteProfilePicUrl = `http://localhost:8081${gameResults[0].profile_pic_url}`;

      // Update the profile_pic_url in the gameResults to the absolute URL
      gameResults[0].profile_pic_url = absoluteProfilePicUrl;
    }

    res.status(200).send(gameResults);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
app.patch("/games/:gameid",verifyToken, upload.single("profilePic"), async (req, res) => {
  const gameid = req.params.gameid;
  const values = { ...req.body };
  console.log(values)
  // Check if the request contains a profile picture file
  if (req.file) {
    console.log('Image upload');
    // Here, you can save the image file path to the 'profile_pic_url' field in the database
    // Assuming you have a 'games' collection in your database:
    const profilePicUrl = "http://localhost:8081/images/" + req.file.filename;
    values.profile_pic_url = profilePicUrl;
  }

  // Remove the old image file if oldImageURL starts with '/images/'
  if (values.oldImageURL && values.oldImageURL.includes('/images/')) {
    const oldImagePath = path.join(publicDir, url.parse(values.oldImageURL).pathname);
    fs.unlinkSync(oldImagePath);
  }

  // Remove the oldImageURL from the values object
  delete values.oldImageURL;

  try {
    const result = await games.update_game(gameid, values);
    res.status(200).json({ success: true, message: "Game updated successfully" });
  } catch (error) {
    if (error.errno == 1062) {
      res.status(409).send("Err409");
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
app.get('/getStatus', async (req, res) => {//? USED FOR GAME RELEASED AND RELEASED
  try {
    let timeStatus = await games.getBasicCategoryColumn();
    let upcomingGames = await games.getRecentGames();

    // Transform the timeStatus data
    const status = { 'ALL': 'All' };
    const transformedStatus = {};
    timeStatus.forEach(item => {
      const capitalizedKey = item.status.toUpperCase();
      const properValue = item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();
      transformedStatus[capitalizedKey] = properValue;
    });
    transformedStatus['ALL'] = 'All'; // Add 'All' status

    res.status(200).send({ "Status": transformedStatus, "data": upcomingGames });
  } catch (error) {
    // Handle errors
  }
});
app.get('/getRandom', async (req, res) => {//? GET RANDOM GAMES SELECTED
  try {
    let sectionValue = req.query.value  ;
    const results = await games.getRandom10(sectionValue);
    res.status(200).send(results);
  } catch (error) {
    throw error;
  }
});
app.get('/gamesFilters', async (req, res) => { //? REPLACEMENT FOR /games/paged, with in-built Filtering 
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const yearRange = req.query.yearRange ? req.query.yearRange.split(',').map(Number) : null;
  const minRating = parseFloat(req.query.minRating) || null;
  const maxRating = parseFloat(req.query.maxRating) || null;
  const platforms = req.query.platform ? req.query.platform.split(',') : null;
  const category = req.query.category ? req.query.category.split(',') : null;
  const search = req.query.search || null;
  const columns = req.query.columns ? req.query.columns.split(',') : null;
  
  try {
    const results = await games.getGamePaginationWithFilter(page, pageSize, yearRange, minRating, maxRating, platforms, category,search,columns);
    res.send(results);
  } catch (error) {
    throw error;
  }
});
app.post("/newGame",verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    const { title, description, released_year, categoryname, platformname, price } = req.body;

    // Step 1: Insert the game and get the gameid
    const InsertStatusOfGame = await games.createNewGame([
      title,
      description,
      released_year,
      req.file ? "/images/" + req.file.filename : null, // Check if profilePic exists and set the profile_pic_url accordingly
    ]);
    const gameid = InsertStatusOfGame.insertId;

    // Step 2: Check if platformname, categoryname, and price are provided
    if (platformname && categoryname && price) {
      // Step 3: Split platformname, categoryname, and price into arrays
      const platformnames = platformname.split(",").map((platformname) => platformname.trim());
      const categorynames = categoryname.split(",").map((categoryname) => categoryname.trim());
      const prices = price.split(",").map((price) => parseFloat(price.trim())); // Assuming price is a number

      // Step 4: Filter out empty platformnames and categorynames
      const validPlatformNames = platformnames.filter((name) => name !== "");
      const validCategoryNames = categorynames.filter((name) => name !== "");

      // Step 5: Retrieve platformid and catid based on platformname and categoryname
      const platformIdsPromises = validPlatformNames.map((name) => games.getPlatformIdByName(name));
      const catIdsPromises = validCategoryNames.map((name) => games.getCategoryIdByName(name));
      const platformIds = await Promise.all(platformIdsPromises);
      const catIds = await Promise.all(catIdsPromises);

      // Step 6: Prepare values for batch insertions in games_platform and games_category tables
      const gamesPlatformValues = platformIds.map((platformId, index) => [gameid, platformId, prices[index]]);
      const gamesCategoryValues = catIds.map((categoryId) => [gameid, categoryId]);

      try {
        // Step 7: Perform batch insertions using async_template
        await games.InsertIntoGamesCategory(gamesCategoryValues);
        await games.InsertIntoGamesPlatform(gamesPlatformValues);
      } catch (error) {
        // Step 8: Handle errors and send an error response
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }
    }

    // Step 9: Return a success response
    res.status(201).json({ gameID: gameid });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// -------------------------------------------------

app.put('/categories/:catid', async (req, res) => {//* UNUSED
  const catid = req.params.catid;
  const {catname,cat_description} = req.body

  try {
    const result = await platform_category_endpoints.editCategory([catname,cat_description,catid]);
    res.status(200).json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    if(error.errno==1062){res.status(409).send('Err409')}
    else{
    res.status(500).json({ error: 'Internal Server Error' })};  }
});

app.put('/platforms/:platformid', async (req, res) => {//* UNUSED
  const platformid = req.params.platformid;
  const {platform_name,platform_description} = req.body
  
  try {
    const result = await platform_category_endpoints.editPlatform([platform_name,platform_description,platformid]);
    res.status(200).json({ success: true, message: 'Platform updated successfully' });
  } catch (error) {
    if(error.errno==1062){res.status(409).send('Err409')}
    else{
      
    res.status(500).json({ error: 'Internal Server Error' })};
  }
});

app.get('/categories', async (req, res) => {//* UNUSED
  try {
    const results = await platform_category_endpoints.getCategoryInfo();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/platforms', async (req, res) => {//* UNUSED
  try {
    const results = await platform_category_endpoints.getPlatformInfo();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/categories', async (req, res) => {//? USED FOR INSERTING
  const { catname, cat_description } = req.body;

  try {
    const result = await platform_category_endpoints.addNewCategory([catname, cat_description]);
    res.status(200).json({ success: true, message: 'New category added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/platforms', async (req, res) => {//? USED FOR INSERTING
  const { platform_name, platform_description } = req.body;
  console.log(platform_name)
  try {
    const result = await platform_category_endpoints.addNewPlatform([platform_name, platform_description]);
    res.status(200).json({ success: true, message: 'New platform added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/platforms/:platformid', async (req, res) => { //? USED FOR DELETING
  const platformid = req.params.platformid;

  try {
    const result = await platform_category_endpoints.deletePlatform({ id: platformid });
    res.status(200).json({ success: true, message: 'Platform deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/categories/:catid', async (req, res) => { //? USED FOR DELETING
  const catid = req.params.catid;

  try {
    const result = await platform_category_endpoints.deleteCategory({ id: catid });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/platform/paged', async (req, res) => {//? GET PLATFORMS PAGED
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const search = req.query.search;
  const columns = req.query.columns ? req.query.columns.split(',') : null; // Accepting multiple columns

  try {
    const results = await platform_category_endpoints.getPlatformPaged(page, pageSize, search, columns);
    res.status(200).send(results)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
});
app.get('/category/paged', async (req, res) => {//? GET CATEGORY PAGED
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const search = req.query.search;
  const columns = req.query.columns ? req.query.columns.split(',') : null; // Accepting multiple columns

  try {
    const results = await platform_category_endpoints.getCategoryPaged(page, pageSize, search, columns);
    res.status(200).send(results)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
});
app.get('/platform/:id', async (req, res) => {//? GET PLATFORM DETAILS
  let tableName = 'platform';
  let idName = 'platformid';
  let id = req.params.id;

  try {
    const results = await platform_category_endpoints.getCategoryPlatfromRecordByID(tableName, idName, id);
    res.status(200).send(results);
  } catch (error) {
    throw error;
  }
});
app.get('/category/:id', async (req, res) => {//? GET CATEGORY DETAILS
  let tableName = 'category';
  let idName = 'catid';
  let id = req.params.id;
  try {
    const results = await platform_category_endpoints.getCategoryPlatfromRecordByID(tableName, idName, id);
    res.status(200).send(results);
  } catch (error) {
    throw error;
  }
});
app.get('/getFilters', async (req, res) => {//? GET FILTERS IN PAGINATION
  try {
    let page = req.query.page || 1;
    let filters = req.query.filters || ''; // Accept multiple filter criteria as comma-separated values
    
    // Convert the filters string to an object
    const filterObject = filters.split(',').reduce((obj, filter) => {
      obj[filter] = true;
      return obj;
    }, {});

    let resultant = await rules.allInAll(filterObject, page); // Pass the filterObject to the 'allInAll' function
    res.status(200).send(resultant);
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
app.put('/updatePlatform/updateCategory', verifyToken, async (req, res) => {
  const { categories, platforms, prices } = req.body;
  const gameid = req.query.gameid;

  try {
    // Get the previous game data from the database
    const prevGameIDResults = await games.getSpecificGame(gameid);
    const prevPlatforms = prevGameIDResults[0].platform_price != null
      ? prevGameIDResults[0].platform_price.split(',')
      : [];
    const prevCategories = prevGameIDResults[0].categories != null
      ? prevGameIDResults[0].categories.split(',')
      : [];

    // Check if any of the arrays (categories, platforms, prices) is null
    const hasNullData = categories === null || platforms === null || prices === null;

    if (!hasNullData) {
      // Convert the platform_price_old array to a map for easy comparison
      const platformPriceOldMap = new Map();
      prevPlatforms.forEach((pair) => {
        const [platform, price] = pair.split('-');
        platformPriceOldMap.set(platform.trim(), price.trim());
      });


      // Find new platforms and update existing ones
      for (let i = 0; i < platforms.length; i++) {
        const trimmedPlatform = platforms[i].trim();
        const price = prices[i].trim();
        const gameIdToUpdate = prevPlatforms[i] ? prevPlatforms[i].split('-')[0] : null;
        
        if (trimmedPlatform && price) {
          if (!platformPriceOldMap.has(trimmedPlatform)) {
            // If the platform is new, update it in the database
            await platform_category_endpoints.addNewGamePlatform(gameid, trimmedPlatform, price);
          } else if (platformPriceOldMap.get(trimmedPlatform) !== price) {
            // If the price is different, delete the platform and insert the new pair
            await platform_category_endpoints.deleteGamePlatform(gameid, trimmedPlatform);
            await platform_category_endpoints.addNewGamePlatform(gameid, trimmedPlatform, price);
          }
          // Remove the platform from the map to track missing platforms
          platformPriceOldMap.delete(trimmedPlatform);
        }
      }
      
      // Delete platforms with missing pairs
      for (const [platform, price] of platformPriceOldMap.entries()) {
        await platform_category_endpoints.deleteGamePlatform(gameid, platform);
      }
      

      // Delete platforms with missing pairs or different prices

      // Handle categories update
      const categoriesToDelete = prevCategories.filter((category) => !categories.includes(category));
      for (const category of categoriesToDelete) {
        await platform_category_endpoints.deleteGameCategory(gameid, category.trim());
      }

      const categoriesToAdd = categories.filter((category) => !prevCategories.includes(category));
      for (const category of categoriesToAdd) {
        await platform_category_endpoints.addNewGameCategory(gameid, category.trim());
      }
    }

    // Fetch old platform prices and format them as an array of objects { platform, price }
    const platform_price_old = prevPlatforms.map((pair) => {
      const [platform, price] = pair.split('-');
      return { platform: platform.trim(), price: parseInt(price.trim()) };
    });

    // Fetch new platform prices and format them as an array of objects { platform, price }
    const platform_price_new = platforms.reduce((result, platform, index) => {
      const trimmedPlatform = platform.trim();
      const price = prices[index].trim();
      if (trimmedPlatform && price && (!prevPlatforms.includes(trimmedPlatform) || platformPriceOldMap.get(trimmedPlatform) !== price)) {
        result.push({ platform: trimmedPlatform, price });
      }
      return result;
    }, []);

    // Send the success response along with old and new platform prices
    if (!hasNullData) {
      res.status(200).json({ message: "Platform and category updates successful!", platform_price_old, platform_price_new });
    } else {
      res.status(400).json({ error: "Invalid data provided!" });
    }
  } catch (error) {
    console.error("Error updating platform and category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------------------------------
app.post('/login',async(req,res)=>{
  let access_token; let refreshToken;
  const {email,password} = req.body;
  console.log(email,password)
  try {
    // let data = [email[0],password[0]]
    let data = [email,password]
    // console.log(data)
    let UserAmount = await usr_endpoints.findUserCount(data)
    if(UserAmount[0].id>0){
      let UserInfo = await usr_endpoints.GetSpecificUserInfo(UserAmount[0].userid)
    UserInfo = UserInfo[0] 
    access_token = jwt.sign({ id: UserInfo.userid, role: UserInfo.type }, config.key, { expiresIn: '2h' });
    refreshToken = jwt.sign({ id: UserInfo.userid, role: UserInfo.type }, config.refresh, { expiresIn: '24h' });

      res.status(201).send({id : UserInfo.userid,type : UserInfo.type,refreshTkt : refreshToken, accessTkt : access_token})
    }
    else{
      res.status(404).send('User Unknown')
    }
  } catch (error) {
    console.log(error)
  }
})
app.post('/refresh', async (req, res) => {
  const refreshToken = req.headers['refresh-token'];
  console.log(refreshToken)
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
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.key,
      { expiresIn: 20 }
    );

    res.status(200).send({ accessTkt: newAccessToken });
  });
});
// ------------------------------------------------------

// ------------------------------------------------------
app.post('/reviews', verifyToken,async (req, res) => {//? ADD IN A NEW REVIEW
  try {
    const user_id=req.userId 
    const { game_id, review, rating } = req.body;
    // Input validation - You can add more validation as needed
    if (!user_id || !game_id || !review || rating === undefined) {
      return res.status(400).json({ error: 'Invalid data. Please provide all required fields.' });
    }

    const newReview = [
      user_id,
      game_id,
      review,
      rating,
    ];

    const reviewId = await review_endpoints.createReview(newReview);
    res.status(201).json({ reviewId });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});
app.get('/reviews/:gameid', async (req,res)=>{//? GET THE REVIEWS RELATED TO THAT GAMEID
  const gameid = req.params.gameid;
  try {
    const gameReviews = await review_endpoints.getReviewByGameid(gameid)
    res.status(200).send(gameReviews)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})
app.get('/getRecentReviewsOfUser', verifyToken, async (req,res)=>{//? GET RECENT REVIEW MADE BY USER ONLY
  const userID = req.userId
let limiaton = req.query.limitation || true
  try {
    const results = await review_endpoints.getRecentReviewMadeByUser(userID,limiaton);
    res.status(200).send(results)
  } catch (error) {
    
  }
})
// ------------------------------------------------------
app.get('/getPaymentInfo', verifyToken,async(req,res)=>{//? GET USER PAYMENT INFO
  const userid = req.userId
  // console.log(userid)
  try {
    const results = await order.getPaymentInformation(userid);
    res.status(200).send(results)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
})
app.get('/getOrderView/paged', verifyToken, async (req, res) => {//? GET THE ORDERS OF THE SP_GAMES paged
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search;
  const columns = req.query.columns ? req.query.columns.split(',') : null; // Accepting multiple columns

  try {
    const results = await order.getPaymentPaged(page, pageSize, search, columns);
    res.status(200).send(results);
  } catch (error) {
    throw error;
  }
});
app.get('/getOrderDetails',verifyToken, async(req,res)=>{//? GET THE ORDER OF A USER LIMITED or UNLIMITED
  const userid = req.userId
  let limiaton = req.query.limitation || true
  try {
    const results = await order_paymentInfo.getOrderInformation(userid,limiaton);
    res.status(200).send(results)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
})
app.patch('/updateStatus',async(req,res)=>{
  try {
    const {Id,status} = req.body;
    const results = await order.updateOrderStatus(status,Id)
    res.status(201).send('Results are Updated')
  } catch (error) {
    res.status(500).send()
  }
})

app.post('/insertNewOrder',verifyToken,async (req,res)=>{
  const userid = req.userId;
  const {cartItems}= req.body
  try {
    const order_results = await order_paymentInfo.addNewOrder(userid);
    console.log(order_results)
    const orderId= order_results.insertId
    for (const cartItem of cartItems) {
      const { game_id, platform_id, quantity } = cartItem;
      const insrtNewOrder = await order.addNewOrderDetail(orderId,parseInt(game_id),parseInt(platform_id),parseInt(quantity))
    }
    res.status(200).json({ message: "Order created successfully!" });
  }catch(error){
    throw error
  }
})

app.post('/addNewPaymentCard',verifyToken, async (req, res) => {
  try {
    let userid = req.userId
    const {paymentType, lastDigits } = req.body;
    if (!userid || !paymentType || !lastDigits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await order_paymentInfo.addNewPaymentCard(userid, paymentType, lastDigits.slice(-4));

    // Check if the card was successfully added
    if (result.affectedRows === 1) {
      return res.status(201).json({ message: 'Payment card added successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to add payment card' });
    }
  } catch (error) {
    console.error('Error occurred while adding a new payment card:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
// ------------------------------------------------------
app.get('/get/Search/auto', async(req,res)=>{//? FOR CREATING AUTOCOMPLETE SUGGESTIONS
  let columName = req.query.columName;
  let tableName = req.query.tableName;
  let value = req.query.value
  try {
    const results = await search_auto.getName(tableName,columName,value)
    console.log(results)
    res.status(200).send(results)
  } catch (error) {
    throw error
  }
})
app.get('/getSearchResults', async (req, res) => {//? USED TO GET AUTOCOMPLETE SUGGESTIONS FOR SEARCH BAR
  try {
    const values = req.query.query;
    const results = await games.getgames(values)

    res.status(200).send(results)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})


app.get('/overview/games', async(req,res)=>{//todo (SPECIAL)
  try {
    const popularGame = await games.topGames();
    const randomPicks = await games.getRandom10();
    const Favourites = await games.getRandom10()
    res.status(200).send({"Top 10 Games" : popularGame,"Random Picks" : randomPicks,"Favourites" : Favourites})
  } catch (error) {
    throw error
  }
})

// ----------------------------------------------------

app.get("/getLinesChart",verifyToken, async (req, res) => {
  try {
    const { timeSpan, userType } = req.query;
    const results = await Charts.getLinesUserData(timeSpan, userType);
    const chartData = results.map((row) => ({
      x: row.time_unit, // Using time_unit as the x-axis value
      y: row.user_count, // Using user_count as the y-axis value
    }));
    res.json(chartData);
    console.log(chartData)
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/getBarChart", verifyToken, async (req, res) => {
  try {
    const results =  await Charts.getBarChartData();
    console.log(results)
    const chartData = results.map((row) => ({
      x: row.catname,
      y: row.usage_count,
    }));
    res.json(chartData);
    console.log(chartData)
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = app