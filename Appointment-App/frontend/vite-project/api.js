import axios from "axios";

const API_BASE_URL = "https://healthcare-9uj8.onrender.com";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default API;
