import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "../../configurations/axios";
import { ReviewCard } from "../../components/Cards/ReviewCard";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
  Input,
  Button,
  Rating,
  Alert,
  List,
  ListItem,
  Radio,
  ListItemPrefix
} from "@material-tailwind/react";
import { generateRandomColor } from "../../configurations/website_rules";
import { useStateContext } from "../../contexts/ContextProvider";
import { HiMiniShoppingCart, HiOutlineHeart,HiHeart } from 'react-icons/hi2';
import { IconButton } from "@mui/material";

const GameShow = () => {
  const { isClicked } = useStateContext();
  const { gameName } = useParams();
  const [gameInfo, setGameInfo] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5); // Default rating is 5 star
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State to track the visibility of the alert
  const [quantity, setQuantity] = useState(1);
  const [isGameBookmarked, setIsGameBookmarked] = useState(false);  
  const Navigate = useNavigate()
  useEffect(() => {
    // Function to fetch the specific game information
    const fetchGameInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/games/${gameName}`);
        setGameInfo(response.data[0]);
  
        // Check if the game is bookmarked
        const bookmarkResponse = await axios.get(`http://localhost:8081/CheckIfGameBookmrked?query=${response.data[0]?.gameid}`);
        setIsGameBookmarked(bookmarkResponse.data[0].Bookmark_count > 0);
  
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching game information:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };
  
    fetchGameInfo();
  }, [gameName]);
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/reviews/${gameName}`);
      setReviews((response.data));
      } catch (error) {
      console.error("Error fetching game reviews:", error);
    }
  };
  useEffect(() => {
    // Function to fetch game reviews
    fetchReviews();
  }, [gameName]);

  console.log(gameInfo)
  const handleReviewSubmit = async () => {
    if (!isClicked.member) return;

    try {
      const newReviewObject = {
        game_id: gameInfo.gameid,
        review: newReview,
        rating: newReviewRating,
      };

      const response = await axios.post("http://localhost:8081/reviews", newReviewObject);

      if (response.status === 201) {
        const { reviewId } = response.data;
        // Fetch the updated reviews after successfully adding a new review
        fetchReviews();
        setNewReview("");
        setNewReviewRating(5);
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const showAddToCartAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // Hide the alert after 3 seconds (adjust the time as per your requirement)
  };

  // Function to handle adding the game to the cart
  const handleAddToCart = () => {
    if (!isClicked.member) {
      // If the user is not a member, show a message or redirect them to the login page
      return;
    }

    if (!selectedPlatform || !selectedPrice) {
      // If no platform or price is selected, do not add the game to the cart
      return;
    }
    const platformIdArray = gameInfo.platformIDS ? gameInfo.platformIDS.split(",") : [];
    const platformIdIndex = platformNames.findIndex((platform) => platform === selectedPlatform);
    const selectedPlatformId = platformIdIndex >= 0 ? platformIdArray[platformIdIndex] : null;

    if (!selectedPlatformId) {
      // If the platformid for the selected platform is not found, do not add the game to the cart
      return;
    }

    const gameToAdd = {
      game_id: gameInfo.gameid,
      platform: selectedPlatform,
      platform_id: selectedPlatformId, // Add the platformid to the game object
      price: selectedPrice,
      quantity: quantity,
      image_url: gameInfo.profile_pic_url,
    };

    // Check if the game with the selected platform is already in the cart
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingGameIndex = storedCartItems.findIndex(
      (item) => item.game_id === gameInfo.gameid && item.platform === selectedPlatform
    );

    if (existingGameIndex !== -1) {
      // If the game with the selected platform is already in the cart, update its quantity
      const updatedCart = [...storedCartItems];
      updatedCart[existingGameIndex].quantity += quantity;
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      // If the game with the selected platform is not in the cart, add it as a new item
      const updatedCart = [...storedCartItems, gameToAdd];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }

    // Show a notification or feedback to the user that the game was added to the cart
    showAddToCartAlert(); // Show the "Added to Cart" alert
  };

  // Function to handle the "Buy Now" action
  const handleBuyNow = () => {
    // Implement the logic for the "Buy Now" action here
    // For example, you can redirect the user to a checkout page or show a confirmation modal
    handleAddToCart()
    Navigate('/Checkout')
  };
  const handleBookmarkClick = async () => {
    try {
      if (!isClicked.member) {
        // If the user is not logged in, do not perform bookmark actions
        return;
      }
  
      if (isGameBookmarked) {
        // Game is already bookmarked, so remove the bookmark
        await axios.delete(`http://localhost:8081/removeBookmark?query=${gameInfo.gameid}`);
        console.log('Bookmark removed!');
      } else {
        // Game is not bookmarked, so add a new bookmark
        await axios.post(`http://localhost:8081/newBookMark?query=${gameInfo.gameid}`);
        console.log('Game bookmarked!');
      }
  
      // After bookmarking or removing the bookmark, update the UI accordingly
      setIsGameBookmarked(!isGameBookmarked);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      // Handle error, for example, show an error message
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Extracting platforms and prices from the gameInfo object

  const platformPricesArray = gameInfo.platform_price ? gameInfo.platform_price.split(",") : [];
  const platformNames = platformPricesArray.map((platformPrice) => {
    const [platform] = platformPrice.split("-");
    return platform.trim();
  });
  console.log(platformNames)

  const handlePlatformSelection = (index) => {
    const selectedPlatformPrice = platformPricesArray[index];
    const [platform, price] = selectedPlatformPrice.split("-");
    setSelectedPlatform(platform.trim());
    setSelectedPrice(parseFloat(price.trim())); // Convert price to a floating-point number
    setQuantity(1); // Reset the quantity to 1 when a new platform is selected
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <div className="m-5">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Game Image */}
        <div>
          <img
            src={
              gameInfo.profile_pic_url == null
                ? "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                : gameInfo.profile_pic_url
            }
            alt={gameInfo.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        {/* Right Column - Game Info */}
        <div className="ml-5">
          <Card color="transparent" shadow={false} className="w-full max-w-[26rem]">
          <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="mx-0 flex items-center justify-between pt-0 pb-8"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  size="lg"
                  variant="circular"
                  src='https://images-platform.99static.com/X3sUPEpK2nxG_9y5Leen2Sd_Gk8=/0x0:1000x1000/500x500/top/smart/99designs-contests-attachments/116/116868/attachment_116868214'
                  alt={gameInfo.platforms}
                />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    {isClicked.member && (
                      <IconButton onClick={handleBookmarkClick}>
                        {isGameBookmarked ? (
                          <HiHeart size={30} color="red" />
                        ) : (
                          <HiOutlineHeart size={30} color="red" />
                        )}
                      </IconButton>
                    )}
                    <Typography variant="h5" color="blue-gray">
                      {gameInfo.title}
                    </Typography>
                  </div>
                  <Typography color="blue-gray">Publisher: {gameInfo.platforms}</Typography>
                  <Typography color="blue-gray">Description: {gameInfo.description}</Typography>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {/* Category */}
              {/* <div className="rounded-full h-24 w-24 bg-gray-300 flex items-center justify-center m-3 hover:border-blue-gray-500">
                <p className="text-white text-xl font-bold">{gameInfo.categories}</p>
              </div> */}
              <div className="flex flex-row">
                {gameInfo.categories !== null ? (
                  gameInfo.categories.split(',').map((cat, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-700 rounded-lg py-1 px-2 mr-2 mb-2"
                    >
                      {cat.trim()}
                    </div>
                  ))
                ) : (
                  <p>No Categories</p>
                )}
              </div>

              <div className="flex flex-row">
                {platformNames !=[] ? (
                  platformNames.map((cat, index) => (
                    <div
                      key={index}
                      className="bg-red-100 text-red-700 rounded-lg py-1 px-2 mr-2 mb-2"
                    >
                      {cat.trim()}
                    </div>
                  ))
                ) : (
                  <p>No Platforms</p>
                )}
              </div>

                    <div className="flex flex-row">
          {platformNames !=[] ? (
            platformNames.map((platform, index) => (
              <div key={index} className="mr-4 inline-flex">
                <Radio
                  color="blue"
                  id={`platform-${index}`}
                  name="platform"
                  value={platform}
                  onChange={() => handlePlatformSelection(index)}
                  checked={selectedPlatform === platform}
                  size="regular"
                />
                <ListItem htmlFor={`platform-${index}`} className="cursor-pointer">
                  {platform}
                </ListItem>
              </div>
            ))
          ) : (
            <p>No Platforms Available</p>
          )}
        </div>

            </CardBody>
            <CardFooter>
            { selectedPlatform && selectedPrice && (
  <div className="">
    <Typography color="blue-gray" className="font-medium">
      Price: {selectedPrice * quantity} SGD
    </Typography>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Typography color="blue-gray" className="font-medium">
          Quantity:
        </Typography>
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={10} // You can set a maximum quantity limit as per your requirement
          color="blue"
          size="regular"
          outline={true}
          className="w-16"
        />
      </div>
      {isClicked.member ? (
        <>
          <Button
            color="blue"
            variant="outlined"
            onClick={handleAddToCart}
            className="flex-shrink-0" // Prevent the button from shrinking
          >
            Add to Cart
          </Button>
          <Button
            color="blue"
            onClick={handleBuyNow}
            className="flex-shrink-0" // Prevent the button from shrinking
          >
            Buy Now
          </Button>
        </>
      ) : (
        <>
          <Button
            color="blue"
            variant="outlined"
            disabled
            className="flex-shrink-0" // Prevent the button from shrinking
          >
            Add to Cart
          </Button>
          <Button
            color="blue"
            disabled
            className="flex-shrink-0" // Prevent the button from shrinking
          >
            Buy Now
          </Button>
        </>
      )}
    </div>
  </div>
)}


            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Second Row - Reviews */}
      <div className="mt-8">
        {/* Card for adding a new review */}
        {isClicked.member ? (
          <div className="w-full max-w-[26rem] bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="mr-2">Your Rating:</span>
                <div className="flex">
                  <Rating
                    value={newReviewRating}
                    onChange={(value) => setNewReviewRating(value)}
                    ratedColor="amber"
                  />{" "}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Input
                type="text"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                color="blue"
                size="regular"
                outline={true}
                className="w-full"
              />
            </div>
            <Button
              color="blue"
              onClick={handleReviewSubmit}
              disabled={!newReview} // Disable the button if there's no new review content
              className="w-full"
            >
              Submit Review
            </Button>
          </div>
        ) : (
          <div>
            {/* You can add a message here like "Only members can submit reviews" */}
          </div>
        )}

        {/* Horizontal border */}
        <hr className="my-8 border-t-2 border-blue-gray-200" />

        {/* Display existing reviews */}
        {reviews.length > 0 || reviews === [] ? (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
      {reviews.map((review) => (
        <ReviewCard
          key={review.review_id}
          name={`UserName: ${
            review.username != undefined ? review.username : "Your Review!!!"
          }`}
          review_content={review.review}
          rating_value={review.rating}
        />
      ))}
    </div>
  ) : (
    <p>No Reviews Posted</p>
  )}
      </div>

      {showAlert && (
        <Alert
          color="purple"
          className="fixed bottom-10 right-10 w-60 p-4 rounded-lg"
          onClick={() => setShowAlert(false)} // Hide the alert when clicked
        >
          <span>Added to Cart!</span>
        </Alert>
      )}
    </div>
  );
};

export default GameShow;
