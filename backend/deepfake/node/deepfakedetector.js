const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

/* ======================= CORS ======================= */
router.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

/* ======================= FILE UPLOAD SETUP ======================= */
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ======================= MAIN ROUTE ======================= */
router.post("/detect", upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    console.log("📸 File received:", req.file.path);

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // ✅ FIXED → match Python route
    const response = await axios.post(
      "http://127.0.0.1:5000/deepfake",
      form,
      {
        headers: form.getHeaders(),
        timeout: 60000
      }
    );

    fs.unlink(req.file.path, () => {});

    return res.json({
      success: true,
      source: "python-flask",
      result: response.data
    });

  } catch (err) {
    console.error("❌ Deepfake detection error:", err.message);

    return res.status(500).json({
      error: "Deepfake detection failed",
      details: err.response?.data || err.message
    });
  }
});

module.exports = router;