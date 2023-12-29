const model = require('../template')


const task_progress = {
  getTaskProgressByID : async(id)=>{
    try {
      return model.async_template('SELECT * from taskprogress where progress_id=?',id)
    } catch (error) {
      throw error
    }
  },
  postProgress : async(values)=>{
    try {
      return model.async_template('Insert into taskprogress (user_id,task_id,completion_date,notes) values (?,?,?,?)',values)
    } catch (error) {
      throw error
    }
  },
  deleteProgress : async(id)=>{
    try {
      return model.async_template('DELETE from taskprogress where progress_id=?',id)
    } catch (error) {
      throw error
    }
  },
  updateProgress : async(values,id)=>{
    try {
      return model.async_template('Update taskprogress set ? where progress_id = ?',[values,id])
    } catch (error) {
      throw error
    }
  },
  getProgressCount : async(progressID) =>{
    try {
      return model.async_template('select * from taskprogress where progress_id = ?',progressID)
    } catch (error) {
      throw error
    }
    }
};


module.exports = task_progress