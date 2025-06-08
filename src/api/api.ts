import axios from "axios";

const API_BASE_URL = "http://31.97.67.152:7000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
