let db = require('../models/databaseconfig');

const music_platform = {
  findAll: (callback) => {
    let conn = db.getConnection();
    let query = 'select songs.id, subquery.id as artistid, subquery.name, songs.title, songs.duration, a.release_year as released,subquery.country FROM songs JOIN albums a on songs.album_id = a.id JOIN (select * from artists) as subquery on a.artist_id = subquery.id';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  find_all_ablums: (callback) => {
    let conn = db.getConnection();
    let query = 'SELECT * from albums JOIN songs on albums.id = songs.album_id JOIN (select * from artists) as subquery on albums.artist_id = subquery.id' ;
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  }
  ,
  getAllArtistSongs: (callback) => {
    let conn = db.getConnection();
    let query = 'select a.id,a.name,o.title,o.release_year,s.id as songID,s.title as Songs_title FROM artists a Join albums o on a.id = o.artist_id Join songs s on s.album_id = o.id';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  },
  getSongsByCategory: (category, callback) => {
    // console.log(genre)
    
    let conn = db.getConnection();
    let query = 'select a.id,a.name,o.title,o.release_year as year,s.id as songID,s.title as Songs_title FROM artists a Join albums o on a.id = o.artist_id Join songs s on s.album_id = o.id WHERE a.?';
    conn.connect((err) => {
      return err ? callback(err, null) : conn.query(query, [category], (error, results) => {
        conn.end()
        return error ? callback(error, null) : callback(null, results);
      });
    });
  }
}


module.exports = music_platform