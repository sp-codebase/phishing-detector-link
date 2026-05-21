const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Radiation@09",
  database: "project_phishing",
  port: 3307
});

// ✅ Check connection
db.connect((err) => {
  if (err) {
    console.error("❌ Connection FAILED:", err.message);
  } else {
    console.log("✅ Connected to MySQL successfully!");
  }
});

module.exports = db;