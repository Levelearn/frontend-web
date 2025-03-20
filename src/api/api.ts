import axios from "axios";

const API_BASE_URL = "http://194.163.40.203:7000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
