# backend/ml_utils.py
import os
import pickle
from typing import Dict
import pandas as pd
import sys
import json
import traceback

# --- load model (cached) ---
_MODEL = None
def load_model():
    global _MODEL
    if _MODEL is None:
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"model.pkl not found at {model_path}")
        with open(model_path, 'rb') as f:
            _MODEL = pickle.load(f)
    return _MODEL

# --- feature extraction (must match training features) ---
def extract_features_from_url(url: str) -> Dict:
    url = str(url).lower().strip()
    features = {}
    features['length'] = len(url)
    features['count_dots'] = url.count('.')
    features['count_hyphens'] = url.count('-')
    features['count_at'] = url.count('@')
    features['count_question'] = url.count('?')
    features['has_https'] = int(url.startswith('https'))
    suspicious_tokens = ['login', 'secure', 'account', 'update', 'verify', 'bank', 'confirm']
    features['suspicious_token_count'] = sum(tok in url for tok in suspicious_tokens)
    digits = sum(c.isdigit() for c in url)
    features['digit_ratio'] = digits / max(1, len(url))
    return features

# --- main predict function used by CLI and Node ---
def predict_url(url: str) -> Dict:
    model = load_model()
    feats = extract_features_from_url(url)
    X = pd.DataFrame([feats])
    # ensure order of columns matches training - optional if you trained same keys
    try:
        pred = int(model.predict(X)[0])
        proba = None
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(X)[0]
            confidence = float(proba[pred])
        else:
            confidence = 1.0
    except Exception as e:
        raise RuntimeError(f"Model prediction failed: {e}")
    return {
        "prediction": pred,
        "confidence": confidence,
        "features": feats
    }

# --- CLI wrapper so Node (spawn) can call this script ---
if __name__ == "__main__":
    # enable unbuffered stdout for immediate print (helps debugging)
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "no url provided"}))
            sys.exit(1)
        url_arg = sys.argv[1]
        # debug: print to stderr the url received (optional, safe)
        # print(f"DEBUG: received url={url_arg}", file=sys.stderr)
        result = predict_url(url_arg)
        # add human-friendly label
        label_map = {0: "safe", 1: "phishing"}
        result["label"] = label_map.get(result.get("prediction"), str(result.get("prediction")))
        # print JSON to stdout
        print(json.dumps(result))
        sys.exit(0)
    except Exception:
        # Print full traceback to stderr so Node can log it
        traceback.print_exc(file=sys.stderr)
        # Also output an error JSON to stdout (so caller always receives something)
        print(json.dumps({"error": "internal", "details": str(traceback.format_exc())}))
        sys.exit(2)
