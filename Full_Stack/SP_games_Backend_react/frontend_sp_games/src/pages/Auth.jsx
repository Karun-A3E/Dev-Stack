import React, { useState, useEffect } from 'react';
import Authenticate from '../components/Authenticate';
import { useParams, useNavigate } from 'react-router-dom';

const Auth = () => {
  const { stat } = useParams();
  const [isSignUpForm, setIsSignUpForm] = useState(stat === 'signup');
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUpForm(stat === 'signup');
  }, [stat]);

  const handleToggleForm = () => {
    setIsSignUpForm((prev) => !prev);
    const newStat = isSignUpForm ? 'login' : 'signup';
    navigate(`/Auth/${newStat}`);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">
          {isSignUpForm ? 'Sign Up' : 'Login'}
        </h2>
        <Authenticate isSignUp={isSignUpForm} />
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleToggleForm}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          >
            {isSignUpForm ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
