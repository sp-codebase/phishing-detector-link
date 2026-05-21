import axios from "axios";

const deepfakeApi = axios.create({
  baseURL: "http://localhost:5001",  // Node handles both
});

export default deepfakeApi;