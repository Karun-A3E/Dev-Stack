const model = require('../template')


const tasks = {
  getAllTasks : async()=>{
    try {
      return model.async_template('SELECT * from task')
    } catch (error) {
      throw error
    }
  },
  getTaskByID : async(id)=>{
    try {
      return model.async_template('SELECT * from task where task_id=?',id)
    } catch (error) {
      throw error
    }
  },
  removeTaskByID : async(id)=>{
    try {
      return model.async_template('DELETE from task where task_id=?',id)
    } catch (error) {
      throw error
    }
  },
  createNewTask : async(values)=>{
    try {
      return model.async_template('INSERT into task (title,description,points) values (?,?,?)',values)
    } catch (error) {
      throw error
    }
  },
  updateTaskByID : async(taskID,values)=>{
    const allowedFields = ['title', 'description', 'points'];

    Object.keys(values).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete values[key];
      }
    });
    try {
      return model.async_template('update task set ? where task_id=?',[values,taskID])
    } catch (error) {
      throw error
    }
  },
  getTaskCountByID : async(taskID) =>{
    try {
      return model.async_template('select * from task where task_id = ?',taskID)
    } catch (error) {
      throw error
    }
    }
};

module.exports = tasks