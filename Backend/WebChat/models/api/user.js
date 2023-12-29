const model = require('../template')

const user_endpoints = {
  getAllUsers : async() =>{
    try {
      return model.async_template('SELECT * FROM USER')
    } catch (error) {
      throw error
    }
  },
  getUserByID : async(values) =>{
    try {
      return model.async_template('SELECT * from user where user_id=?',values)
    } catch (error) {
      throw error
    }
  },
  deleteUserByID : async(values) =>{
    try {
      return model.async_template('DELETE from user where user_id=?',values)
    } catch (error) {
      throw error
    }
  },
  addNewUser  : async(values) =>{
    try {
      return model.async_template('insert into user (username,email,password,role) values (?,?,?,?)',values)
    } catch (error) {
      throw error
    }
  },
  updateUserByID : async (userId,values) =>{
    const updateFields = {};

    if (values.hasOwnProperty("username")) {
      updateFields.username = values.username;
    }
    if (values.hasOwnProperty("email")) {
      updateFields.email = values.email;
    }
    return model.async_template("update user set ? where user_id = ?", [
      updateFields,
      userId,
    ]);
  },
  getUserCountByID : async(userId) =>{
    try {
      return model.async_template('select * from user where user_id = ?',userId)
    } catch (error) {
      throw error
    }
    },
  getUsername : async(userID) =>{
    try {
      return model.async_template('Select username from user where user_id = ?',userID)
    } catch (error) {
      throw error
    }
  },
  findUserCount : async(values) =>{
    try {
      return model.async_template('select user_id as id from user where email = ? and password = ?', values)
    } catch (error) {
      throw error
    }
  },
}


module.exports=user_endpoints