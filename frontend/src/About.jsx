import React from "react";
import { Link } from "react-router-dom";      // <-- added
import "./About.css";

function About() {
  return (
    <section className="about">
      <h2>About PhishGuard</h2>
      <p>
        <strong>PhishGuard</strong> is an AI-powered phishing detection tool
        that helps users identify suspicious links, emails, and websites to stay
        safe online. Our mission is to make the internet a safer place by
        protecting users from hidden cyber threats & evolving AI manipulations.
      </p>

      <div className="about-images">

        {/* 🔥 CLICKABLE CARD → OPENS /deepfake */}
        <Link to="/deepfake" className="card clickable-card" style={{ textDecoration: "none", color: "inherit" }}>
          <img
            src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=60"
            alt="Cyber Threat Detection"
          />
          <h3>DeepFake Detection</h3>
          <p>🚨 Detect phishing + deepfake content using AI.</p>
        </Link>

        {/* Normal Card */}
        <div className="card">
          <img
            src="https://plus.unsplash.com/premium_photo-1733317239304-a6bf462a2596?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Security Shield"
          />
          <h3>Safe & Secure</h3>
          <p>We ensure your online experience stays protected with top-tier AI security.</p>
        </div>

        {/* Normal Card */}
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=60"
            alt="Data AI Network"
          />
          <h3>Smart Protection</h3>
          <p>Our AI continuously learns & adapts to modern cyber threats.</p>
        </div>

      </div>
    </section>
  );
}

export default About;
