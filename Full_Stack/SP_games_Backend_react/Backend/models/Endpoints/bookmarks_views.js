const model = require('../configurations/template')
const bookmark_views = {
  getTop10GamesView : async () =>{
    try {
      return model.async_template('SELECT * FROM game_details_summary_view limit 10;')
    } catch (error) {
      throw error
    }
  },
  getSpecificBookmarks : async (values) =>{
    try {
      return model.async_template('SELECT g.gameid, g.title, g.description, g.released_year FROM games g JOIN games_bookmarks gb ON g.gameid = gb.gameid WHERE gb.user_id = ?;',values)
    } catch (error) {
      throw error
    }
  },
  addNewBookmark : async(values) =>{
    try {
      return model.async_template('INSERT INTO games_bookmarks (gameid,user_id) values (?,?)',values)
    } catch (error) {
      throw error
    }
  },
  removeBookmark : async(values) =>{
    try {
      return model.async_template('delete from games_bookmarks where gameid=? and user_id =?',values)
    } catch (error) {
      throw error
    }
  },
  CheckBookmarks : async(values) =>{
    try {
      return model.async_template("Select count(*) as Bookmark_count from games_bookmarks where gameid=? and user_id = ?",values)
    } catch (error) {
      throw error
    }
  }
}
module.exports = bookmark_views