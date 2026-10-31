import re
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class _DocumentParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.scripts = []

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "script" and "src" in values:
            self.scripts.append(values["src"])


class TestPublicRagRelease(unittest.TestCase):
    def test_assistant_is_structurally_valid_and_production_enabled(self):
        index = (ROOT / "index.html").read_text(encoding="utf-8")
        config = (ROOT / "public-rag-config.js").read_text(encoding="utf-8")
        parser = _DocumentParser()
        parser.feed(index)

        self.assertIn("public-rag-form", parser.ids)
        self.assertIn("public-rag-question", parser.ids)
        self.assertIn("public-rag-config.js", parser.scripts)
        self.assertIn("public-rag-chat.js", parser.scripts)
        self.assertRegex(config, r"enabled:\s*true")
        self.assertRegex(
            config,
            r"turnstileSiteKey:\s*'0x4AAAAAAFs8xwbuESAn8FgR'",
        )

    def test_client_is_bounded_and_never_contains_secrets(self):
        client = (ROOT / "public-rag-chat.js").read_text(encoding="utf-8")
        combined = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (
                ROOT / "index.html",
                ROOT / "public-rag-config.js",
                ROOT / "public-rag-chat.js",
            )
        )

        self.assertIn("https://app.dennisbasadre.com/api/public/rag/chat", client)
        self.assertIn("maximumQuestionCharacters", client)
        self.assertIn("action: 'abap_public_rag'", client)
        self.assertIn("textContent", client)
        self.assertIn("replaceChildren", client)
        self.assertIn("scrollIntoView", client)
        self.assertNotIn("innerHTML", client)
        self.assertNotRegex(combined, r"sb_secret_[A-Za-z0-9_-]{20,}")
        self.assertNotRegex(combined, r"AIza[0-9A-Za-z_-]{20,}")

    def test_security_headers_allow_only_required_external_origins(self):
        headers = (ROOT / "_headers").read_text(encoding="utf-8")
        self.assertIn("script-src 'self' https://challenges.cloudflare.com", headers)
        self.assertIn("connect-src 'self' https://app.dennisbasadre.com https://challenges.cloudflare.com", headers)
        self.assertIn("frame-src https://challenges.cloudflare.com", headers)
        self.assertNotIn("'unsafe-inline'", headers)
        self.assertNotIn("'unsafe-eval'", headers)


if __name__ == "__main__":
    unittest.main()
