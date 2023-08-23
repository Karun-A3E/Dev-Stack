const db = require('./databaseconfig');

const taksManager = {
  findAll: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM users';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  findById: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM users WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  insert: (data, callback) => {
    let conn = db.getConnection();
    let query = 'INSERT INTO users SET ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, data, (error, results) => {
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  update: (id, data, callback) => {
    let conn = db.getConnection();
    let query = 'UPDATE users SET ? WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [data, id], (error, results) => {
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  delete: (id, callback) => {
    let conn = db.getConnection();
    let query = 'DELETE FROM users WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  team_delete: (id, callback) => {
    let conn = db.getConnection();
    let query = 'DELETE FROM teams WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  findTeamsTaskByID: (id, callback) => {
    let conn = db.getConnection();
    let query = "SELECT * FROM tasks right join teams on tasks.team_id = teams.id where team_id = ?  ";
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        console.log(error)
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  team_insert: (data, callback) => {
    let conn = db.getConnection();
    let query = 'INSERT INTO teams (name,description) values (?,?)';
    conn.connect((err)=>{
      if(err){console.log(err); return callback(err,null)}
      else {
        conn.query(query,data,(error,results)=>{
          return err ? callback(error,null) : callback(null,error)
        })
      }
    })
  },
  findTeamByid: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM teams WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  team_update: (id, data, callback) => {
    let conn = db.getConnection();
    let query = 'UPDATE teams SET ? WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [data, id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  tasks_get_by_id: (id, callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * FROM tasks WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  tasks_insert: (data, callback) => {
    let conn = db.getConnection();
    let query = 'INSERT INTO tasks (title,description,due_date,status,priority,assigned_to,team_id) values (?,?,?,?,?,?,?)';
    conn.connect((err) => {
      if (err) { console.log(err); return callback(err, null) }
      else {
        conn.query(query, data, (error, results) => {
          return err ? callback(error, null) : callback(null, error)
        })
      }
    })
  },
  task_update: (id, data, callback) => {
    let conn = db.getConnection();
    let query = 'UPDATE tasks SET ? WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [data, id], (error, results) => {
        conn.end()
        return error ? (console.error(error),callback(error, null) ): callback(null, results);
      });
    });
  },
  task_delete: (id, callback) => {
    let conn = db.getConnection();
    let query = 'DELETE FROM tasks WHERE id = ?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [id], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  }
}


module.exports = taksManager