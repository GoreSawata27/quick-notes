import axios from "axios";
import { Navigate } from "react-router-dom";

const _http = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

let isRefreshing = false;
let refreshQueue = [];

// Function to refresh the JWT token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      // Make a request to your server to refresh the access token
      const response = await _http.post("/api/token/refresh/", {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;

      // Update the local storage with the new access token
      localStorage.setItem("jwtToken", newAccessToken);

      // Retry the original request with the new token
      isRefreshing = false;
      return newAccessToken;
    } else {
      return;
    }
  } catch (error) {
    isRefreshing = false;
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Add a request interceptor to include the JWT token in the headers
_http.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("jwtToken");
    const userlog = sessionStorage.getItem("key");
    if (!token && !userlog) {
      // If no token is found in local storage, navigate to the login page
      Navigate("/Login");
      return Promise.reject("No token in local storage");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
_http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        // Call the function to refresh the token
        return refreshAccessToken()
          .then((newAccessToken) => {
            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return _http(error.config);
          })
          .catch((err) => {
            isRefreshing = false;
            console.error("Token refresh error:", err);
            // Handle the token refresh error, e.g., log out the user or redirect to the login page.
            throw err;
          });
      } else {
        // If the token is already refreshing, queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default _http;


//without refresh token 


import axios from "axios";
import  jwtDecode  from "jwt-decode";

const _http = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Add a request interceptor to include the JWT token in the headers
_http.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // If no token is found in local storage and the user is not on the login page, navigate to the login page
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
      return Promise.reject("No token in local storage");
    }

    // Decode the JWT token to check its expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("jwtTokenExpires");
      localStorage.removeItem("key");
      localStorage.removeItem("Name");
      localStorage.removeItem("Email");
      localStorage.removeItem("UserImage");
      // Token has expired, navigate to the login page
      window.location.href = "/signin";
      return Promise.reject(
        "Your session has expired. Please log in again to continue."
      );
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default _http;
