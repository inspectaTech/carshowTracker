#!/usr/bin/env python3
"""Bump the version stamp in a .pen file (forces a real content change so
Pencil's reload prompt always fires).

Usage:
    python bump_version.py [path/to/file.pen]

Behavior:
  - Finds the root frame named "version" (or a text node matching V#.#.#).
  - Increments the patch number (V1.20.3 -> V1.20.4).
  - Adds/updates a readable timestamp below at HALF the version font size.
  - Writes the file back.

Run this AFTER every .pen edit so the on-disk content differs from the
editor's in-memory content (the reload prompt is gated on a real,
non-whitespace change).
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path

DEFAULT = Path(__file__).resolve().parent / "dashboard.pen"


def find_version_frame(node, parent=None):
    """Return (parent_frame, version_text_node) for the version stamp."""
    is_text = node.get("type") == "text"
    content = str(node.get("content") or "")

    if is_text and re.fullmatch(r"V\d+\.\d+\.\d+", content):
        return parent, node

    for ch in node.get("children", []):
        r = find_version_frame(ch, node)
        if r[0] is not None or r[1] is not None:
            return r
    return None, None


def bump(path: Path):
    data = json.load(open(path, encoding="utf-8"))
    frame, text_node = find_version_frame(data)
    if text_node is None:
        raise SystemExit(
            f"No version stamp (V#.#.#) found in {path.name}. "
            "Create a frame named 'version' with a text node like 'V1.20.3' first."
        )

    # Increment patch
    match = re.fullmatch(r"V(\d+)\.(\d+)\.(\d+)", text_node["content"])
    major, minor, patch = (int(x) for x in match.groups())
    new_version = f"V{major}.{minor}.{patch + 1}"
    text_node["content"] = new_version

    # Timestamp below at half the font size
    version_size = int(text_node.get("fontSize", 40))
    stamp_size = max(10, version_size // 2)
    stamp_text = datetime.now().strftime("%Y-%m-%d %H:%M")

    if frame is None:
        raise SystemExit("Version text node is not inside a frame — cannot attach a stamp.")

    # find existing timestamp child (name "Stamp" or "Timestamp")
    stamp_node = None
    for ch in frame.get("children", []):
        if (ch.get("name") or "").lower() in ("stamp", "timestamp", "date"):
            stamp_node = ch
            break

    if stamp_node is None:
        # Create it below the version text (version at ~y=23, put stamp at ~y=78)
        stamp_node = {
            "type": "text",
            "name": "Stamp",
            "x": 38,
            "y": 78,
            "fill": "#888888",
            "textGrowth": "fixed-width-height",
            "width": 306,
            "height": stamp_size + 20,
            "content": stamp_text,
            "textAlign": "center",
            "textAlignVertical": "middle",
            "fontFamily": "Inter",
            "fontSize": stamp_size,
            "fontWeight": "normal",
        }
        frame["children"].append(stamp_node)
    else:
        stamp_node["content"] = stamp_text
        stamp_node["fontSize"] = stamp_size

    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{path.name}: {text_node['content']}  ({stamp_text})")


if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    bump(target)
