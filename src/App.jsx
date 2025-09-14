import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import "./Navbar.css";
import Tool from './Tool.jsx';
import About from './About.jsx';
import CustomerReview from "./CustomerReview.jsx";

export default function App() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phish_history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("phish_history", JSON.stringify(history.slice(0, 30)));
  }, [history]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2>PhishGuard</h2>
        <div className="nav-links">
          
          <a href="#tool">Tool</a>
          <a href="#about">About</a>
          <a href="#customer-review">Customer Review</a>
        </div>
      </nav>

      

      {/* Tool Section */}
      <div id="tool">
        <Tool />
      </div>

       <div id="about">
        <About />
      </div>

      <div id="customer-review">
  <CustomerReview />
</div>

      {/* Footer */}
      <footer className="bg-slate-100 text-center py-4 text-sm text-slate-600">
        ⚠️ This is a demo phishing detector 
      </footer>
    </div>
  );
}
