import React from "react";
import { Link,Navigate, useNavigate } from "react-router-dom";
import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { userProfileData } from "../configurations/MemberRules";
import Cookies from "js-cookie";
import {RiLogoutBoxRLine} from 'react-icons/ri'
const UserProfile = ({ userInfo }) => {
  // Receive the userInfo prop
  const { currentColor, updateMember, isClicked, setIsClicked } =
  useStateContext();
    const getAvatar = (user) => {
    let avatar = user.profile_pic_url;
    // Check if the user has a valid profile_pic_url
    if (avatar && avatar.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      return (
        <img
          className="rounded-full h-24 w-24"
          src={user.profile_pic_url}
          alt="user-profile"
        />
      );
    } else {
      // If the user has an invalid or empty profile_pic_url, display the first 2 characters of the username as the avatar
      return (
        <div className="rounded-full h-24 w-24 bg-gray-300 flex items-center justify-center">
          <p className="text-white text-xl font-bold">
            {user.username ? user.username.slice(0, 2) : "??"}
          </p>
        </div>
      );
    }
  };
  const navigate = useNavigate()
  const handleLogout = () => {
    // Remove the refresh token and userId cookies
    Cookies.remove("refresh");
    localStorage.removeItem('cartItems')
    // Remove the access token from sessionStorage
    const accessToken = sessionStorage.getItem("access");
    console.log("Access Token before logout:", accessToken);
  
    sessionStorage.removeItem("access");
    updateMember(false);
  
    // Close the user profile
    setIsClicked((prev) => ({
      ...prev,
      userProfile: false,
    }));
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      className="backdrop-blur-xl bg-opacity-70 bg-white"
      style={{ zIndex: 12000 }}
    >
      <div className="nav-item absolute right-1 top-16 bg-white/90 dark:bg-[#e4e6e8] p-8 rounded-xl w-96 backdrop-filter backdrop-blur-lg shadow-xl">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg dark:text-gray-200">
            User Profile
          </p>
        </div>
        <Link
          to="/Settings"
          className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6 hover:backdrop-blur-lg rounded-md p-2"
        >
          {getAvatar(userInfo)}
          <div>
            <p className="font-semibold text-xl dark:text-gray-200">
              {userInfo.username}
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {userInfo.type}
            </p>
            <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
              {userInfo.email}
            </p>
          </div>
        </Link>
        <div>
          {userProfileData.map((item, index) => (
            <div
              key={index}
              className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className=" text-xl rounded-lg p-3 hover:bg-light-gray"
              >
                {item.icon}
              </button>
              <div>
                <p className="font-semibold dark:text-gray-200">{item.title}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
          {/* Logout button */}
          <div
            onClick={handleLogout}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: '#DBE9EE', backgroundColor: '#4F6D7A' }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              <RiLogoutBoxRLine />
            </button>
            <div>
              <p className="font-semibold dark:text-gray-200">Logout</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Click here to log out
              </p>
            </div>
          </div>
          {/* End of Logout button */}
        </div>
      </div>
    </div>
  );
  
};

export default UserProfile;
