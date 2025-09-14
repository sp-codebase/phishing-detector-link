import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about">
      <h2>About PhishGuard</h2>
      <p>
        <strong>PhishGuard</strong> is an AI-powered phishing detection tool
        that helps users identify suspicious links, emails, and websites to stay
        safe online. Our mission is to make the internet a safer place by
        protecting you from hidden cyber threats.
      </p>

      <div className="about-images">
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87"
            alt="Cybersecurity Hacker"
          />
          <h3>Threat Detection</h3>
          <p>AI-driven detection of phishing and malicious links in real-time.</p>
        </div>

       <div className="card">
  <img
    src="https://unsplash.com/photos/iar-afB0QQw/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU3Nzg5NjkwfDA&force=true"
    alt="Lock Security"
  />
  <h3>Safe & Secure</h3>
  <p>We ensure your online experience is safe with trusted security measures.</p>
</div>


        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475"
            alt="Data Network"
          />
          <h3>Smart Protection</h3>
          <p>Continuous learning AI models adapt to new cyber threats daily.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
