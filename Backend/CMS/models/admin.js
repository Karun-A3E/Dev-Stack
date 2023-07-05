// use this File For admin priviledges


// 1. User Management Endpoints:
//    - `/admin/users`: Retrieve a list of users in the CMS.
//    - `/admin/users/:id`: Retrieve a specific user.
//    - `/admin/users/:id`: Update a specific user's details.
//    - `/admin/users/:id`: Delete a specific user.

// 2. Content Management Endpoints:
//    - `/admin/posts`: Retrieve a list of posts or content items.
//    - `/admin/posts/:id`: Retrieve a specific post.
//    - `/admin/posts/:id`: Update a specific post.
//    - `/admin/posts/:id`: Delete a specific post.
//    - `/admin/posts/new`: Create a new post.

// 3. Category/Tag Management Endpoints:
//    - `/admin/categories`: Retrieve a list of categories.
//    - `/admin/categories/:id`: Retrieve a specific category.
//    - `/admin/categories/:id`: Update a specific category.
//    - `/admin/categories/:id`: Delete a specific category.
//    - `/admin/categories/new`: Create a new category.

// 4. Media Management Endpoints:
//    - `/admin/media`: Retrieve a list of media files.
//    - `/admin/media/:id`: Retrieve a specific media file.
//    - `/admin/media/:id`: Update metadata of a specific media file.
//    - `/admin/media/:id`: Delete a specific media file.
//    - `/admin/media/upload`: Upload a new media file.

// 5. Settings Management Endpoints:
//    - `/admin/settings`: Retrieve the CMS settings.
//    - `/admin/settings`: Update the CMS settings.


//? These are the endpoints that are going to be of focus
// This file will contain the object and method for parsing the sql commands

const model = require('../models/template/api_template');


const user_management = { 
  get_user_generic : async(page,pageSize) =>{
    try{
      const offset = (page-1)*pageSize;
      const query = 'SELECT * from user_basic';
      const values = [offset,pageSize];
      return model.async_template(query,values).then(async results =>{
        return model.async_template('SELECT count(*) from user_basic;').then(totalCountResults =>{
          const total_count = totalCountResults[0]['COUNT(*)']
          const maxPages = Math.ceil(total_count / pageSize);
          return (page>maxPages) ? {'maxPage' : maxPages} :
          {
            "maxPages" : maxPages,
            "Page Index" : `Page ${page}/${maxPages}`,
            "results" : results
          }
          
        })
      })
    }catch(err){console.log(err);throw err}
  } 
}