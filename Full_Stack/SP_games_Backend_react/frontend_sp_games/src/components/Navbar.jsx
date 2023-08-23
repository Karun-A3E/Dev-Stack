  import React, { useEffect, useState } from "react";
  import { Link, useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
  import { AiOutlineMenu,AiFillSetting,AiOutlineWallet,AiFillAlipaySquare } from "react-icons/ai";
  import { FiShoppingCart } from "react-icons/fi";
  import { RiChatNewLine } from "react-icons/ri";
  import { RiNotification3Line } from "react-icons/ri";
  import { MdKeyboardArrowDown } from "react-icons/md";
  import { IoSearchOutline } from "react-icons/io5";
  import { Tooltip } from "react-tooltip";
  import UserProfile from "./UserProfile";
  import "react-tooltip/dist/react-tooltip.css";
  import axios from '../configurations/axios'
  import { useStateContext } from "../contexts/ContextProvider";
  import Cookies from "js-cookie";
  import {BsBookmarkPlus} from 'react-icons/bs'
  import Cart from '../components/Cards/Cart'
  const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <div>
      <a
        data-tooltip-id={title} // Use the data-tip attribute to set the tooltip content
        data-for="my-tooltip" // Set the ID of the tooltip container
        data-tooltip-content={title}
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
        {icon}
      </a>
      <Tooltip id={title} place="top" type="light" effect="solid" />
    </div>
  );

  const Navbar = () => {

    const [showCart, setShowCart] = useState(false);
    const handleCartClick = () => {
      setShowCart((prev) => !prev);
      // Toggle the value of showCart when the cart icon is clicked
    };

    const {
      activeMenu,
      setActiveMenu,
      handleClick,
      isClicked,
      screenSize,
      setScreenSize,
    } = useStateContext();

    // website_rules.js
    
    const navigate = useNavigate();

    // Rest of the code...

    const handleLoginClick = () => {
      navigate('/Auth/login');
    };
    
    const handleSignUpClick = () => {
      navigate('/Auth/signup');
    };
        
    const handleSuggestionClick = (gameName) => {
      console.log('Click the : ',gameName);
      // navigate(`/game/${gameName}`); // Use navigate to navigate to the product page with the selected game's details
    };
    const handleBookmarkClick = () => {
      handleClick('bookmark'); // Call the handleClick function with the 'bookmark' parameter
      navigate('/Bookmark'); // Use navigate to navigate to the '/Bookmark' page
    };
  
  

  const memberNavLinks = [
    { title: 'Cart', customFunc: () => handleClick('cart'), color: 'blue', icon: <FiShoppingCart />, access: 'Member' },
    { title: 'Bookmarks', customFunc: handleBookmarkClick, color: 'blue', dotColor: '#C51605', icon: <BsBookmarkPlus />, access: 'Member' },
    { title: 'Notification', customFunc: () => handleClick('notification'), color: 'blue', dotColor: '#03C9D7', icon: <RiNotification3Line />, access: 'Member' },];
    const nonMemberNavLinks = [
      // Add the 'Sign Up' and 'Login' buttons for non-members
      {
        title: 'Sign Up',
        customFunc: handleSignUpClick,
        color: 'blue',
        icon: <AiOutlineWallet />,
        access: 'All',
      },
      {
        title: 'Login',
        customFunc: handleLoginClick,
        color: 'blue',
        icon: <AiFillAlipaySquare />,
        access: 'All',
      },
    ];
  const AdminNavLinks = [  { title: 'Settings', customFunc:  () => handleClick('notification'), color: 'red', icon: <AiFillSetting />, access: 'Admin' },
  ]

    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const handleActiveMenu = () => setActiveMenu(!activeMenu);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      if (screenSize <= 900) {
        setActiveMenu(false);
      } else {
        setActiveMenu(true);
      }
    }, [screenSize]);

    const handleSearch = async (query) => {
      setSearchQuery(query);
      setShowAutocomplete(true);
      if (!query || query.trim() === "") {
        return [];
      } else {
        try {
          const response = await axios.get('http://localhost:8081/getSearchResults', {
            params: { query },
          });
          const results = response.data;
          console.log('Autocomplete results:', results);
          setAutocompleteResults(results);
        } catch (error) {
          console.error('Error fetching autocomplete results:', error);
        }
      }
    };

    const accessLevel = isClicked.member ? 'Member' : isClicked['admin'] ? 'Admin' : 'All';
    let navigationLinks = [];

    if (accessLevel === 'Member') {
      navigationLinks = memberNavLinks;
    } else if (accessLevel === 'All') {
      navigationLinks = nonMemberNavLinks;
    } else if (accessLevel === 'Admin') {
      navigationLinks = AdminNavLinks;
    }
      const [userInfo,setUserInfo] = useState({})
      const fetchUserSpecificInfo = async () => {
        try {
            const response = await axios.get(`/userSpecificInformation`);
            // Assuming the API returns user-specific information
            setUserInfo(response.data[0])
          }
        catch (error) {
          console.error('Error fetching user-specific information:', error);
        }
      };

      
      // Use useEffect to fetch user-specific information when the component mounts
      useEffect(() => {
        fetchUserSpecificInfo();
      },{})
      const getAvatar = (userInfo) => {
        const username = userInfo.username || "User";
        const avatar = userInfo.profile_pic_url || "";
        if (avatar && avatar.match(/\.(jpeg|jpg|gif|png)$/) != null) {
          // If the profile_pic_url is a valid image URL
          return <img src={avatar} alt="Avatar" className="rounded-full w-8 h-8" />;
        } else {
          // If the profile_pic_url is invalid, display the first 2 characters of the username as the avatar
          return <div className="rounded-full w-8 h-8 bg-blue-500 text-white flex items-center justify-center">{username.slice(0, 2).toUpperCase()}</div>;
        }
      };

    return (
      <div className="flex justify-between p-2 md:mx-6 relative">
  <NavButton title="Menu" customFunc={handleActiveMenu} color='blue' icon={<AiOutlineMenu />} />
      <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setShowAutocomplete(false)} // Hide autocomplete when input loses focus
            className="pl-8 pr-4 py-2 text-sm rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Search..."
          />
          <IoSearchOutline className="absolute top-3 left-3 text-gray-400 rounded" />

          {/* Display autocomplete results */}
          {showAutocomplete && autocompleteResults.length > 0 && (
        <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-full" style={{ zIndex: "999" }}>
          {autocompleteResults.map((result) => (
            <button
              key={result.gameid}
              className="autocomplete-item px-4 py-2 hover:bg-gray-100 cursor-pointer block"
              onClick={() => handleSuggestionClick(result.gameid)} // Call handleSuggestionClick on click
            >
              {result.title}
            </button>
          ))}
        </div>
      )}

        </div>

        <div className="flex">
        {navigationLinks.map((navLink) => (
            <NavButton
              key={navLink.title}
              title={navLink.title}
              customFunc={navLink.customFunc}
              color={navLink.color}
              dotColor={navLink.dotColor}
              icon={navLink.icon}
            />
          ))}

{accessLevel === 'Member' || accessLevel === 'Admin' ? (
  <div
    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
    onClick={() => handleClick('userProfile')}
  >
    {getAvatar(userInfo)} {/* Use the getAvatar function to display the avatar */}
    <p>
      <span className="text-gray-400 text-14">Hi,</span>{" "}
      <span className="text-gray-400 font-bold ml-1 text-14">
        {userInfo.username || "User"} {/* Display the actual username or fallback to "User" */}
      </span>
    </p>
    <MdKeyboardArrowDown className="text-gray-400 text-14" />
  </div>
) : null}


    <Tooltip id="profile" place="top" type="light" effect="solid" />


          {/* {isClicked['cart'] && (<Cart />)} */}
          {/* {isClicked.chat && (<Chat />)}
          {isClicked.notification && (<Notification />)} */}
          {isClicked['userProfile'] && (<UserProfile userInfo={userInfo} />)}
          {isClicked['cart'] && (<Cart/>)}
        </div>
      </div>
    );
  };

  export default Navbar;
