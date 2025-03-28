import axios from 'axios';

console.log(import.meta.env.REACT_APP_API_BASE_URL );

const API_BASE_URL = "https://healthcare-9uj8.onrender.com"; 

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
  });

export default API;
