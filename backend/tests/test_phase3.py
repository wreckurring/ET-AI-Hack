import unittest
import hashlib
from app.services.hash_service import (
    calculate_sha256_bytes,
    validate_file_metadata,
    verify_evidence_hash_strict
)
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token
)

class TestPhase3BackendCore(unittest.TestCase):

    def test_bcrypt_password_hashing(self):
        plain_password = "PolicePass2026!"
        hashed = get_password_hash(plain_password)
        self.assertTrue(verify_password(plain_password, hashed))
        self.assertFalse(verify_password("WrongPass", hashed))

    def test_sha256_verification_match(self):
        sample_bytes = b"CONFIDENTIAL EVIDENCE CONTENT RAKSHA NET"
        expected_hash = hashlib.sha256(sample_bytes).hexdigest()
        is_match, server_hash, _ = verify_evidence_hash_strict(sample_bytes, expected_hash)
        self.assertTrue(is_match)
        self.assertEqual(server_hash, expected_hash)

    def test_sha256_verification_mismatch_rejection(self):
        sample_bytes = b"CONFIDENTIAL EVIDENCE CONTENT RAKSHA NET"
        tampered_hash = "0000000000000000000000000000000000000000000000000000000000000000"
        is_match, _, _ = verify_evidence_hash_strict(sample_bytes, tampered_hash)
        self.assertFalse(is_match)

    def test_file_size_validation(self):
        # 15MB file size test -> should be rejected
        oversized = 15 * 1024 * 1024
        is_valid, msg = validate_file_metadata("receipt.png", "image/png", oversized)
        self.assertFalse(is_valid)
        self.assertIn("exceeds maximum allowed limit", msg)

        # 2MB file size test -> should be accepted
        valid_size = 2 * 1024 * 1024
        is_valid_valid, _ = validate_file_metadata("receipt.png", "image/png", valid_size)
        self.assertTrue(is_valid_valid)

    def test_file_extension_validation(self):
        # Disallowed .exe extension -> should be rejected
        is_valid, msg = validate_file_metadata("malware.exe", "application/octet-stream", 1024)
        self.assertFalse(is_valid)
        self.assertIn("not allowed", msg)

        # Allowed .pdf extension -> should be accepted
        is_valid_pdf, _ = validate_file_metadata("statement.pdf", "application/pdf", 1024)
        self.assertTrue(is_valid_pdf)

    def test_jwt_access_token(self):
        token = create_access_token({"sub": "INSP-8821", "role": "POLICE_OFFICER"})
        self.assertIsInstance(token, str)
        self.assertGreater(len(token), 20)

if __name__ == "__main__":
    unittest.main()
