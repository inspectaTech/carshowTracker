#!/usr/bin/env python3
"""Add Cost section to Create Event form in dashboard.pen"""

import json

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

for child in data["children"]:
    if child.get("name") == "CreateEvent":
        modal = child["children"][1]
        form = modal["children"][2]
        break

cost_field = {
    "type": "frame",
    "id": "ceFieldCost",
    "name": "Field",
    "fill": "transparent",
    "layout": "vertical",
    "gap": 6,
    "width": "fill_container",
    "children": [
        {"type": "text", "id": "ceLabelCost", "name": "Label", "fill": "#FFFFFF", "content": "Cost", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
        {
            "type": "frame",
            "id": "ceCostRow",
            "name": "CostRow",
            "fill": "transparent",
            "gap": 12,
            "alignItems": "center",
            "children": [
                # Free toggle (active - red)
                {
                    "type": "frame",
                    "id": "ceToggleFree",
                    "name": "Toggle",
                    "clip": True,
                    "fill": "#e10908",
                    "cornerRadius": 6,
                    "padding": [0, 16],
                    "height": 48,
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "ceToggleFreeTxt", "name": "Label", "fill": "#FFFFFF", "content": "Free", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                },
                # Paid toggle (inactive - grey)
                {
                    "type": "frame",
                    "id": "ceTogglePaid",
                    "name": "Toggle",
                    "clip": True,
                    "fill": "#1a1d22",
                    "cornerRadius": 6,
                    "padding": [0, 16],
                    "height": 48,
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "ceTogglePaidTxt", "name": "Label", "fill": "#FFFFFF", "content": "[money] Paid", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                },
                # Price input
                {
                    "type": "frame",
                    "id": "cePriceInput",
                    "name": "InputField",
                    "clip": True,
                    "width": 140,
                    "height": 48,
                    "fill": "#04080b",
                    "cornerRadius": 8,
                    "justifyContent": "center",
                    "padding": [0, 14],
                    "children": [
                        {
                            "type": "frame",
                            "id": "cePriceInner",
                            "name": "PriceInner",
                            "fill": "transparent",
                            "gap": 4,
                            "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "cePriceDollar", "name": "Dollar", "fill": "#555555", "content": "$", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "text", "id": "cePriceValue", "name": "Value", "fill": "#555555", "content": "0.00", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

# Insert between ceFieldZip (idx 4) and ceFieldDesc (idx 5)
form["children"].insert(5, cost_field)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Added Cost section with Free/Paid toggle and price input")
