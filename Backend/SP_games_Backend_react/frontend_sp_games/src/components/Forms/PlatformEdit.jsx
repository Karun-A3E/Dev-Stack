import React, { useState,useEffect } from "react";
import axios from "../../configurations/axios";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";
import { FiThumbsUp } from 'react-icons/fi';

const PlatformEdit = ({ gameid, onClose, editForm = true, addRecord = false ,info}) => {
  const [gameInfo, setGameInfo] = useState({
    platformid: "",
    platform_name: "",
    platform_description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const handlePlatformNameChange = (e) => {
    setGameInfo((prevGameInfo) => ({
      ...prevGameInfo,
      platform_name: e.target.value,
    }));
  };

  const handlePlatformDescriptionChange = (e) => {
    setGameInfo((prevGameInfo) => ({
      ...prevGameInfo,
      platform_description: e.target.value,
    }));
  };
  useEffect(() => {
    const fetchGameInfo = async () => {
      setIsLoading(true);
      try {
        const response =info.find((game) => game.platformid === gameid);
        setGameInfo(response);
        console.log(gameInfo)
      } catch (error) {
        console.error(error);
        setGameInfo(null); // Set gameInfo to null if there's an error or no data
      }
      setIsLoading(false);
    };
    if(editForm){    fetchGameInfo();
    }
  }, [gameid,editForm]);
console.log('info : ')
  const updateGame = async () => {
    try {
      const { platform_name, platform_description } = gameInfo;
      const response = await axios.put(`/platforms/${gameid}`, {
        platform_name,
        platform_description,
      });
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000);
      // Show a success message or perform other actions after successful update
    } catch (error) {
      console.error("Error updating platform:", error);
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

    // If the editForm is false (indicating adding a new platform),
    // reset the gameInfo state to empty when adding a new platform
    if (!editForm) {
      setGameInfo({
        platformid: "",
        platform_name: "",
        platform_description: "",
      });
    }
  };

  const addNewPlatform = async () => {
    try {
      const { platform_name, platform_description } = gameInfo;
      await axios.post(`/platforms`, {
        platform_name,
        platform_description,
      });
      setIsUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdateSuccess(false);
      }, 3000);
      // Show a success message or perform other actions after successful add
    } catch (error) {
      console.error("Error adding new platform:", error);
      setIsUpdateError("Failed to add new platform. Please try again later.");
      setTimeout(() => {
        setIsUpdateError(false);
      }, 3000);
      // Handle the error appropriately
    }

    // If the addRecord is true (indicating adding a new platform),
    // reset the gameInfo state to empty when adding a new platform
    if (addRecord) {
      setGameInfo({
        platformid: "",
        platform_name: "",
        platform_description: "",
      });
    }
  };

  if (isLoading) {
    return <Typography>Loading game information...</Typography>;
  }

  if (!gameInfo && editForm) {
    return <Typography>No game information found for the given ID.</Typography>;
  }

  const { platformid, platform_name, platform_description } = gameInfo ?? {}
  return (
    <Card
      color="transparent"
      shadow={false}
      className="h-full w-full overflow-scroll p-6 space-y-6"
    >
      {/* Game Information */}
      <div>
        <Typography variant="h4" color="blue-gray">
          Platform Information
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter the Platform details.
        </Typography>
        <hr className="my-4 border-t-2 border-gray-300" />
        {!addRecord && (
          <div className="flex my-2">
            <Typography style={{ flexBasis: "180px" }}>Game ID : </Typography>
            <Input
              size="sm"
              className=""
              label="Game ID"
              value={platformid}
              disabled
            />
          </div>
        )}

        <div className="flex my-2">
          <Typography style={{ flexBasis: "180px" }}>Game Title : </Typography>
          <Input
            size="sm"
            className=""
            label="Title"
            value={platform_name || ""}
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
            value={platform_description || ""}
            onChange={handlePlatformDescriptionChange}
          />
        </div>
      </div>
      {/* Save and Update Button */}
      <div className="flex flex-row gap-3">
        {!addRecord && editForm && (
          <Button className="" onClick={updateGame}>
            Save and Update
          </Button>
        )}
        {addRecord && (
          <Button className="" onClick={addNewPlatform}>
            Add Platform
          </Button>
        )}
        <Button className="" onClick={onClose}>
          Close
        </Button>
      </div>
      {isUpdateSuccess && (
        <Alert color="green" outlined>
          <div className="flex items-center">
            <FiThumbsUp className="mr-2" />
            {editForm ? "Platform and category updates successful!" : "New platform added successfully!"}
          </div>
        </Alert>
      )}
      {isUpdateError && (
        <Alert color="red" outlined>
          {isUpdateError}
        </Alert>
      )}
    </Card>
  );
};

export default PlatformEdit;
