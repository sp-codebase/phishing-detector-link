import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./components/Navbar.css";
import HistoryPage from "./pages/HistoryPage.jsx";

// Components
import About from "./About.jsx";
import CustomerReview from "./components/CustomerReview.jsx";
import DetectForm from "./components/DetectForm.jsx";
import DeepfakePage from "./pages/DeepfakePage.jsx";
import ScrollToHash from "./components/ScrollToHash";

import phishingApi from "./api/phishingApi.js";



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
      const updated = [item, ...prev].slice(0, 30);
      localStorage.setItem("phish_history", JSON.stringify(updated));
      return updated;
    });
  }

  useEffect(() => {
  phishingApi.get("/api/health").catch(console.error);
}, []);

  return (
    <>
      {/* 🔥 Handles /#tool scrolling */}
      <ScrollToHash />

      {/* ========= NAVBAR ========= */}
      <nav className="navbar">
        <h2>PhishGuard</h2>

        <div className="nav-links">
  <Link to="/#tool">Tool</Link>
  <Link to="/#about">About</Link>
  <Link to="/#customer-review">Customer Review</Link>
  <Link to="/deepfake">Deepfake</Link>

  {/* 🔥 Unified Dashboard */}
  <a
    href="/dashboard/dashboard.html"
    target="_blank"
    rel="noopener noreferrer"
  >
    Dashboard
  </a>
</div>

      </nav>

      {/* ========= ROUTES ========= */}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <section id="tool" className="tool-section">
                <h2 className="text-2xl font-bold mb-4">
                  Phishing Detector Tool
                </h2>
                <DetectForm onResult={addHistoryItem} />
              </section>

              <section id="about">
                <About />
              </section>

              <section id="customer-review">
                <CustomerReview />
              </section>

              <footer className="bg-slate-100 text-center py-4 text-sm text-slate-600">
                ⚠️ This is a demo phishing detector
              </footer>
            </>
          }
        />

        {/* DEEPFAKE PAGE */}
        <Route path="/deepfake" element={<DeepfakePage />} />

        {/* ✅ HISTORY PAGE — ADD IT HERE */}
  <Route path="/history" element={<HistoryPage />} />
</Routes> 
      
    </>
    
  );
}
