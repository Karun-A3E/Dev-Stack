import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import axios from "../../configurations/axios";
import {Alert} from '@material-tailwind/react'
function UserForm({ userInfo }) {
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [isFormModified, setIsFormModified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [Message, setMessage] = useState("");

  const handleUsernameChange = (value) => {
    setUsername(value);
    setIsFormModified(true);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setIsFormModified(true);
  };

  const handleUpdateInfo = async () => {
    if (!isFormModified) return; // 

    try {
      // Perform the update directly
      const updatedUser = await axios.put("/users", {
        username,
        email,
      });

      // If the update is successful, display a success message
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 3000); // Hide the alert after 3 seconds
    } catch (error) {
      console.error("Error updating user information:", error);

      // If the error code is 1062 (duplicate key error), set an error message
      if (error.response && error.response.status === 409 && error.response.data.errorCode === 1062) {
        setErrorMessage("Username or email already exists");
        setTimeout(() => {
          setErrorMessage(false);
        }, 3000); // Hide the alert after 3 seconds
      } else {
        // For other errors, display a generic error message
        setErrorMessage("Failed to update user information");
        setTimeout(() => {
          setErrorMessage(false);
        }, 3000); // Hide the alert after 3 seconds
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Profile Settings
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter the New Value To Update
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label={userInfo.username}
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
            <Input
              size="lg"
              label={userInfo.email}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>
          <Button
            className="mt-6"
            fullWidth
            onClick={handleUpdateInfo}
            disabled={!isFormModified}
          >
            Update Info
          </Button>
        </form>
        {errorMessage && (
        <Alert color="red" outlined>
          {errorMessage}
        </Alert>
      )}
            {Message && (
        <Alert color="green" outlined>
          Update Success
        </Alert>
      )}
      </Card>
    </div>
  );
}

export default UserForm;
