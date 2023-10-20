import axios from 'axios';
import { Navigate } from 'react-router-dom';

const _http = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

let isRefreshing = false;
let refreshQueue = [];

// Function to refresh the JWT token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            // Make a request to your server to refresh the access token
            const response = await _http.post('/api/token/refresh/', { refreshToken });
            const newAccessToken = response.data.accessToken;

            // Update the local storage with the new access token
            localStorage.setItem('jwtToken', newAccessToken);

            // Retry the original request with the new token
            isRefreshing = false;
            return newAccessToken;
        } else {
            return;
        }
    } catch (error) {
        isRefreshing = false;
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Add a request interceptor to include the JWT token in the headers
_http.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('jwtToken');
        const userlog = sessionStorage.getItem("key");
        if (!token && !userlog) {
            // If no token is found in local storage, navigate to the login page
            Navigate("/Login");
            return Promise.reject('No token in local storage');
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
                        console.error('Token refresh error:', err);
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
