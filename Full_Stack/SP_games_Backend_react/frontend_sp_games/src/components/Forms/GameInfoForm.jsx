import React, { useEffect, useState,useRef } from "react";
import axios from "../../configurations/axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";
import { generateRandomColor } from "../../configurations/website_rules";
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import ProfilePicUpload from '../defaultMulti-Components/ProfilePicUpload'
import IconButton from '@mui/material/IconButton';

const GameInfoForm = ({ gameid, onClose, editForm = true, addRecord = false,info}) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isAddedRecord, setIsAddedRecord] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [platformInput, setPlatformInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [prices, setPrices] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [platformSuggestions, setPlatformSuggestions] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  useEffect(() => {
    const fetchGameInfo = async () => {
      setIsLoading(true);
      try {
        const response =info.find((game) => game.gameid === gameid);
        setGameInfo(response);
      } catch (error) {
        console.error(error);
        setGameInfo(null);
      }
      setIsLoading(false);
    };

    if (editForm) {
      fetchGameInfo(); // Fetch game info only if it's an edit form
    } else {
      setGameInfo({}); // Reset gameInfo to an empty object for adding a new game
    }
  }, [gameid, editForm]);
  console.log('Gameinfo : ',gameInfo);
  console.log('Data : ',info)
  useEffect(() => {
    let category_split = gameInfo?.categories
      ? gameInfo.categories.split(",")
      : [];
    setCategories(category_split.map((category) => category.trim()));
    let platformSplit = gameInfo?.platforms
      ? gameInfo.platforms.split(",")
      : [];
    setPlatforms(platformSplit.map((platform) => platform.trim()));

    let priceSplit = gameInfo?.prices ? gameInfo.prices.split(",") : [];
    setPrices(priceSplit.map((price) => price.trim()));
  }, [gameInfo]);

  const fetchCategorySuggestions = async (inputValue) => {
    try {
      if (!inputValue.trim()) {
        setCategorySuggestions([]); // If inputValue is empty or contains only whitespace, clear the suggestions
        return;
      }

      const response = await axios.get(
        `/get/Search/auto?tableName=category&columName=catname&value=${inputValue}`
      );
      setCategorySuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlatformSuggestions = async (inputValue) => {
    try {
      if (!inputValue.trim()) {
        setPlatformSuggestions([]); // If inputValue is empty or contains only whitespace, clear the suggestions
        return;
      }

      const response = await axios.get(
        `/get/Search/auto?tableName=platform&columName=platform_name&value=${inputValue}`
      );
      setPlatformSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addCategory = () => {
    setCategories((prevCategories) => [
      ...prevCategories,
      categoryInput.trim(),
    ]);
    setCategoryInput("");
  };

  const removeCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

const addPlatformPrice = () => {
  // Create a new object representing the new platform and price
  const newPlatform = {
    platform: platformInput.trim(),
    price: priceInput.trim(),
  };

  // Create a new array with the updated platforms and their prices
  const updatedPlatforms = [...platforms, newPlatform.platform];
  const updatedPrices = [...prices, newPlatform.price];

  // Update the state with the new arrays
  setPlatforms(updatedPlatforms);
  setPrices(updatedPrices);

  setPlatformInput(""); // Clear the input field for the platform
  setPriceInput(""); // Clear the input field for the price
};

  

  const removePlatformPrice = (index) => {
    const updatedPlatforms = platforms.filter((_, i) => i !== index);
    const updatedPrices = prices.filter((_, i) => i !== index);
    setPlatforms(updatedPlatforms);
    setPrices(updatedPrices);
  };

  

  const handleUpdateProfileLink = (newProfileLink) => {
    // Update the gameInfo state with the new profile link
    setGameInfo((prevGameInfo) => ({ ...prevGameInfo, profile_pic_url: newProfileLink }));
  };

  const updateGame = async () => {
    try {
      // Create a new FormData object to send the updated game information
      const formData = new FormData();
      formData.append("title", gameInfo.title);
      formData.append("description", gameInfo.description);
      formData.append("released_year", gameInfo.released_year);
  
      // If a new image is selected, include it in the FormData
      if (selectedImageFile) {
        formData.append("profilePic", selectedImageFile);
        // Include the existing profile_pic_url in the FormData with the name "oldImageURL"
        formData.append("oldImageURL", gameInfo.profile_pic_url);
      }
  
      // Update the game information with the new data, including the profile picture
      await axios.patch(`/games/${gameid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Update the platform and category information
      await axios.put(`/updatePlatform/updateCategory?gameid=${gameid}`, {
        categories,
        platforms,
        prices,
      });
  
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000); // Hide the alert after 3 seconds
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIsUpdateError("Title has a duplicate record.");
      } else {
        setIsUpdateError("Update failed. Please try again later.");
      }
      setTimeout(() => {
        setIsUpdateError(false);
      }, 3000);
    }
    if (!editForm) {
      setGameInfo({});
    }
  };
  
  
  
  

  // const handleAddGame = async () => {
  //   try {
  //     const { title, description, released_year } = gameInfo;
  //     const categoryname = categories.join(","); // Convert the array of categories to a comma-separated string
  //     const platformname = platforms.join(","); // Convert the array of platforms to a comma-separated string
  //     const price = prices.join(","); // Convert the array of prices to a comma-separated string
  //     const profile_pic_url = gameInfo?.profile_pic_url || ""; // Profile pic URL is optional
  
  //     // Make the axios post request to upload the profile picture if available
  //     let uploadedProfilePicUrl = profile_pic_url;
  //     if (profilePicUploadRef.current) {
  //       const formData = new FormData();
  //       formData.append("profilePic", profilePicUploadRef.current);
  //       const response = await axios.post(`/uploadProfilePic`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       uploadedProfilePicUrl = response.data.profile_pic_url;
  //     }
  
  //     // Make the axios post request to add the new game
  //     await axios.post("/newGame", {
  //       title,
  //       description,
  //       released_year,
  //       categoryname,
  //       platformname,
  //       price,
  //       profile_pic_url: uploadedProfilePicUrl, // Use the uploaded profile pic URL for the new game
  //     });
  
  //     setIsUpdateSuccess(true);
  //     setTimeout(() => {
  //       setIsUpdateSuccess(false);
  //     }, 3000);
  //     // Show a success message or perform other actions after successful add
  //   } catch (error) {
  //     console.error("Error adding new game:", error);
  //     setIsUpdateError("Failed to add new game. Please try again later.");
  //     setTimeout(() => {
  //       setIsUpdateError(false);
  //     }, 3000);
  //     // Handle the error appropriately
  //   }
  // };
  
  const handleFormSubmit = async () => {
    try {
      // Prepare the data for the game information and platforms/categories/prices
      const { title, description, released_year } = gameInfo;
      const categoryname = categories.join(",");
      const platformname = platforms.join(",");
      const price = prices.join(",");
      let profile_pic_url = ""; // Initialize the profile_pic_url
  
      // Check if a new image is selected and upload it
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedImageFile);
        const response = await axios.post("/uploadProfilePic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        profile_pic_url = response.data.profile_pic_url;
      }
  
      // Make the axios post request to add the new game
      await axios.post("/newGame", {
        title,
        description,
        released_year,
        categoryname,
        platformname,
        price,
        profile_pic_url,
      });
      setIsAddedRecord(true);
      setTimeout(() => {
        setIsAddedRecord(false);
      }, 3000); // Hide the alert after 3 seconds
  
      // Handle success or show a success message
    } catch (error) {
      console.error("Error adding new game:", error);
      // Handle the error appropriately or show an error message
    }
  };
  
  const handleImageChange = async (imageFile) => {
    setSelectedImageFile(imageFile); // Set the selected image file in the state
  };


  const gameInfoFields = [
    {
      label: "Game ID",
      value: gameInfo?.gameid || "",
      key: "gameid",
      disabled: true,
    },
    {
      label: "Game Title",
      value: gameInfo?.title || "",
      key: "title",
      disabled: false, // Make it editable only for the edit form
    },
    {
      label: "Description",
      value: gameInfo?.description || "",
      key: "description",
      disabled: false, // Make it editable only for the edit form
    },
    {
      label: "Released Year",
      value: gameInfo?.released_year || "",
      key: "released_year",
      disabled: false, // Make it editable only for the edit form
    },
    {
      label: "Bookmark Count",
      value: gameInfo?.bookmark_count || "0",
      key: "bookmark_count",
      disabled: true,
    },
    {
      label: "Rating",
      value: gameInfo?.average_rating || "0",
      key: "average_rating",
      disabled: true,
    },
  ];
  const filteredGameInfoFields = editForm
  ? gameInfoFields
  : gameInfoFields.filter((field) => !field.disabled);
  return (
    <Card
      color="transparent"
      shadow={false}
      className="h-full w-full overflow-scroll p-6 space-y-6"
    >
     <div className="mt-4">
        {/* Pass the selectedImageFile state and handleImageChange function to ProfilePicUpload */}
        <ProfilePicUpload
          profilePicUrl={gameInfo?.profile_pic_url}
          onImageChange={handleImageChange}
          isEditing={editForm}
        />
      </div>
      <div>
        <Typography variant="h4" color="blue-gray">
          Game Information
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter the game details.
        </Typography>
        <hr className="my-4 border-t-2 border-gray-300" />
        {filteredGameInfoFields.map((field) => (
          <div className="flex my-2 items-center" key={field.key}>
            <Typography style={{ flexBasis: "180px" }}>{field.label}:</Typography>
            <Input
              size="sm"
              className=""
              label={field.label}
              value={field.value}
              disabled={field.disabled}
              onChange={(e) =>
                setGameInfo((prevGameInfo) => ({
                  ...prevGameInfo,
                  [field.key]: e.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>
      {/* Categories */}
      <hr className="my-4 border-t-2 border-gray-300" />
      <div>
        <Typography variant="h4" color="blue-gray" className="mb-3">
          Categories
        </Typography>
        <div className="" style={{ position: "relative" }}>
          {/* Rest of the Categories section */}
          <Input
            size="lg"
            label="Add Category"
            value={categoryInput}
            onChange={(e) => {
              setCategoryInput(e.target.value);
              fetchCategorySuggestions(e.target.value);
            }}
          />
          {categorySuggestions && categorySuggestions.length > 0 && (
            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1200",
              }}
            >
              {categorySuggestions.map((suggestion, index) => (
                <span
                  key={suggestion.categoryid}
                  className="rounded-lg py-1 px-2 mr-2 mb-2"
                  style={{
                    cursor: "pointer",
                    padding: "4px",
                    backgroundColor: generateRandomColor(),
                    color: "#ffffff",
                  }}
                  onClick={() => {
                    setCategoryInput(suggestion.catname);
                    setCategorySuggestions([]);
                  }}
                >
                  {suggestion.catname}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button className="mt-4" color="blue" onClick={addCategory}>
          Add Category
        </Button>
        <div className="mt-4 flex">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-700 rounded-lg py-1 px-2 mr-2 mb-2"
            >
              {cat}
              <span
                className="ml-2 cursor- pointer"
                onClick={() => removeCategory(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block align-text-bottom text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Platforms and Prices */}
      <hr className="my-4 border-t-2 border-gray-300" />
      <div>
        <Typography variant="h4" color="blue-gray" className="mb-3">
          Platforms and Prices
        </Typography>
        <div className="flex gap-3">
          <div className="flex-1" style={{ position: "relative" }}>
            <Input
              size="md"
              label="Add Platform"
              value={platformInput}
              onChange={(e) => {
                setPlatformInput(e.target.value);
                fetchPlatformSuggestions(e.target.value);
              }}
            />
            {platformSuggestions && platformSuggestions.length > 0 && (
              <div
                className="rounded-md"
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "8px",
                  zIndex: "1200",
                }}
              >
                {platformSuggestions.map((suggestion, index) => (
                  <span
                    key={suggestion.platformid}
                    className="rounded-lg py-1 px-2 mr-2 mb-2"
                    style={{
                      cursor: "pointer",
                      padding: "4px",
                      backgroundColor: generateRandomColor(),
                      color: "#ffffff",
                    }}
                    onClick={() => {
                      setPlatformInput(suggestion.platform_name);
                      setPlatformSuggestions([]);
                    }}
                  >
                    {suggestion.platform_name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Input
              size="md"
              label="Add Price"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="mr-2"
            />
          </div>
        </div>
        <Button
          className="mt-3"
          color="blue"
          variant="outlined"
          onClick={addPlatformPrice}
        >
          Add Platform and Price
        </Button>
        <div className="mt-4 flex">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-700 rounded-lg py-1 px-2 mr-2 mb-2"
            >
              {platform}-{prices[index]}
              <span
                className="ml-2 cursor-pointer"
                onClick={() => removePlatformPrice(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block align-text-bottom text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Save and Update Button */}
      <div className="flex flex-row gap-3">
        {editForm==true ?         <Button className="" onClick={updateGame}>
          Save and Update
        </Button> :                  <Button className="" onClick={handleFormSubmit}>
            Add New Record
          </Button>
}

        <Button className="" onClick={onClose}>
          Close
        </Button>
      </div>
      {isUpdateSuccess && (
        <Alert color="green" outlined>
          Platform and category updates successful!
        </Alert>
      )}
      {isUpdateError && (
        <Alert color="red" outlined>
          {isUpdateError}
        </Alert>
      )}
            {isAddedRecord && (
        <Alert color="green" outlined>
          New Game Added
        </Alert>
      )}
    </Card>
  );
};

export default GameInfoForm;
