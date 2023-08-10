import React, { useState, useEffect } from 'react'
import MessageCard from '../components/Cards/MessageCards';
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { itemData } from '../configurations/website_rules';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CarouselCard from '../components/defaultMulti-Components/CarouselCard';
import axios from '../configurations/axios'
const Overview = () => {
  const [top10GameProfile, settop10GameProfile] = useState([]);
  const [timeStatus, setTimeStatus] = useState({});
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [randomData, setRandomData] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true); // State to track if more cards can be loaded

  useEffect(() => {
    // Fetch user data from the API
    const fetchGameProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/overview/games"
        );
        settop10GameProfile(response.data); // Assuming the API response contains an array of user profiles
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchGameProfile();
  }, []);


  useEffect(() => {
    // Function to fetch the data from the backend API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/getStatus"); // Make sure to update the URL accordingly
        const { Status, data } = response.data;
        setTimeStatus(Status);
        setUpcomingGames(data);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  let gamesPerPage = 5;
  let value = 7;

  if (window.matchMedia("(min-width: 1280px)").matches) {
    // xl: 20 per page
    gamesPerPage = 10;
    value = 7;
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    // md: 12 per page
    gamesPerPage = 6;
    value = 3;
  } else if (window.matchMedia("(max-width: 400px)").matches) {
    // sm: 8 per page
    gamesPerPage = 4;
    value = 1;
  }
  useEffect(() => {
    // Function to fetch the data from the backend API
    const getRandomData = async () => {
      try {
        let values = value * 2; // Default value for iPad
        // Fetch new random data with the calculated value as the query parameter
        const response = await axios.get(
          `http://localhost:8081/getRandom?value=${values}`
        );
        const randomData = response.data;
        setRandomData(randomData);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    getRandomData();
  }, []);
  const handleNextButtonClick = async () => {
    try {
      // Calculate the value based on the screen size
      // Fetch new random data with the calculated value as the query parameter
      const response = await axios.get(
        `http://localhost:8081/getRandom?value=${value}`
      );
      const newRandomData = response.data;
      setRandomData((prevData) => {
        const updatedData = [...prevData, ...newRandomData];
        if (updatedData.length >= 30) {
          setCanLoadMore(false); // Disable "Next" button when reaching 30 cards
        }
        return updatedData.slice(0, 30); // Keep only the first 30 cards
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const groupedGames = [];
  for (let i = 0; i < randomData.length; i += value) {
    groupedGames.push(randomData.slice(i, i + value));
  }

  const handleTabClick = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const filterGamesByStatus = (status) => {
    if (status === "ALL") {
      return upcomingGames;
    }
    return upcomingGames.filter(
      (game) => game.status.toLowerCase() === status.toLowerCase()
    );
  };

  const defaultTabValue = selectedStatus;
  const gamesToDisplay = filterGamesByStatus(selectedStatus);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gamesToDisplay.slice(indexOfFirstGame, indexOfLastGame);

  let TABLE_HEAD = ["Icon", "Title", "Released Year", "Status"];
  
  return (
    <div className="mt-24">
    <div className="flex flex-wrap lg:flex-nowrap justify-center">
      <Carousel
        className="rounded-xl mx-4 overflow-hidden"
        style={{ height: "600px", maxWidth: "100%" }}
        autoplay={true}
        autoplayDelay={2000}
        loop={true}
      >
        <img
          src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
          alt="image 3"
          className="h-full w-full object-cover"
        />
      </Carousel>
    </div>

    <div className="mt-6 xl:grid xl:grid-cols-3 gap-4 m-5">
      <div className="col-span-1">
        {/* This is for the Table Card */}
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Recently Relased Games
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all these games
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <div>
                  <Link to="/orders">
                    <Button variant="outlined" color="blue-gray" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value={defaultTabValue} className="w-full md:w-max">
                <TabsHeader>
                  {Object.entries(timeStatus).map(
                    ([statusKey, statusValue]) => (
                      <Tab
                        key={statusKey}
                        value={statusKey}
                        onClick={() => handleTabClick(statusKey)} // Handle tab click and update selected status
                      >
                        {statusValue}
                      </Tab>
                    )
                  )}
                </TabsHeader>
              </Tabs>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentGames.map((game) => (
                  <tr key={game.gameid}>
                    <td className="p-4 border-b border-blue-gray-50">
                      {game.status.toLowerCase() === "released" ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="h-5 w-5 text-blue-500"
                          aria-hidden="true"
                        />
                      )}
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {game.title}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {game.released_year}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={game.status.toUpperCase()}
                          color="blue-gray"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              Page {currentPage} of{" "}
              {Math.ceil(gamesToDisplay.length / gamesPerPage)}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                disabled={indexOfLastGame >= gamesToDisplay.length}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="col-span-2 md:my-5 xl:my-3 lg:my-5">
        <Tabs id="custom-animation" value="Top 10 Games">
          <TabsHeader>
            {Object.keys(top10GameProfile).length > 0 &&
              Object.keys(top10GameProfile).map((key) => (
                <Tab key={key} value={key}>
                  {key}
                </Tab>
              ))}
          </TabsHeader>
          <TabsBody
            className=""
          >
            {Object.keys(top10GameProfile).map((key) => (
              <TabPanel key={key} value={key}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {top10GameProfile[key].length > 0 ? (
                    top10GameProfile[key].map((game) => (
                      <MessageCard
                        className="col-span-1"
                        title={game.title}
                        gameid={game.gameid}
                        platforms={game.platforms}
                      />
                    ))
                  ) : (
                    <p>No {key} games at the moment.</p>
                  )}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
      {/* This is for the 3 Tab Basd Suggestion */}
    </div>
    {/* Parallax Imageing */}
    <div className="m-3 rounded-xl  border-blue-gray-100" >
      <ImageList
        sx={{ height: 450 }}
        variant="masonry"
        cols={10}
        gap={8}
        className="xl:w-full mt-2"
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              className="rounded-2xl"
              src={`${item.img}?w=161&fit=crop&auto=format`}
              srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
    <CarouselCard title={"Action"} groupedGames={groupedGames} custom={handleNextButtonClick}/>
    {/* <CarouselCard title={"Comedy"} groupedGames={groupedGames} custom={handleNextButtonClick}/> */}
    {/* I can add more but for keeping it nice, i shall not */}

  </div>
  )
}

export default Overview