# PhishGuard 🔐🧠

PhishGuard is a **full‑stack AI-powered security application** that detects **phishing URLs** and **deepfake images** using Machine Learning and Deep Learning models.

This project combines:

* 🌐 **Frontend** (Vite + JS)
* ⚙️ **Backend API** (Node.js + Express)
* 🧠 **ML Models** (Python: Scikit‑learn & TensorFlow)
* 🗄 **Database** (MongoDB)

---

## 🚀 Features

### 🔗 Phishing Detection

* Detects whether a URL is **phishing or legitimate**
* ML model trained using **URL-based features**
* Confidence score included
* Python ML pipeline invoked from Node.js

### 🖼 Deepfake Detection

* Detects **deepfake vs real images**
* Uses **Xception CNN model**
* Supports image upload via REST API
* TensorFlow + OpenCV based pipeline

---

## 📂 Project Structure

```txt
phishing-detector-link/
├── backend/
│   ├── index.js                  # Main Node.js server
│   ├── requirements.txt          # Python dependencies
│   │
│   ├── phishing/
│   │   ├── node/
│   │   │   └── Prediction.js     # MongoDB schema
│   │   └── python/
│   │       ├── inspect_pipeline.py
│   │       ├── ml_utils.py
│   │       ├── train_model.py
│   │       └── model.pkl
│   │
│   ├── deepfake/
│   │   ├── node/
│   │   │   └── deepfakedetector.js
│   │   └── python/
│   │       ├── deepfake_detector.py
│   │       └── models/
│   │           └── deepfake_xception.h5
│   │
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── index.html
│
└── README.md
```

---

## 🧪 API Endpoints

### ✅ Health Check

```http
GET /api/health
```

---

### 🔗 Phishing Detection

```http
POST /api/predict-ml
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response**

```json
{
  "success": true,
  "result": {
    "prediction": "phishing",
    "confidence": 0.83
  }
}
```

---

### 🖼 Deepfake Detection

```http
POST /api/deepfake/detect
Content-Type: multipart/form-data
(file=image)
```

**Response**

```json
{
  "success": true,
  "result": {
    "result": "Deepfake",
    "prediction_score": 0.91
  }
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/phishguard.git
cd phishguard
```

---

### 2️⃣ Backend Setup (Python + Node)

#### Create Python virtual environment

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Install Node dependencies

```bash
npm install
```

---

### 3️⃣ MongoDB

Ensure MongoDB is running locally:

```txt
mongodb://localhost:27017/phishing_detector
```

Or configure in `.env`:

```env
MONGO_URI=mongodb://localhost:27017/phishing_detector
PYTHON_CMD=python
```

---

### 4️⃣ Run Backend Server

```bash
node index.js
```

Server runs on:

```
http://localhost:3001
```

---

### 5️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🧠 Models Used

### 🔗 Phishing Model

* Algorithm: Logistic Regression
* Features: URL length, dots, hyphens, digits, HTTPS, keywords
* Library: Scikit‑learn

### 🖼 Deepfake Model

* Architecture: Xception CNN
* Framework: TensorFlow / Keras
* Input size: 299×299 RGB image

---

## ⚠️ Notes

* Ensure **same sklearn version** is used for training & inference
* Deepfake model file (`.h5`) must exist in correct path
* Do not use Flask dev server in production

---

## 📌 Future Improvements

* Dockerization
* Cloud deployment
* Browser extension
* Email phishing detection

---

## 👩‍💻 Author

**Sonal Priya**
BTech (CSE) | AI & Web Development Enthusiast

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
