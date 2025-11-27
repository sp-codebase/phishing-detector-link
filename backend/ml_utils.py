# backend/ml_utils.py
import re

# Simple list of suspicious words often seen in phishing URLs
SUSPICIOUS_KEYWORDS = [
    "login", "verify", "bank", "secure", "account", "update",
    "confirm", "password", "pay", "reset", "alert"
]

def extract_features_from_url(url: str):
    """
    Take a URL string and return a dict of numeric features.
    These keys MUST match what train_model.py expects.
    """
    url = url.strip().lower()

    length = len(url)
    count_dots = url.count(".")
    count_hyphens = url.count("-")
    count_at = url.count("@")
    count_question = url.count("?")
    has_https = 1 if url.startswith("https") else 0
    suspicious_token_count = sum(1 for word in SUSPICIOUS_KEYWORDS if word in url)
    digit_ratio = (sum(c.isdigit() for c in url) / length) if length > 0 else 0

    return {
        "length": float(length),
        "count_dots": float(count_dots),
        "count_hyphens": float(count_hyphens),
        "count_at": float(count_at),
        "count_question": float(count_question),
        "has_https": float(has_https),
        "suspicious_token_count": float(suspicious_token_count),
        "digit_ratio": float(digit_ratio),
    }
