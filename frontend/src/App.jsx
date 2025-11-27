import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import "./components/Navbar.css";
import Tool from './components/Tool.jsx';
import About from './About.jsx';
import CustomerReview from "./components/CustomerReview.jsx";
import api from "./api/axios.js";
import DetectForm from "./components/DetectForm.jsx";
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phish_history") || "[]");
    } catch {
      return [];
    }
  });

  function addHistoryItem(item) {
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 30);  // keep latest 30
      localStorage.setItem("phish_history", JSON.stringify(updated));
      return updated;
    });
  }

  useEffect(() => {
    localStorage.setItem("phish_history", JSON.stringify(history.slice(0, 30)));
  }, [history]);

  // new api state
  const [apiHealth, setApiHealth] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Call backend API
    api.get("/api/health")
      .then(res => setApiHealth(res.data))
      .catch(err => console.error("API Health Error:", err));

    api.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Users Error:", err));
  }, []);

  // local uploaded file path you provided (optional use)
  const uploadedImagePath = "/mnt/data/2025-11-22T09-25-15.902Z.png";

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2>PhishGuard</h2>
        <div className="nav-links">
          {/* keep anchors for in-page scrolling */}
          <a href="#tool">Tool</a>
          <a href="#about">About</a>
          <a href="#customer-review">Customer Review</a>

         
        </div>
      </nav>

      {/* ROUTES: Home (/) renders the single-page site sections.
          /deepfake is a dedicated page for the detector */}
      <Routes>
        {/* HOME route: render current page sections exactly as before */}
        <Route
          path="/"
          element={
            <>
              {/* Tool Section */}
              <div id="tool" className="tool-section">
                <h2 className="text-2xl font-bold mb-4">Phishing Detector Tool</h2>
                <DetectForm onResult={addHistoryItem} />
              </div>

              {/* About Section */}
              <div id="about">
                <About />
              </div>

              {/* Customer Review Section */}
              <div id="customer-review">
                <CustomerReview />
              </div>

              {/* Optional debug info (API health/users) */}
              <div style={{ padding: 12, fontSize: 13, color: "#666" }}>
                <div>API Health: {apiHealth ? JSON.stringify(apiHealth) : "unknown"}</div>
                <div>Users: {users ? users.length : 0}</div>
              </div>

              {/* Footer */}
              <footer className="bg-slate-100 text-center py-4 text-sm text-slate-600">
                ⚠️ This is a demo phishing detector
              </footer>
            </>
          }
        />

      
      </Routes>
    </div>
  );
}
