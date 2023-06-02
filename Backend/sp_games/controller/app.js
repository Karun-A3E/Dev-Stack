var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json()); // Parse application/json data
app.use(urlencodedParser);
// 
const user = require('../models/UserDB')
// 


// app.get('/users', (req,res) => {
//   user.getUsers((err,results)=>{
//     if(!err){res.send(results)}
//     else{res.status(500).send('Internal Server Error')}
//   })
// })



//asyc Trial


app.get('/users', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    user.async_getUser(page, pageSize)
      .then((results) => {
        res.send(results);
      })
      .catch((err) => {
        res.status(500).send('Internal Server Error');
      });
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error');
  }
});


// 



app.get('/users/:userid', function (req, res) {
  var id = req.params.userid;
  user.getById(id, function (err, result) {
    if (!err) {
      res.send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.post('/user/',(req,res)=>{
  const { username, email, type,password } = req.body;
  const values = [username, email, type,password];
  user.postNEW(values,(err,result)=>{
    if (err) {
      console.error(err);
      if (err.errno == 1062) {res.status(422).send('There is already a entry with the same email')}
      else {res.status(500).send('Error inserting data into database')};
    } else {
      let insert_id = results.insertId;
      res.status(201).send(`{"userID" : ${insert_id}}`);
    }
  })
})





app.get('/games/:platformname',(req,res)=>{
  const platformname = req.params.platformname;
  user.get_games_list(platformname, (err,result)=>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving games');
    }
    res.json(result);
  })
})

app.post('/game', (req, res) => {
 const data = req.body;
 user.post_new_game( [data.title, data.description,data.price,data.platformid,data.categoryid,data.year], (error,result)=>{
  if (error) {
    console.error(error);
    if (error.errno == 1062) {res.status(422).send('There is already a game')}
    else {res.status(500).send('Error inserting data into database')};
  } else {
    if (result === 'Invalid CategoryID provided') {
      res.status(400).send('Invalid CategoryID provided');
    } else {
      let insert_id = result.insertId;
      res.status(201).send(`{\n gameid : ${insert_id}\n}`);
    }
  }
 })
});

app.put('/game/:id',(req,res)=>{
  const id = req.params.id;
  const data = req.body
  // console.log(data)
  user.update_game([data,id],(err,result)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Error updating user');
    } else {
      res.send(`User ${id} updated successfully`);
    }
  })
})

app.delete('/game/:game_id',(req,res)=>{
  const game_id = req.params.game_id;
  user.cascade_delete_game(game_id,(err,result) =>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting game');
    }
    else{res.send('Game deleted successfully');}
  })
})




app.post('/category', (req, res) => {
  // Extract the data from the request body
  const data = req.body;
  user.post_category([data.catname, data.cat_description],(error,results) =>{
    if (error) {
      console.error(error);
      if (error.errno == 1062) {res.status(422).send('There is already a entry with the parameters')}
      else {res.status(500).send('Error inserting data into database')};
    } else {
      res.sendStatus(201)
    }
  })
});

app.post('/platform',(res,req) =>{
  const data = req.body;
  user.post_platform([data.platform_name,data.platform_description],(error,results) =>{
    if (error) {
      console.error(error);
      if (error.errno == 1062) {res.status(422).send('There is already a platform as such')}
      else {res.status(500).send('Error inserting data into database')};
    } else {
      res.send('Data inserted successfully');
    }
  });
})



app.get('/game/:id/review',(req,res)=>{
  const id = req.params.id;
  user.getReview(id,(err,results)=>{
    if (err) {res.status(500).send('Internal Server Error')}
    else {
      res.send(results);
    }
  })
})

app.post('/user/:uid/game/:gid/review/', (req,res) =>{
  const uid = req.params.uid;
  const gid = req.params.gid
  const data = req.body;


  user.postReview([gid,uid,data.review,data.rating],(err,results) =>{
    if(err) {
      console.log(err);
      res.status(500).send('Error inserting data into database');
    }
    else {
      let insert_id = results.insertId;
      res.status(201).send(`{"reviewID" : ${insert_id}}`);
    }
  })
})


module.exports = app