import hashlib
import os
from typing import Tuple

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 # 10 MB Max Limit
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".pdf", ".webp"}
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/jpg", "application/pdf", "image/webp"}

def calculate_sha256_bytes(file_bytes: bytes) -> str:
    """Calculates SHA-256 hex digest for given file byte buffer."""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_bytes)
    return sha256_hash.hexdigest()

def validate_file_metadata(filename: str, content_type: str, file_size: int) -> Tuple[bool, str]:
    """
    Validates evidence file size and allowed extension.
    Returns (is_valid, error_message).
    """
    # 1. File Size Validation
    if file_size > MAX_FILE_SIZE_BYTES:
        return False, f"File size exceeds maximum allowed limit of 10MB (Received: {(file_size / (1024*1024)):.2f}MB)"

    if file_size == 0:
        return False, "File is empty (0 Bytes)."

    # 2. Extension Validation
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"File extension '{ext}' is not allowed. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"

    return True, ""

def verify_evidence_hash_strict(file_bytes: bytes, client_supplied_hash: str) -> Tuple[bool, str, str]:
    """
    Recalculates server-side SHA-256 hash and compares with client supplied hash.
    Returns (is_match, server_hash, client_hash).
    """
    server_hash = calculate_sha256_bytes(file_bytes)
    is_match = (server_hash.lower() == client_supplied_hash.lower())
    return is_match, server_hash, client_supplied_hash
