from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# --------------------------------------------------
# Fix Python path so deepfake_detector can be imported
# --------------------------------------------------
BASE_DIR = os.path.dirname(__file__)
sys.path.append(BASE_DIR)

from deepfake_detector import analyze_uploaded_file

# --------------------------------------------------
# Flask App
# --------------------------------------------------
app = Flask(__name__)
CORS(app)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# --------------------------------------------------
# Fix Python path so deepfake_detector can be imported
# --------------------------------------------------
BASE_DIR = os.path.dirname(__file__)
sys.path.append(BASE_DIR)

from deepfake_detector import analyze_uploaded_file

# --------------------------------------------------
# Flask App
# --------------------------------------------------
app = Flask(__name__)
CORS(app)

@app.route("/deepfake", methods=["POST"])
@app.route("/api/deepfake/detect", methods=["POST"])
def detect_deepfake():
    file = request.files.get("file") or request.files.get("image")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        result = analyze_uploaded_file(file)
        return jsonify(result), 200
    except Exception as e:
        print("❌ Error in /deepfake route:", e)
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Run Server
# --------------------------------------------------
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )



# --------------------------------------------------
# Run Server
# --------------------------------------------------
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
