import { Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { websiteRules } from './website_rules';
import React from 'react';
import Cookies from 'js-cookie';
const PrivateWrapper = ({ element, accessLevel }) => {
  const { isClicked } = useStateContext();
  const { member,admin } = isClicked;
  const shouldAllowAccess = (accessLevel) => {
    if (accessLevel === 'all') {
      return true; // All users can access this page
    } else if (accessLevel === 'member') {
      return member; // Only members can access this page
    }else if(accessLevel === 'admin'){
      return admin
    }
    else{
    return false;}
  };

  if (!shouldAllowAccess(accessLevel)) {
    console.log('Access Level : ',(!shouldAllowAccess(accessLevel)))
    return <Navigate to='/'/>
  }

  // Redirect members to home page if they try to access login or signup
  if (member && (accessLevel === 'login' || accessLevel === 'signup')) {
    return <Navigate to="/" />;
  }

  // Allow access for authorized users
  return <React.Fragment>{element}</React.Fragment>;
};

export default PrivateWrapper;
