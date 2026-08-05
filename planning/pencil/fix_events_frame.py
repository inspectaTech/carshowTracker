#!/usr/bin/env python3
"""Fix the Events frame in dashboard.pen:
1. Make the 'About this event' description paragraphs word-wrap
   (add textGrowth fixed-width-height + explicit width/height).
2. Increase the Events root frame height so Category isn't clipped
   below the viewport.
"""

import json

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

events = None
for c in data["children"]:
    if c.get("id") == "eventsRoot":
        events = c
        break

if events is None:
    raise SystemExit("eventsRoot not found")

# --- 1. Grow the root frame so Category + right column are fully visible ---
events["height"] = 1620
print("eventsRoot height -> 1620")

# --- 2. Fix description paragraphs: word-wrap with fixed-width-height ---
# Left column is 920 wide; the description card has padding 20 each side,
# so inner text width = 920 - 40 = 880.
def find_by_id(node, node_id):
    if node.get("id") == node_id:
        return node
    for ch in node.get("children", []):
        r = find_by_id(ch, node_id)
        if r is not None:
            return r
    return None

for pid, lines in (("evDescP1", 4), ("evDescP2", 3), ("evDescP3", 3)):
    p = find_by_id(events, pid)
    if p is None:
        print(f"  !! {pid} not found")
        continue
    p["textGrowth"] = "fixed-width-height"
    p["width"] = 880
    p["height"] = 24 * lines  # ~24px per line
    print(f"  {pid}: wrapped, width=880 height={p['height']}")

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done.")
