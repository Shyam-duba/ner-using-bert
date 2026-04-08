import re
import logging
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def extract_from_url(url: str) -> dict:
    """Fetch and extract clean text from a web URL."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch URL: {str(e)}", "text": ""}

    soup = BeautifulSoup(response.content, "lxml")

    # Remove scripts, styles, nav, footer
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    # Try to find main article content
    main_content = (
        soup.find("article")
        or soup.find("main")
        or soup.find(id=re.compile(r"content|article|main|body", re.I))
        or soup.find(class_=re.compile(r"content|article|main|body|post", re.I))
        or soup.body
    )

    raw_text = main_content.get_text(separator="\n") if main_content else soup.get_text(separator="\n")

    # Clean text
    lines = [line.strip() for line in raw_text.splitlines()]
    cleaned = "\n".join(line for line in lines if len(line) > 30)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()

    if not cleaned:
        return {"error": "Could not extract meaningful text from URL", "text": ""}

    return {"text": cleaned, "error": None, "source": url}


def extract_from_file(file_storage) -> dict:
    """Extract text from an uploaded file (txt, pdf, docx)."""
    filename = file_storage.filename.lower()

    try:
        if filename.endswith(".txt"):
            raw = file_storage.read()
            text = raw.decode("utf-8", errors="replace")
            return {"text": text.strip(), "error": None}

        elif filename.endswith(".pdf"):
            return _extract_pdf(file_storage)

        elif filename.endswith(".docx"):
            return _extract_docx(file_storage)

        else:
            return {"error": "Unsupported file type. Use .txt, .pdf, or .docx", "text": ""}

    except Exception as e:
        logger.error(f"File extraction error: {e}")
        return {"error": f"Failed to extract text: {str(e)}", "text": ""}


def _extract_pdf(file_storage) -> dict:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(file_storage)
        pages = []
        for page in reader.pages:
            pages.append(page.extract_text() or "")
        text = "\n\n".join(pages).strip()
        if not text:
            return {"error": "PDF appears to be empty or image-based", "text": ""}
        return {"text": text, "error": None}
    except ImportError:
        return {"error": "PyPDF2 not installed. Run: pip install PyPDF2", "text": ""}


def _extract_docx(file_storage) -> dict:
    try:
        from docx import Document
        doc = Document(file_storage)
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        text = "\n\n".join(paragraphs)
        if not text:
            return {"error": "DOCX appears to be empty", "text": ""}
        return {"text": text, "error": None}
    except ImportError:
        return {"error": "python-docx not installed. Run: pip install python-docx", "text": ""}
