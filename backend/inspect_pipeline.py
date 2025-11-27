# backend/inspect_pipeline.py
import os
import sys
import json
import pickle
import numpy as np

from ml_utils import extract_features_from_url   # ✅ use same features as training

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
_MODEL = None


def load_model():
    global _MODEL
    if _MODEL is None:
        with open(MODEL_PATH, "rb") as f:
            _MODEL = pickle.load(f)
    return _MODEL


def featurize_single(url: str):
    """
    Convert ONE url string into the same 8 numeric features used in training.
    """
    f = extract_features_from_url(url)
    vec = np.array([
        f["length"],
        f["count_dots"],
        f["count_hyphens"],
        f["count_at"],
        f["count_question"],
        f["has_https"],
        f["suspicious_token_count"],
        f["digit_ratio"],
    ], dtype=float).reshape(1, -1)
    return vec


def predict_url(url: str):
    model = load_model()
    X = featurize_single(url)

    raw_pred = model.predict(X)[0]

    # 🔥 MAP numeric class → human label
    try:
        cls = int(raw_pred)
    except Exception:
        cls = int(str(raw_pred))

    label = "phishing" if cls == 1 else "legitimate"

    confidence = 0.0
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)[0]
        classes = list(model.classes_)
        try:
            idx = classes.index(1)
            confidence = float(proba[idx])
        except ValueError:
            confidence = float(max(proba))

    return label, confidence


# ==========================
# MAIN ENTRY FOR NODE SCRIPT
# ==========================
if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else ""

    try:
        label, confidence = predict_url(url)
        result = {
            "prediction": label,
            "confidence": float(confidence),
            "error": None,
        }
    except Exception as e:
        print("FATAL predict_url error:", repr(e), file=sys.stderr)
        result = {
            "prediction": "error",
            "confidence": 0.0,
            "error": str(e),
        }

    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
