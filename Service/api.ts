import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.40.17:5248/api", // ✅ đúng
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
