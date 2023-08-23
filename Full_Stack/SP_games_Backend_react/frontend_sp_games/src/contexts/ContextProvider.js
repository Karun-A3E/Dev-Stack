import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../configurations/axios';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const StateContext = createContext();

const initialState = {
  bookmark: false,
  cart: false,
  userProfile: false,
  notification: false,
  member: false,
  admin: false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);

  const handleAuthTokens = () => {
    const access = sessionStorage.getItem('access') ?? null;
    const refresh = Cookies.get('refresh');



    if (access) {
      const userType = jwtDecode(access).role ?? null;
      if (userType === 'customer') {
        setIsClicked((prev) => ({
          ...prev,
          member: true,
        }));
      } else if (userType === 'admin') {
        setIsClicked((prev) => ({
          ...prev,
          admin: true,
        }));
      } else {
        setIsClicked((prev) => ({
          ...prev,
          admin: false,
          member: false,
        }));
      }
    } else {
      setIsClicked((prev) => ({
        ...prev,
        admin: false,
        member: false,
      }));
    }
    if (refresh) {
      axios.defaults.headers.common['Refresh-Token'] = refresh;
    }
  };

  useEffect(() => {
    handleAuthTokens();
  }, []);
  console.log(initialState)

  const handleClick = (clicked) => {
    setIsClicked((prev) => ({
      ...prev,
      [clicked]: !prev[clicked],
    }));
  };

  const updateMember = (value) => {
    setIsClicked((prev) => ({
      ...prev,
      member: value,
    }));
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        handleClick,
        isClicked,
        setIsClicked,
        screenSize,
        setScreenSize,
        updateMember,
        cart: isClicked.cart,
        setCart: setIsClicked,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
