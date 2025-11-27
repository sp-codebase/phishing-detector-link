const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

const Prediction = require("./models/Prediction");

const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");



const pythonCmd =
  process.env.PYTHON_CMD || (process.platform === "win32" ? "py" : "python3");

// Multer storage setup (paste after your requires)
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB max



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/phishing_detector";

mongoose.connect(MONGODB_URI, {

useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("DB Error:", err));


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// users endpoint (dummy data)
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

// request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// ========================
// ML PREDICTION ENDPOINT
// ========================
app.post("/api/predict-ml", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Use 'py' for Windows (works better than 'python')
  const py = spawn("py", ["-u", "inspect_pipeline.py", url], {
    cwd: __dirname,
  });

  let output = "";
  let error = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    error += data.toString();
  });

  py.on("close", async (code) => {
    console.log("RAW ML OUTPUT >>>", output);

  
    if (code !== 0) {
      console.error(error);
      return res.status(500).json({ error: "ML script failed", details: error });
    }

     // parse ML output
  let result;
  try {
    result = JSON.parse(output);
  } catch (err) {
    console.error("JSON parse error:", output);
    return res.status(500).json({ error: "Invalid ML output", raw: output });
  }

  // DEBUG: show ML result before saving
  console.log("ML result:", JSON.stringify(result, null, 2));

  // Build payload defensively (use fallbacks)
  const payload = {
    url: url,
    prediction: (result.prediction ?? result.label ?? String(result)).toString(),
    confidence: (typeof result.confidence === "number") ? result.confidence : parseFloat(result.confidence) || 0,
    createdAt: new Date()
  };

  console.log("Saving payload to DB:", payload);

  try {
    const saved = await Prediction.create(payload);
    console.log("Saved doc:", saved);
    return res.json({ success: true, saved, result });
  } catch (dbErr) {
    // Print the full error (message + stack) so we can fix it
    console.error("DB save error message:", dbErr && dbErr.message);
    console.error("DB save error full:", dbErr && dbErr.stack);
    return res.status(500).json({ error: "Failed to save to DB", details: dbErr && dbErr.message });
  }

  }); // end py.on("close", ...)

}); // <-- THIS closes app.post("/api/predict-ml", ...)

// ========================





   

  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
