import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import "./Navbar.css";
import Tool from './Tool.jsx';
import About from './About.jsx';
import CustomerReview from "./CustomerReview.jsx";
import api from "./api/axios.js";
import DetectForm from "./components/DetectForm.jsx";

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

  //new api state
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
     <div id="tool" className="tool-section">
  <h2 className="text-2xl font-bold mb-4">Phishing Detector Tool</h2>
 <DetectForm onResult={addHistoryItem} />

</div>


       <div id="about">
        <About />
      </div>

      <div id="customer-review">
  <CustomerReview />
</div>

{/* ---- NEW: API Debug UI ---- */}
      <div style={{ padding: "20px", background: "#f3f4f6", marginTop: "40px" }}>
        <h3>Backend API Status</h3>
        <pre>{apiHealth ? JSON.stringify(apiHealth, null, 2) : "Loading..."}</pre>

        <h3>Users from API</h3>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 text-center py-4 text-sm text-slate-600">
        ⚠️ This is a demo phishing detector 
      </footer>
    </div>
  );
}
