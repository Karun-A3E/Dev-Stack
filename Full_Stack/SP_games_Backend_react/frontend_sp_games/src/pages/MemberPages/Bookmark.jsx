import React, { useEffect, useState } from 'react';
import axios from '../../configurations/axios';
import MessageCard from '../../components/Cards/MessageCards';
const Bookmark = () => {
  const [bookmarkedGames, setBookmarkedGames] = useState([]);

  useEffect(() => {
    // Fetch bookmarked game IDs
    const fetchBookmarkedGames = async () => {
      try {
        const response = await axios.get('http://localhost:8081/GetUserBookmarked');
        const bookmarkedGameIds = response.data.map((bookmark) => bookmark.gameid);
        console.log(response)
        console.log(bookmarkedGameIds)
        // Fetch game information for each bookmarked game ID
        const promises = bookmarkedGameIds.map((gameId) =>
          axios.get(`http://localhost:8081/games/${gameId}`)
        );

        const gameResponses = await Promise.all(promises);
        const bookmarkedGamesData = gameResponses.map((response) => response.data[0]);
        setBookmarkedGames(bookmarkedGamesData);
      } catch (error) {
        console.error('Error fetching bookmarked games:', error);
      }
    };

    fetchBookmarkedGames();
  }, []);

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 m-5">
      {bookmarkedGames.map((game) => (
        <MessageCard
          key={game.gameid}
          title={game.title}
          gameid={game.gameid}
          profile_pic_url={game.profile_pic_url}
        />
      ))}
    </div>
  );
};

export default Bookmark;
