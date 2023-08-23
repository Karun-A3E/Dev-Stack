var express=require('express');


var app=express();

var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);

// 
const taskmanager = require('../models/taskmanager')
// 

app.get('/users', (req, res) => {
  taskmanager.findAll((error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.get('/api/users/:id', (req, res) => {
  taskmanager.findById(req.params.id,(error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})

app.post('/api/users', (req, res) => {
  const data = req.body;
  taskmanager.insert(data, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(201).send(result);
  });
})

app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  taskmanager.update(id, data, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})


app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  taskmanager.delete(id, (error) => {
    return error ? res.status(500).send('Internal Server Error') : res.sendStatus(204);
  });
})

// ----Team Endpoints----------

app.delete('/teams/:id', (req, res) => {
  const id = req.params.id;
  taskmanager.team_delete(id, (error) => {
    return error ? res.status(500).send('Internal Server Error') : res.sendStatus(204);
  });
})

app.post('/teams', (req, res) => {
  const data = req.body;
  console.log(data)
  Object.keys(data).forEach(key=>{
    if(key=='id'){delete data[key]}
  })
  console.log(data)
  taskmanager.team_insert([data.name,data.description], (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(201).send(result);
  });
})


app.get('/teams/:id', (req, res) => {
  taskmanager.findTeamByid(req.params.id,(error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})


app.put('/teams/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Object.keys(data).forEach(key=>{
    if(key=='id'){delete data[key]}
  })
  taskmanager.team_update(id, data, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})

// -------------Team Endpoints--------------------




//? Task Endpoints

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  taskmanager.tasks_get_by_id(id, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})

app.post('/tasks', (req, res) => {
  const data = req.body;
  taskmanager.tasks_insert([data.title,data.description,data.due_date,data.status,data.priority,data.assigned_to,data.team_id], (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(201).send(result);
  });
})

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  taskmanager.task_update(id, data, (error, result) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(result);
  });
})

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  taskmanager.task_delete(id, (error) => {
    return error ? res.status(500).send('Internal Server Error') : res.sendStatus(204);
  });
})


// Task Assignment


















app.get('/team/task/:id', (req, res) => {
  taskmanager.findTeamsByID(req.params.id,(error, results) => {
    return error ? res.status(500).send('Internal Server Error') : res.status(200).send(results);
  });
})



module.exports=app;