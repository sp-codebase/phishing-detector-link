import axios from "axios";

const phishingApi = axios.create({
  baseURL: "http://localhost:5001",
});

// ✅ CALL YOUR BACKEND API
export const predictPhishing = (url) => {
  return phishingApi.post("/api/predict-ml", { url });
};

export default phishingApi;