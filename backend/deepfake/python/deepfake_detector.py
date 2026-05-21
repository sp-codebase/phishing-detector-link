import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.xception import preprocess_input

# ======================================================
# PATHS & CONSTANTS
# ======================================================

BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(
    BASE_DIR, "..", "models", "deepfake_xception.h5"
)

FACE_CASCADE_PATH = os.path.join(
    BASE_DIR, "..", "models", "haarcascade_frontalface_default.xml"
)

IMG_SIZE = 299

# ======================================================
# LOAD MODEL & FACE DETECTOR
# ======================================================

model = load_model(MODEL_PATH, compile=False)

face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
if face_cascade.empty():
    raise RuntimeError("❌ Haarcascade not loaded")

# ======================================================
# HELPER: BUILD SCHEMA CLAIM
# ======================================================

def build_claim(claim, explanation, type_, category, value):
    return {
        "claim": claim,
        "explanation": explanation,
        "type": type_,
        "user_category": category,
        "value": [value]
    }

# ======================================================
# FACE EXTRACTION
# ======================================================

def extract_face(image_bgr):
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=5,
        minSize=(80, 80)
    )

    if len(faces) == 0:
        return None

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return image_bgr[y:y+h, x:x+w]

# ======================================================
# IMAGE PREPROCESSING
# ======================================================

def preprocess_image(face_bgr):
    face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
    face_rgb = cv2.resize(face_rgb, (IMG_SIZE, IMG_SIZE))
    face_rgb = np.expand_dims(face_rgb, axis=0)
    return preprocess_input(face_rgb)

# ======================================================
# MAIN ANALYSIS FUNCTION (IMAGE ONLY)
# ======================================================

def analyze_uploaded_file(file):
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if image is None:
        return {
            "status": "failed",
            "error": "Invalid image file"
        }

    face = extract_face(image)

    # ---------------- NO FACE CASE ----------------
    if face is None:
        return {
            "status": "completed",
            "result": {
                "claim_lists": {
                    "benign": [],
                    "suspect": [],
                    "critical": [
                        build_claim(
                            "NO_FACE_DETECTED",
                            "No detectable human face found in image",
                            "Face Detection",
                            "System",
                            "No face present"
                        )
                    ]
                }
            }
        }

    # ---------------- MODEL PREDICTION ----------------
    processed = preprocess_image(face)

    # Average multiple runs for stability
    preds = []
    for _ in range(3):
        preds.append(float(model.predict(processed, verbose=0)[0][0]))

    prediction = float(np.mean(preds))

    # ---------------- SCHEMA CLAIM LOGIC ----------------
    claims = {
        "benign": [],
        "suspect": [],
        "critical": []
    }

    # High confidence AI-generated
    if prediction >= 0.85:
        claims["critical"].append(
            build_claim(
                "AI_GENERATED",
                "Face-level deepfake detection model",
                "AI-Generated Face",
                "AI System",
                f"confidence={round(prediction, 3)}"
            )
        )

    # Uncertain zone
    elif prediction >= 0.6:
        claims["suspect"].append(
            build_claim(
                "UNCERTAIN_FACE",
                "Model confidence inconclusive for face authenticity",
                "Face Analysis",
                "AI System",
                f"confidence={round(prediction, 3)}"
            )
        )

    # Likely real
    else:
        claims["benign"].append(
            build_claim(
                "REAL_FACE",
                "Face-level analysis indicates a real human face",
                "Human Face",
                "Camera Capture",
                f"confidence={round(prediction, 3)}"
            )
        )

    # ---------------- FINAL RESPONSE ----------------
    return {
        "status": "completed",
        "result": {
            "claim_lists": claims
        }
    }
