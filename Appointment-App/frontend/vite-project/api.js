import axios from 'axios';

console.log(import.meta.env.REACT_APP_API_BASE_URL );
const API_BASE_URL = "http://localhost:8001"; 

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
  });

export default API;
