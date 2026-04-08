# ============================================================
#  NER MODEL CONFIGURATION
#  Replace the model IDs below with your Hugging Face model IDs
# ============================================================

MODELS = {
    "model_1": {
        "id": "Shyam-duba/distilbert-base-uncased-multidata-ner",
        "name": "DistilBERT Toponym",
        "description": "DistilBERT fine-tuned for toponym (place name) recognition on multi-domain data",
        "color": "#6C63FF",
    },
    "model_2": {
        "id": "Shyam-duba/roberta-multidata-ner",
        "name": "RoBERTa Toponym",
        "description": "RoBERTa fine-tuned for toponym (place name) recognition on multi-domain data",
        "color": "#00D4FF",
    },
    "model_3": {
        "id": "Shyam-duba/bert-multidata-ner",
        "name": "BERT Toponym",
        "description": "BERT fine-tuned for toponym (place name) recognition on multi-domain data",
        "color": "#FF6584",
    },
}

# Entity type color mapping (for frontend visualization)
ENTITY_COLORS = {
    "PER":   "#4FC3F7",   # Person - light blue
    "PERSON": "#4FC3F7",
    "ORG":   "#CE93D8",   # Organisation - purple
    "ORGANIZATION": "#CE93D8",
    "LOC":   "#80CBC4",   # Location - teal
    "LOCATION": "#80CBC4",
    "GPE":   "#A5D6A7",   # Geo-political entity - green
    "MISC":  "#FFCC80",   # Miscellaneous - orange
    "DATE":  "#F48FB1",   # Date - pink
    "TIME":  "#FFAB91",   # Time - salmon
    "MONEY": "#C8E6C9",   # Money - light green
    "PERCENT": "#B3E5FC", # Percent - pale blue
    "FACILITY": "#FFF59D",# Facility - yellow
    "PRODUCT": "#BCAAA4", # Product - brown
    "EVENT":  "#EF9A9A",  # Event - red
    "WORK_OF_ART": "#B2DFDB",
    "LAW":   "#D7CCC8",
    "LANGUAGE": "#F8BBD0",
    "QUANTITY": "#DCEDC8",
    "ORDINAL": "#FFF9C4",
    "CARDINAL": "#E1F5FE",
    "O":     "transparent",
}

# Flask config
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = True

# Max text length for processing
MAX_TEXT_LENGTH = 50000
