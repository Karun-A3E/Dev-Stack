import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsTrophyFill,
  BsTrash2Fill,
} from "react-icons/bs";


import Switch from "@mui/material/Switch";
import axios from "../../configurations/axios";
import ProfilePicUpload from "../../components/defaultMulti-Components/ProfilePicUpload";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Alert
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { ReviewCard } from '../../components/Cards/ReviewCard';
import { List, ListItem, ListItemPrefix } from "@material-tailwind/react";

import React, { useState, useEffect } from "react";
import AccountSettings from "../../components/defaultMulti-Components/AccountSettings";
import UserForm from "../../components/defaultMulti-Components/UserForm";
import OrderDetails from "../../components/defaultMulti-Components/OrderDetails";
import Cookies from "js-cookie";
import { ReviewDynamic } from "../../components/Cards/ReviewDynamic";
const Settings = () => {
  const [sendNotification, setSendNotification] = useState(false);
  const [privacySettings, setPrivacySettings] = useState(false);
  const [emailSubscriptions, setEmailSubscriptions] = useState(false);
  const [recentReview,setRecentReview] = useState([])
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [Message, setMessage] = useState("");

  const data = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      component: OrderDetails,
    },
    {
      label: "Profile",
      value: "profile",
      icon: UserCircleIcon,
      component:UserForm ,
    }
  ];
  const [userInfo, setUserInfo] = useState({});
  const fetchUserSpecificInfo = async () => {
    try {
        const response = await axios.get(
          `http://localhost:8081/userSpecificInformation`
        );
        setUserInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching user-specific information:", error);
    }
  };
  const fetchRecentReviews = async () => {
    try {
        const response = await axios.get(
          `http://localhost:8081/getRecentReviewsOfUser`
        );
        setRecentReview(response.data);
    } catch (error) {
      console.error("Error fetching user-specific information:", error);
    }
  };

  // Use useEffect to fetch user-specific information when the component mounts
  useEffect(() => {
    fetchUserSpecificInfo();
    fetchRecentReviews();
  },[]);



  const handleFormSubmit = async (formData) => {
    try {
      // Use the axios instance to put the form data to update the user's profile
      await axios.put("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        setMessage(false);
      }, 3000); // Hide the alert after 3 seconds
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile.");
      setTimeout(() => {
        setErrorMessage(false);
      }, 3000); // Hide the alert after 3 seconds
    }
  };

  const handleProfilePicChange = (file) => {
    setSelectedProfilePic(file);

    const formData = new FormData();
    formData.append("profilePic", file); // Add the profile picture to the form data
  

    // Add the old URL if present (assuming you have 'userInfo' state containing the user information)
    if (userInfo.profile_pic_url) {
      formData.append("old_url", userInfo.profile_pic_url);
    }

    // Call handleFormSubmit directly when the profile picture changes
    handleFormSubmit(formData);
  };



  return (
    <div className="mt-24 relative">
      <div className="mb-20 flex flex-wrap lg:flex-nowrap justify-center rounded-xl relative">
        <img
          src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
          alt="image 1"
          className="h-full w-full object-cover ml-4 mr-4 rounded-xl"
          style={{ height: "600px", maxWidth: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            transform: "translate(10%, 30%)",
          }}
        >
        <div className="">
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
        </div>
          <Card className="xl:w-96 m-4 lg:w-90 md:w-80 mb-24 ">
            <CardHeader floated={false} className="xl:h-100 lg:h-70 md:h-60">
              <div className=" justify-center ml-20 mt-5">
              <ProfilePicUpload
              profilePicUrl={userInfo.profile_pic_url} // Assuming userInfo contains the profile pic URL
              onImageChange={handleProfilePicChange}
              isEditing={true} // Set this to true if you want to allow editing
            />
              </div>
            </CardHeader>
            <CardBody className="text-center">
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {userInfo.username}
              </Typography>
            </CardBody>
            <CardFooter className="flex justify-center gap-7 pt-2">
              <BsFacebook />
              <BsTwitter />
              <BsInstagram />
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-24 flex justify-center">
        <div className="flex flex-col items-center justify- gap-4 w-1/3 border-r border-gray-300 pr-4">
          <div className="flex items-center my-3">
            <Typography variant="subtitle" color="gray">
              <strong>Email:</strong>
            </Typography>
            <Typography>{userInfo.email}</Typography>
          </div>
          <div className="flex items-center my-3">
            <Typography variant="subtitle" color="gray">
              <strong>Type:</strong>
            </Typography>
            <Typography>{userInfo.type}</Typography>
          </div>
          <div className="flex items-center my-3">
            <Typography variant="subtitle" color="gray">
              <strong>Member Since:</strong>
            </Typography>
            <Typography>{userInfo.created_at}</Typography>
          </div>
        </div>

        <div className="w-0.5 bg-gray-300"></div>

        <div className="flex flex-col items-start justify-start w-1/3 border-r border-gray-300 pr-4">
          <div className="flex items-center gap-2 py-3">
            <Switch
              color="primary"
              checked={sendNotification}
              onChange={() => setSendNotification(!sendNotification)}
            />
            <div className="flex flex-col  py-3">
              <Typography variant="subtitle" color="gray">
                Notification Preferences
              </Typography>
              <Typography variant="caption" color="gray">
                (Receive important notifications)
              </Typography>
            </div>
          </div>
          <div className="border-t"></div>
          <div className="flex items-center gap-2">
            <Switch
              color="primary"
              checked={privacySettings}
              onChange={() => setPrivacySettings(!privacySettings)}
            />
            <div className="flex flex-col  py-3">
              <Typography variant="subtitle" color="gray">
                Privacy Settings
              </Typography>
              <Typography variant="caption" color="gray">
                (Control your account's privacy)
              </Typography>
            </div>
          </div>
          <div className="border-t"></div>
          <div className="flex items-center py-3">
            <Switch
              color="primary"
              checked={emailSubscriptions}
              onChange={() => setEmailSubscriptions(!emailSubscriptions)}
            />
            <div className="flex flex-col  py-3">
              <Typography variant="subtitle" color="gray">
                Email Subscriptions
              </Typography>
              <Typography variant="caption" color="gray">
                (Subscribe to our newsletters)
              </Typography>
            </div>
          </div>
          <div className="border-t"></div>
          <div className="flex items-center m-3">
            <Button
              color="red"
              buttonType="outline"
              ripple="dark"
              onMouseEnter={(e) => e.target.classList.remove("border")}
              onMouseLeave={(e) => e.target.classList.add("border")}
            >
              <div className="flex items-center ">
                <BsTrash2Fill />
                Delete Account
              </div>
            </Button>
          </div>
        </div>

        <div className="w-0.5 bg-gray-300"></div>

        {/* Third Column with Card */}
        <div className="w-1/3 p-4">
      {recentReview.length === 0 ? (
        <p>No reviews</p>
      ) : (
        recentReview.map((review) => <ReviewDynamic key={review.id} userInfo={review} />)
      )}
    </div>

      </div>
      <hr className="w-full mt-2 mb-4" />
      <div className="flex justify-center">
        <div className="w-2/3 pr-4">
          <div className="flex flex-col items-center gap-4">
            {/* ... First column content ... */}
            <div className="w-full m-2 ml-2">
              <Tabs value="dashboard">
                <TabsHeader>
                  {data.map(({ label, value, icon }) => (
                    <Tab key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {React.createElement(icon, { className: "w-5 h-5" })}
                        {label}
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody>
                {data.map(({ value, component: Component }) => (
                  <TabPanel key={value} value={value}>
                    {/* Pass userInfo as prop to the UserForm component */}
                    {value === "profile" && <Component userInfo={userInfo} />}
                    {/* For other tabs, just render the component */}
                    {value !== "profile" && <Component />}
                  </TabPanel>
                ))}
                </TabsBody>
              </Tabs>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* This is the end for the second row */}
      {/* This is for the entire page Div */}
    </div>
    //this is the final div
  );
};

export default Settings;
