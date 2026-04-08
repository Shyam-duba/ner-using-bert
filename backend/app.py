import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import MODELS, ENTITY_COLORS, FLASK_HOST, FLASK_PORT, FLASK_DEBUG
from ner_service import run_ner
from text_extractor import extract_from_url, extract_from_file

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# ─── Health Check ────────────────────────────────────────────
@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "models_available": list(MODELS.keys())})


# ─── Get Model Configs ───────────────────────────────────────
@app.get("/api/models")
def get_models():
    models_info = []
    for key, cfg in MODELS.items():
        models_info.append({
            "key": key,
            "id": cfg["id"],
            "name": cfg["name"],
            "description": cfg["description"],
            "color": cfg["color"],
        })
    return jsonify({"models": models_info, "entity_colors": ENTITY_COLORS})


# ─── Extract Text from URL or File ───────────────────────────
@app.post("/api/extract-text")
def extract_text():
    # URL extraction
    if request.is_json:
        data = request.get_json()
        url = data.get("url", "").strip()
        if not url:
            return jsonify({"error": "No URL provided"}), 400
        result = extract_from_url(url)
        if result.get("error"):
            return jsonify(result), 422
        return jsonify(result)

    # File extraction
    if "file" in request.files:
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        result = extract_from_file(file)
        if result.get("error"):
            return jsonify(result), 422
        return jsonify(result)

    return jsonify({"error": "Send JSON with 'url' or multipart form with 'file'"}), 400


# ─── NER Analysis ────────────────────────────────────────────
@app.post("/api/analyze")
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    text = data.get("text", "").strip()
    model_keys = data.get("models", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if not model_keys:
        return jsonify({"error": "No models selected"}), 400

    # Validate model keys
    invalid = [k for k in model_keys if k not in MODELS]
    if invalid:
        return jsonify({"error": f"Unknown model key(s): {invalid}"}), 400

    results = {}
    for key in model_keys:
        logger.info(f"Running NER with model: {key}")
        results[key] = run_ner(key, text)

    return jsonify({
        "text": text,
        "results": results,
        "models_used": model_keys,
    })


# ─── Error handlers ───────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    logger.info(f"Starting NER API on http://{FLASK_HOST}:{FLASK_PORT}")
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
