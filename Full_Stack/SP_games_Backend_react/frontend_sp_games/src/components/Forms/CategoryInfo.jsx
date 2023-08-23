import React, { useEffect, useState } from "react";
import axios from "../../configurations/axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";
const CategoryInfo = ({ gameid, onClose , editForm = true, addRecord = false,info}) => {
  const [gameInfo, setGameInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryDescriptionInput, setCategoryDescriptionInput] = useState("");
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
 
  const handlePlatformNameChange = (e) => {
    setGameInfo((prevGameInfo) => ({
      ...prevGameInfo,
      catname: e.target.value,
    }));
  };

  const handlePlatformDescriptionChange = (e) => {
    setGameInfo((prevGameInfo) => ({
      ...prevGameInfo,
      cat_description: e.target.value,
    }));
  };



  const handleCategoryNameChange = (e) => {
    setCategoryNameInput(e.target.value);
  };

  const handleCategoryDescriptionChange = (e) => {
    setCategoryDescriptionInput(e.target.value);
  };

  const addNewCategory = async () => {
    try {
      await axios.post(`/categories`, {
        catname: categoryNameInput,
        cat_description: categoryDescriptionInput,
      });
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000);
      // Show a success message or perform other actions after successful add
    } catch (error) {
      console.error("Error adding new category:", error);
      setIsUpdateError("Failed to add new category. Please try again later.");
      setTimeout(() => {
        setIsUpdateError(false);
      }, 3000);
      // Handle the error appropriately
    }
  };
  useEffect(() => {
    const fetchGameInfo = async () => {
      setIsLoading(true);
      try {
        const response =info.find((game) => game.catid === gameid);
         setGameInfo(response);
      } catch (error) {
        console.error(error);
        setGameInfo(null); // Set gameInfo to null if there's an error or no data
      }
      setIsLoading(false);
    };
    if(editForm){    fetchGameInfo();
    }

  }, [gameid,editForm]);




  const updateGame = async () => {
    try {
      const response = await axios.put(`/categories/${gameid}`, {
        catname,
        cat_description,
      });
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000);
      // Show a success message or perform other actions after successful update
    } catch (error) {
      console.error("Error updating platform:", error);
      console.log(error.response.status)
      if (error.response && error.response.status === 409) {
        setIsUpdateError("Title has a duplicate record.");
      } else {
        setIsUpdateError("Update failed. Please try again later.");
      }
      setTimeout(() => {
        setIsUpdateError(false);
      }, 3000);
      // Handle the error appropriately
    }
  };
  if (isLoading) {
    return <Typography>Loading game information...</Typography>;
  }

  if (!gameInfo && editForm) {
    return <Typography>No game information found for the given ID.</Typography>;
  }
  
  const { catname, cat_description } = gameInfo ?? {};
  
  

  if (editForm) {
    return (
    
      <Card
        color="transparent"
        shadow={false}
        className="h-full w-full overflow-scroll p-6 space-y-6"
      >
        {/* Game Information */}
        <div>
          <Typography variant="h4" color="blue-gray">
            Game Information
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter the game details.
          </Typography>
          <hr className="my-4 border-t-2 border-gray-300" />
          <div className="flex my-2">
            <Typography style={{ flexBasis: "180px" }}>Game ID : </Typography>
            <Input
              size="sm"
              className=""
              label="Game ID"
              value={gameid}
              disabled
            />
          </div>
          <div className="flex my-2">
            <Typography style={{ flexBasis: "180px" }}>Game Title : </Typography>
            <Input
              size="sm"
              className=""
              label="Title"
              value={catname || ""}
              onChange={handlePlatformNameChange}
            />
          </div>
          <div className="flex my-2 items-center">
            <Typography style={{ flexBasis: "180px" }}>
              Game Description :{" "}
            </Typography>
            <Input
              size="sm"
              className=""
              label="Description"
              value={cat_description || ""}
              onChange={handlePlatformDescriptionChange}
            />
          </div>
        </div>
        {/* Save and Update Button */}
        <div className="flex flex-row gap-3">
          <Button className="" onClick={updateGame}>
            Save and Update
          </Button>
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
        
      </Card>
    );
  } else if (addRecord) {
    return (
      <Card
        color="transparent"
        shadow={false}
        className="h-full w-full overflow-scroll p-6 space-y-6"
      >
        {/* Game Information */}
        <div>
          <Typography variant="h4" color="blue-gray">
            Category Info
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter the Category details.
          </Typography>
          <hr className="my-4 border-t-2 border-gray-300" />
          <div className="flex my-2 items-center">
            <Typography style={{ flexBasis: "180px" }}>Category Title : </Typography>
            <Input
              size="sm"
              className=""
              label="Category"
              value={categoryNameInput || ""}
              onChange={handleCategoryNameChange}
            />
          </div>
          <div className="flex my-2 items-center">
            <Typography style={{ flexBasis: "180px" }}>
             Description :{" "}
            </Typography>
            <Input
              size="sm"
              className="p-2"
              label="Description"
              value={categoryDescriptionInput || ""}
              onChange={handleCategoryDescriptionChange}
            />
          </div>
        </div>
        {/* Save and Update Button */}
        <div className="flex flex-row gap-3">
          <Button className="" onClick={addNewCategory}>
            Add Category
          </Button>
          <Button className="" onClick={onClose}>
            Close
          </Button>
        </div>
        {isUpdateSuccess && (
          <Alert color="green" outlined>
            New category added successfully!
          </Alert>
        )}
        {isUpdateError && (
          <Alert color="red" outlined>
            {isUpdateError}
          </Alert>
        )}
      </Card>
    );
  }else{return <p>Loading...</p>}

};

export default CategoryInfo;

