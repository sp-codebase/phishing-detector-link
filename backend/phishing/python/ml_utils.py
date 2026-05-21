# backend/phishing/python/ml_utils.py

import re

# Suspicious keywords commonly found in phishing URLs
SUSPICIOUS_KEYWORDS = [
    "login", "verify", "bank", "secure", "account", "update",
    "confirm", "password", "pay", "reset", "alert"
]


def extract_features_from_url(url: str):
    """
    Extract numerical features from a URL string.
    MUST match training features exactly.
    """

    if not url:
        url = ""

    url = url.strip().lower()

    length = len(url)

    # Basic counts
    count_dots = url.count(".")
    count_hyphens = url.count("-")
    count_at = url.count("@")
    count_question = url.count("?")

    # Protocol check
    has_https = 1 if url.startswith("https") else 0

    # Suspicious keyword count
    suspicious_token_count = sum(
        1 for word in SUSPICIOUS_KEYWORDS if word in url
    )

    # Digit ratio (safe division)
    digit_count = sum(c.isdigit() for c in url)
    digit_ratio = (digit_count / length) if length > 0 else 0.0

    # 🔥 EXTRA (safe improvements, still compatible)
    count_slashes = url.count("/")
    count_equals = url.count("=")

    return {
        "length": float(length),
        "count_dots": float(count_dots),
        "count_hyphens": float(count_hyphens),
        "count_at": float(count_at),
        "count_question": float(count_question),
        "has_https": float(has_https),
        "suspicious_token_count": float(suspicious_token_count),
        "digit_ratio": float(digit_ratio),

        # Optional (ignored if model doesn't use)
        "count_slashes": float(count_slashes),
        "count_equals": float(count_equals),
    }