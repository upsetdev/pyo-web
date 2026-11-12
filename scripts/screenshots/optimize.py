"""Turns the raw PNG captures into the WebP files the site serves."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
out = root / "public" / "screens"
out.mkdir(parents=True, exist_ok=True)
for png in sorted((root / ".screens-raw").glob("*.png")):
    Image.open(png).convert("RGB").save(out / f"{png.stem}.webp", quality=86, method=6)
