import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = 'http://localhost:8081';

const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh');

    if (!refreshToken) {
      // Non-members don't have a refresh token, so no need to refresh the token
      return Promise.reject('User not authenticated');
    }

    // Only proceed to refresh the token if the user is authenticated
    const response = await axios.post(
      'http://localhost:8081/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Refresh-Token': refreshToken,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const newAccessToken = response.data.accessTkt;
      // Store the new access token
      sessionStorage.setItem('access', newAccessToken);

      // Update the authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      return Promise.resolve(response); // Resolve the promise with the response
    }
  } catch (error) {
    console.log('Failed to refresh token:', error);
    return Promise.reject(error); // Reject the promise with the error
  }
};

axios.interceptors.request.use(async (config) => {
  const accessToken = sessionStorage.getItem('access');
  const refreshToken = Cookies.get('refresh');

  if (accessToken) {
    // If access token is available, add it to the request headers
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (refreshToken) {
    // If access token is absent but refresh token is available, refresh the access token
    try {
      const response = await refreshToken();
      if (response.status === 200) {
        const newAccessToken = response.data.accessTkt;
        // Store the new access token
        sessionStorage.setItem('access', newAccessToken);
  
        // Update the authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  
        // Reload the application to ensure the new token is used in subsequent requests
        window.location.reload();
  
        return Promise.resolve(response); // Resolve the promise with the response
      }
    } catch (error) {
      console.log('Failed to refresh token:', error);
    }
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      try {
        await refreshToken();
        window.location.reload()
        } catch (error) {
        console.log('Failed to refresh token:', error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
