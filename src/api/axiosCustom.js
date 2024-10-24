import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  function (error) {
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
