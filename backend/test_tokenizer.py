import traceback
try:
    from transformers import AutoTokenizer, AutoModelForTokenClassification
    model_id = 'Shyam-duba/distilbert-base-uncased-multidata-ner'
    print("Loading tokenizer with fast=True")
    try:
        t1 = AutoTokenizer.from_pretrained(model_id, use_fast=True)
    except Exception as e:
        print(f"Error use_fast=True: {e}")
        
    print("Loading tokenizer with fast=False")
    try:
        t2 = AutoTokenizer.from_pretrained(model_id, use_fast=False)
    except Exception as e:
        print(f"Error use_fast=False: {e}")
        traceback.print_exc()
except Exception as e:
    print("System error:", e)
