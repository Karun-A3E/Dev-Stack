const model = require('../configurations/template');

const users_endpoint = {
  getAllUsers : async() =>{
    try {
     return model.async_template('SELECT * FROM USERS')
    } catch (error) {
      throw error
    }
  },
  CheckIfValueAvailable: async (columnName, value, userid) => {
    try {
      let query = `SELECT COUNT(${columnName}) as count FROM user_profiles_view WHERE ${columnName} = ? AND userid = ?`;
      return model.async_template(query, [value, userid]);
    } catch (error) {
      throw error;
    }
  },
  UpdateUser: async (userId, values) => {
    try {
      // Create an empty object to store the fields to be updated
      const updateFields = {};
  
      // Check if 'username' exists in 'values', and add it to the updateFields object if present
      if (values.hasOwnProperty("username")) {
        updateFields.username = values.username;
      }
  
      // Check if 'password' exists in 'values', and add it to the updateFields object if present
      if (values.hasOwnProperty("password")) {
        updateFields.password = values.password;
      }
  
      // Check if 'profile_pic_url' exists in 'values', and add it to the updateFields object if present
      if (values.hasOwnProperty("profile_pic_url")) {
        updateFields.profile_pic_url = values.profile_pic_url;
      }
  
      // Check if 'email' exists in 'values', and add it to the updateFields object if present
      if (values.hasOwnProperty("email")) {
        updateFields.email = values.email;
      }
  
      // You can add more fields here if needed, just follow the same pattern
  
      // Now, update the user in the database using the 'updateFields' object
      return model.async_template("update users set ? where userid = ?", [
        updateFields,
        userId,
      ]);
    } catch (error) {
      console.error("Error updating user:", error);
      // You can handle errors or throw them if needed
      throw new Error("Failed to update user");
    }
  },
  
  addNewUser  : (values,callback) =>{
    try {
      return model.template('insert into users (username,email,type,password) values (?,?,?,?)',values,callback)
    } catch (error) {
      throw error
    }
  },
  removeUser  : async(values) =>{
    try {
      return model.async_template('delete from users where userid  = ?',values)
    } catch (error) {
      throw error
    }
  },
  checkUserExist : async(values) =>{
    try {
     return model.async_template('SELECT count(userid) from users where userid = ?',values)
    } catch (error) {
      throw error
    }
  },
  GetSpecificUserInfo : async(values) =>{
    try {
      return model.async_template('SELECT * from user_profiles_view where userid = ?',values)
    } catch (error) {
      throw error
    }
  },
  getUsersPagination: async (page, pageSize, searchInput, selectedColumns) => {
    try {
      const offset = (page - 1) * pageSize;
      let query = 'SELECT * FROM user_profiles_view';
  
      // Apply search filtering
      if (searchInput) {
        query += ' WHERE ';
        const searchConditions = selectedColumns.map(column => `${column} LIKE '%${searchInput}%'`);
        query += searchConditions.join(' OR ');
      }
  
      query += ' LIMIT ?, ?;';
      const values = [offset, pageSize];
  
      return model.async_template(query, values).then(async results => {
        return model.async_template('SELECT COUNT(*) FROM trial.user_profiles_view;').then(totalCountResults => {
          const total_count = totalCountResults[0]['COUNT(*)'];
          const maxPages = Math.ceil(total_count / pageSize);
          return (page > maxPages)
            ? { 'maxPage': maxPages }
            : {
                'maxPages': maxPages,
                "Page Index": `Page ${page}/${maxPages}`,
                "results": results
              };
        });
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  
  findUserCount : async(values) =>{
    try {
      return model.async_template('select count(userid) as id,userid from users where email = ? and password = ?', values)
    } catch (error) {
      
    }
  },
  getUsrPassword :async (values) =>{
    try {
      return model.async_template('select salt,password from users where email= ?', values)
    } catch (error) {
      
    }
  }
}

module.exports = users_endpoint