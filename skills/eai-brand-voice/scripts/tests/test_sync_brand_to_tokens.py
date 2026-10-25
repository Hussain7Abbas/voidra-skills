"""Offline regression checks for the merged brand-token helper (stdlib only)."""
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
SCRIPT = SCRIPTS / 'sync-brand-to-tokens.cjs'
STARTER = SCRIPTS.parent / 'templates/brand-guidelines-starter.md'


@unittest.skipUnless(shutil.which('node'), 'Node is unavailable')
class BrandTokenSyncTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'docs').mkdir()
        (self.root / 'assets').mkdir()
        shutil.copy(STARTER, self.root / 'docs/brand-guidelines.md')
        self.tokens = self.root / 'assets/design-tokens.json'
        self.tokens.write_text(json.dumps({'brand': 'User Brand', 'primitive': {'color': {
            'retained': {'$value': '#123456', '$type': 'color'}}}}))

    def run_sync(self, *args):
        return subprocess.run([shutil.which('node'), str(SCRIPT), *args],
                              cwd=self.root, capture_output=True, text=True)

    def test_preserves_unrelated_tokens_and_generates_local_css(self):
        # A project-supplied generator must never be executed by this helper.
        trap = self.root / '.claude/skills/design-system/scripts/generate-tokens.cjs'
        trap.parent.mkdir(parents=True)
        trap.write_text("require('fs').writeFileSync('TRAP-RAN', 'yes')")
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        tokens = json.loads(self.tokens.read_text())
        self.assertEqual(tokens['brand'], 'User Brand')
        colors = tokens['primitive']['color']
        self.assertEqual(colors['retained']['$value'], '#123456')
        for role, color in [('primary', '#2563EB'), ('secondary', '#8B5CF6'), ('accent', '#10B981')]:
            self.assertEqual(colors[role]['500']['$value'], color)
        css = (self.root / 'assets/design-tokens.css').read_text()
        self.assertIn('--primitive-color-primary-500: #2563EB;', css)
        self.assertIn('--semantic-color-primary: var(--primitive-color-primary-500);', css)
        self.assertFalse((self.root / 'TRAP-RAN').exists())

    def test_dry_run_writes_nothing(self):
        before = self.tokens.read_bytes()
        result = self.run_sync('--dry-run')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.tokens.read_bytes(), before)
        self.assertFalse((self.root / 'assets/design-tokens.css').exists())

    def test_unsupported_css_stops_before_writing(self):
        self.tokens.write_text(json.dumps({'bad': {'$value': 'red;} body{color:blue'}}))
        before = self.tokens.read_bytes()
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.tokens.read_bytes(), before)
        self.assertFalse((self.root / 'assets/design-tokens.css').exists())

    def test_symlink_output_is_not_overwritten(self):
        victim = self.root / 'unrelated.css'
        victim.write_text('keep')
        (self.root / 'assets/design-tokens.css').symlink_to(victim)
        before = self.tokens.read_bytes()
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(victim.read_text(), 'keep')
        self.assertEqual(self.tokens.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
