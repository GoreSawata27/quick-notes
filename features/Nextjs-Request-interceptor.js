//with refresh token
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create an axios instance
const _http = axios.create({
  baseURL: "http://localhost:8001",
});

// Function to check if the token is expired based on stored expiration time
const isTokenExpired = () => {
  const expirationTime = localStorage.getItem("tokenExpiryTime");
  const currentTime = Date.now();

  return expirationTime && currentTime >= expirationTime;
};

// Function to refresh the token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await axios.post(
      "http://localhost:8001/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const newAccessToken = response.data.access_token;

    // Decode the new token to get the expiration time
    const decoded = jwtDecode(newAccessToken);
    const newExpiryTime = decoded.exp * 1000; // Convert to milliseconds

    // Save the new access token and expiration time in local storage
    localStorage.setItem("jwtToken", newAccessToken);
    localStorage.setItem("tokenExpiryTime", newExpiryTime);

    return newAccessToken;
  } catch (refreshError) {
    console.error("Failed to refresh token", refreshError);
    throw refreshError;
  }
};

// Request interceptor
_http.interceptors.request.use(
  async (config) => {
    if (isTokenExpired()) {
      try {
        const newAccessToken = await refreshAccessToken();

        // Update token in the config
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      // Get the access token from local storage
      const token = localStorage.getItem("jwtToken");

      // If token exists, set the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
_http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return _http(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default _http;

//will check every time exp time

// import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// // Create an axios instance
// const _http = axios.create({
//   baseURL: 'http://localhost:8001',
// });

// // Function to check if token is expired
// const isTokenExpired = (token) => {
//   if (!token) return true;

//   const decoded = jwtDecode(token);
//   const currentTime = Date.now() / 1000;

//   // Check if the token has expired
//   return decoded.exp < currentTime;
// };

// // Request interceptor
// _http.interceptors.request.use(
//   async (config) => {
//     let token = localStorage.getItem('jwtToken');

//     // If the token exists and is expired, refresh it
//     if (isTokenExpired(token)) {
//       const refreshToken = localStorage.getItem('refreshToken');

//       // Call the refresh token API
//       try {
//         const response = await axios.post(
//           'http://localhost:8001/refresh',
//           {},
//           {
//             headers: {
//               Authorization: Bearer ${refreshToken},
//             },
//           }
//         );

//         const newAccessToken = response.data.access_token;

//         // Save the new access token in local storage
//         localStorage.setItem('jwtToken', newAccessToken);

//         // Update token in the config
//         token = newAccessToken;
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     // If token exists, set the Authorization header
//     if (token) {
//       config.headers.Authorization = Bearer ${token};
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// _http.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if the error is due to an expired token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem('refreshToken');

//       // Call the refresh token API
//       try {
//         const response = await axios.post(
//           'http://localhost:8001/refresh',
//           {},
//           {
//             headers: {
//               Authorization: Bearer ${refreshToken},
//             },
//           }
//         );

//         const newAccessToken = response.data.access_token;

//         // Save the new access token in local storage
//         localStorage.setItem('jwtToken', newAccessToken);

//         // Update the Authorization header and retry the original request
//         originalRequest.headers.Authorization = Bearer ${newAccessToken};

//         return _http(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default _http;
