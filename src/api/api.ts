import axios from "axios";

// const API_BASE_URL = "http://192.168.98.187:3000/api/";
const API_BASE_URL = "http://localhost:7000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
