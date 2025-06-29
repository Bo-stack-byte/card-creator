import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    const token = response.credential;
    const expiresAt = response.expires_at;
    scheduleTokenRefresh(expiresAt);
    localStorage.setItem('expiresAt', expiresAt);
    localStorage.setItem('google_token', token);
    setIsLoggedIn(true);
    setUserToken(token);
  };

  const handleLoginFailure = (response) => {
    console.error("Login Failed:", response);
  };

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    setIsLoggedIn(false);
    setUserToken(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('google_token');
    if (token) {
      setIsLoggedIn(true);
      setUserToken(token);
    }
  }, []);



  const refreshToken = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      localStorage.setItem('user', currentUser);
      const newAuthResponse = await currentUser.reloadAuthResponse(); // Refresh the token
      const newToken = newAuthResponse.id_token;
      localStorage.setItem('google_token', newToken); // Update stored token
      setUserToken(newToken); // Update app state with new token
      console.log("Token refreshed:", newToken);
      scheduleTokenRefresh(newAuthResponse.expires_at);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setIsLoggedIn(false);
    }
  };

  const scheduleTokenRefresh = (expiresAt) => {
    const timeToRefresh = expiresAt - Date.now() - 60000; // Refresh 1 minute before expiry
    if (timeToRefresh > 0) {
      setTimeout(refreshToken, timeToRefresh);
    }
  };
  
  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID
  console.log(process.env);
  console.log("Client ID:", client_id);
  console.log("user token", userToken);

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <div className="App">
        {isLoggedIn ? (
          <div>
            <p>Logged in w/google. I only track your user id on image upload.</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <span>Log in w/Google to save images.<br />(I don't mean to request your name and email but I just haven't figured out OAuth enough to not ask for that.)</span>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              buttonText="Login with Google"
              scope="openid"
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
