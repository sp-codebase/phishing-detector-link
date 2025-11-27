import axios from "axios";

// AUTO-DETECT backend URL
const backendURL =
 "https://phishing-detector-link-100.onrender.com";

const api = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
