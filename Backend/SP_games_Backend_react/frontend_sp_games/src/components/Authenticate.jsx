import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import axios from '../configurations/axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const Authenticate = ({ isSignUp }) => {
  const navigate = useNavigate();
  const { setIsClicked, accessToken } = useStateContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username: username,
      email: email,
      password: password,
    };
  

    const SetCookie = (name, token) => {
      const expires = new Date();
      expires.setDate(expires.getDate() + 1); // Expires after 1 day
      Cookies.set(name, token, {
        expires,
      });
    };

    function setSessionStorageItem(key, value, expirationTime) {
      sessionStorage.setItem(key, value);
      setTimeout(() => {
        sessionStorage.removeItem(key);
      }, expirationTime);
    }

    try {
      let response;
      console.log('isSignUp : ',isSignUp)
      if (isSignUp) {
        // Sign-up
        response = await axios.post('/addNewUser', userData);
      } else {
        // Login
        response = await axios.post('/login', userData);
      }
  

      if (response.status === 201) {
        // Registration or login successful
        const data = response.data;
        setSessionStorageItem('access', data.accessTkt, 2 * 60 * 60 * 1000); // 2 hours
        console.log(jwtDecode(data.accessTkt));
        SetCookie('refresh', data.refreshTkt);
        if (data.type === 'customer') {
          setIsClicked((prev) => ({
            ...prev,
            member: true,
          }));
        } else {
          setIsClicked((prev) => ({
            ...prev,
            admin: true,
          }));
        }
        // Set member to true after successful login
        navigate('/Overview');
      } else {
        // Authentication failed
        console.log('Authentication failed');
        // You can display an error message to the user here
      }
    } catch (error) {
      console.log('Error occurred during authentication:', error);
      // You can handle errors here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isSignUp && ( // Render the username field only for sign-up
        <div className="mt-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 px-4 py-2 w-full border rounded-md"
            required
          />
        </div>
      )}
      <div className="mt-4">
        <label htmlFor="email" className="block text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 px-4 py-2 w-full border rounded-md"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="block text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 px-4 py-2 w-full border rounded-md"
          required
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className={`${
            isSignUp ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
          } px-4 py-2 text-white rounded-md`}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Authenticate;
