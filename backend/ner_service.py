import torch
import time
import logging
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from config import MODELS, ENTITY_COLORS, MAX_TEXT_LENGTH

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache loaded pipelines to avoid reloading
_pipelines = {}


def _get_pipeline(model_key: str):
    """Lazily load and cache NER pipeline for a given model key."""
    if model_key not in _pipelines:
        model_cfg = MODELS.get(model_key)
        if not model_cfg:
            raise ValueError(f"Unknown model key: {model_key}")

        model_id = model_cfg["id"]
        logger.info(f"Loading model: {model_id} ...")

        try:
            tokenizer = AutoTokenizer.from_pretrained(model_id)
            model = AutoModelForTokenClassification.from_pretrained(model_id)
            device = 0 if torch.cuda.is_available() else -1
            ner_pipe = pipeline(
                "ner",
                model=model,
                tokenizer=tokenizer,
                aggregation_strategy="simple",
                device=device,
            )
            _pipelines[model_key] = ner_pipe
            logger.info(f"Model {model_id} loaded successfully on {'GPU' if device == 0 else 'CPU'}.")
        except Exception as e:
            logger.error(f"Failed to load model {model_id}: {e}")
            raise

    return _pipelines[model_key]


def _chunk_text(text: str, max_tokens: int = 450) -> list[str]:
    """Split text into sentence-level chunks to handle long inputs."""
    import re
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current = ""
    for sentence in sentences:
        if len(current) + len(sentence) < max_tokens * 4:  # rough char estimate
            current += " " + sentence
        else:
            if current.strip():
                chunks.append(current.strip())
            current = sentence
    if current.strip():
        chunks.append(current.strip())
    return chunks if chunks else [text]


def run_ner(model_key: str, text: str) -> dict:
    """
    Run NER on the given text using the specified model.
    Returns a dict with entities list and timing info.
    """
    if not text or not text.strip():
        return {"error": "Empty text provided", "entities": [], "time_ms": 0}

    text = text[:MAX_TEXT_LENGTH]

    try:
        ner_pipe = _get_pipeline(model_key)
    except Exception as e:
        return {"error": str(e), "entities": [], "time_ms": 0}

    start_time = time.time()

    try:
        # Process in chunks if needed
        chunks = _chunk_text(text)
        all_entities = []
        offset = 0

        for chunk in chunks:
            results = ner_pipe(chunk)
            for ent in results:
                clean_label = ent["entity_group"].replace("B-", "").replace("I-", "").strip()
                all_entities.append({
                    "text": ent["word"].strip(),
                    "label": clean_label,
                    "start": (ent["start"] or 0) + offset,
                    "end": (ent["end"] or 0) + offset,
                    "score": round(float(ent["score"]), 4),
                    "color": ENTITY_COLORS.get(clean_label, "#AAAAAA"),
                })
            offset += len(chunk) + 1  # +1 for space between chunks

        elapsed_ms = round((time.time() - start_time) * 1000)

        # Gather summary stats
        label_counts = {}
        for ent in all_entities:
            label_counts[ent["label"]] = label_counts.get(ent["label"], 0) + 1

        avg_confidence = (
            round(sum(e["score"] for e in all_entities) / len(all_entities), 4)
            if all_entities else 0
        )

        return {
            "entities": all_entities,
            "entity_count": len(all_entities),
            "label_counts": label_counts,
            "avg_confidence": avg_confidence,
            "time_ms": elapsed_ms,
            "model_key": model_key,
            "model_name": MODELS[model_key]["name"],
            "error": None,
        }

    except Exception as e:
        logger.error(f"NER inference error for model {model_key}: {e}")
        return {
            "error": str(e),
            "entities": [],
            "entity_count": 0,
            "label_counts": {},
            "avg_confidence": 0,
            "time_ms": round((time.time() - start_time) * 1000),
            "model_key": model_key,
            "model_name": MODELS.get(model_key, {}).get("name", model_key),
        }
