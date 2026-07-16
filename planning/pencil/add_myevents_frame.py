#!/usr/bin/env python3
"""Add My Events page frame to dashboard.pen"""

import json, uuid

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def make_id():
    return uuid.uuid4().hex[:12]

# Next slot in grid: Row 6, Col 0 (below MyHighway list)
# Vertical gap from MyHighway (y=4994): 4994 + 960 + 278 = 6232
events_frame = {
    "type": "frame",
    "id": "myEventsRoot",
    "x": 0,
    "y": 6232,
    "name": "MyEvents",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "vertical",
    "gap": 0,
    "children": [
        # Header
        {
            "type": "frame", "id": "evHdr", "name": "PageHeader",
            "clip": True, "width": "fill_container", "height": 80,
            "fill": "#0a0d12", "padding": [0, 30],
            "justifyContent": "space_between", "alignItems": "center",
            "children": [
                {
                    "type": "frame", "id": "evTitleBlock", "name": "TitleBlock",
                    "fill": "transparent", "gap": 8, "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "evIcon", "name": "Icon", "fill": "#e10908", "content": "[events]", "fontFamily": "Inter", "fontSize": 26, "fontWeight": "normal"},
                        {"type": "text", "id": "evTitle", "name": "Title", "fill": "#FFFFFF", "content": "My Events", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "evCount", "name": "Count", "fill": "#888888", "content": "8 events", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                },
                {
                    "type": "frame", "id": "evCreateBtn", "name": "CreateEventBtn",
                    "clip": True, "width": 160, "height": 44,
                    "fill": "#e10908", "cornerRadius": 8, "gap": 8,
                    "padding": [0, 16], "justifyContent": "center", "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "evCreateIcon", "name": "Icon", "fill": "#FFFFFF", "content": "+", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "bold"},
                        {"type": "text", "id": "evCreateLabel", "name": "Label", "fill": "#FFFFFF", "content": "Create Event", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                }
            ]
        },
        # Tabs: Upcoming / Past / Created
        {
            "type": "frame", "id": "evTabs", "name": "FilterTabs",
            "clip": True, "width": "fill_container", "height": 50,
            "fill": "#04080b", "padding": [0, 30], "gap": 20,
            "alignItems": "center",
            "children": [
                {"type": "text", "id": "evTab1", "name": "Tab", "fill": "#e10908", "content": "Upcoming", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                {"type": "text", "id": "evTab2", "name": "Tab", "fill": "#888888", "content": "Past", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                {"type": "text", "id": "evTab3", "name": "Tab", "fill": "#888888", "content": "Created", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
            ]
        },
        {"type": "rectangle", "id": make_id(), "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
        # Event cards
        {
            "type": "frame", "id": "evList", "name": "EventList",
            "clip": True, "width": "fill_container", "height": "fill_container",
            "fill": "#04080b", "layout": "vertical", "gap": 12, "padding": [30, 24],
            "children": [
                # Event card 1
                {
                    "type": "frame", "id": "evCard1", "name": "EventCard",
                    "clip": True, "width": "fill_container", "height": 120,
                    "fill": "#0a0d12", "cornerRadius": 12, "gap": 16,
                    "padding": [0, 20], "alignItems": "center",
                    "children": [
                        # Date badge (left)
                        {
                            "type": "frame", "id": "ev1Date", "name": "DateBadge",
                            "width": 70, "height": 80, "fill": "#04080b",
                            "cornerRadius": 10, "layout": "vertical", "gap": 2,
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "ev1Month", "name": "Month", "fill": "#e10908", "content": "JUL", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "bold"},
                                {"type": "text", "id": "ev1Day", "name": "Day", "fill": "#FFFFFF", "content": "15", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "bold"}
                            ]
                        },
                        # Event info
                        {
                            "type": "frame", "id": "ev1Info", "name": "EventInfo",
                            "width": "fill_container", "fill": "transparent",
                            "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "ev1Title", "name": "Title", "fill": "#FFFFFF", "content": "SoCal JDM Meet 2026", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"},
                                {"type": "text", "id": "ev1Meta", "name": "Meta", "fill": "#888888", "content": "Los Angeles, CA  \u2022  7:00 PM  \u2022  234 attending", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame", "id": "ev1Status", "name": "StatusRow",
                                    "fill": "transparent", "gap": 8,
                                    "children": [
                                        {
                                            "type": "frame", "id": "ev1Badge", "name": "RSVPBadge",
                                            "fill": "#1a1d22", "cornerRadius": 4, "padding": [2, 8],
                                            "children": [
                                                {"type": "text", "id": "ev1BadgeTxt", "name": "Text", "fill": "#4ade80", "content": "[Going]", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                            ]
                                        },
                                        {"type": "text", "id": "ev1Cat", "name": "Category", "fill": "#e10908", "content": "JDM", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        # Arrow
                        {"type": "text", "id": "ev1Arrow", "name": "Arrow", "fill": "#555555", "content": ">", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                    ]
                },
                # Event card 2
                {
                    "type": "frame", "id": "evCard2", "name": "EventCard",
                    "clip": True, "width": "fill_container", "height": 120,
                    "fill": "#0a0d12", "cornerRadius": 12, "gap": 16,
                    "padding": [0, 20], "alignItems": "center",
                    "children": [
                        {
                            "type": "frame", "id": "ev2Date", "name": "DateBadge",
                            "width": 70, "height": 80, "fill": "#04080b",
                            "cornerRadius": 10, "layout": "vertical", "gap": 2,
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "ev2Month", "name": "Month", "fill": "#e10908", "content": "AUG", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "bold"},
                                {"type": "text", "id": "ev2Day", "name": "Day", "fill": "#FFFFFF", "content": "3", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "bold"}
                            ]
                        },
                        {
                            "type": "frame", "id": "ev2Info", "name": "EventInfo",
                            "width": "fill_container", "fill": "transparent",
                            "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "ev2Title", "name": "Title", "fill": "#FFFFFF", "content": "JDM Legends Show", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"},
                                {"type": "text", "id": "ev2Meta", "name": "Meta", "fill": "#888888", "content": "San Diego, CA  \u2022  10:00 AM  \u2022  89 attending", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame", "id": "ev2Status", "name": "StatusRow",
                                    "fill": "transparent", "gap": 8,
                                    "children": [
                                        {
                                            "type": "frame", "id": "ev2Badge", "name": "RSVPBadge",
                                            "fill": "#1a1d22", "cornerRadius": 4, "padding": [2, 8],
                                            "children": [
                                                {"type": "text", "id": "ev2BadgeTxt", "name": "Text", "fill": "#facc15", "content": "[Maybe]", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                            ]
                                        },
                                        {"type": "text", "id": "ev2Cat", "name": "Category", "fill": "#e10908", "content": "Classic", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "ev2Arrow", "name": "Arrow", "fill": "#555555", "content": "\u276f", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                    ]
                },
                # Event card 3
                {
                    "type": "frame", "id": "evCard3", "name": "EventCard",
                    "clip": True, "width": "fill_container", "height": 120,
                    "fill": "#0a0d12", "cornerRadius": 12, "gap": 16,
                    "padding": [0, 20], "alignItems": "center",
                    "children": [
                        {
                            "type": "frame", "id": "ev3Date", "name": "DateBadge",
                            "width": 70, "height": 80, "fill": "#04080b",
                            "cornerRadius": 10, "layout": "vertical", "gap": 2,
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "ev3Month", "name": "Month", "fill": "#e10908", "content": "AUG", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "bold"},
                                {"type": "text", "id": "ev3Day", "name": "Day", "fill": "#FFFFFF", "content": "22", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "bold"}
                            ]
                        },
                        {
                            "type": "frame", "id": "ev3Info", "name": "EventInfo",
                            "width": "fill_container", "fill": "transparent",
                            "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "ev3Title", "name": "Title", "fill": "#FFFFFF", "content": "Euro Night Cruise", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"},
                                {"type": "text", "id": "ev3Meta", "name": "Meta", "fill": "#888888", "content": "Santa Monica, CA  \u2022  8:00 PM  \u2022  56 attending", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame", "id": "ev3Status", "name": "StatusRow",
                                    "fill": "transparent", "gap": 8,
                                    "children": [
                                        {
                                            "type": "frame", "id": "ev3Badge", "name": "RSVPBadge",
                                            "fill": "#1a1d22", "cornerRadius": 4, "padding": [2, 8],
                                            "children": [
                                                {"type": "text", "id": "ev3BadgeTxt", "name": "Text", "fill": "#ef4444", "content": "[Declined]", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                            ]
                                        },
                                        {"type": "text", "id": "ev3Cat", "name": "Category", "fill": "#e10908", "content": "Euro", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "ev3Arrow", "name": "Arrow", "fill": "#555555", "content": "\u276f", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                    ]
                },
                # Event card 4
                {
                    "type": "frame", "id": "evCard4", "name": "EventCard",
                    "clip": True, "width": "fill_container", "height": 120,
                    "fill": "#0a0d12", "cornerRadius": 12, "gap": 16,
                    "padding": [0, 20], "alignItems": "center",
                    "children": [
                        {
                            "type": "frame", "id": "ev4Date", "name": "DateBadge",
                            "width": 70, "height": 80, "fill": "#04080b",
                            "cornerRadius": 10, "layout": "vertical", "gap": 2,
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "ev4Month", "name": "Month", "fill": "#e10908", "content": "SEP", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "bold"},
                                {"type": "text", "id": "ev4Day", "name": "Day", "fill": "#FFFFFF", "content": "12", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "bold"}
                            ]
                        },
                        {
                            "type": "frame", "id": "ev4Info", "name": "EventInfo",
                            "width": "fill_container", "fill": "transparent",
                            "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "ev4Title", "name": "Title", "fill": "#FFFFFF", "content": "Cars & Coffee Monthly", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"},
                                {"type": "text", "id": "ev4Meta", "name": "Meta", "fill": "#888888", "content": "Orange County, CA  \u2022  6:00 AM  \u2022  312 attending", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame", "id": "ev4Status", "name": "StatusRow",
                                    "fill": "transparent", "gap": 8,
                                    "children": [
                                        {
                                            "type": "frame", "id": "ev4Badge", "name": "RSVPBadge",
                                            "fill": "#1a1d22", "cornerRadius": 4, "padding": [2, 8],
                                            "children": [
                                                {"type": "text", "id": "ev4BadgeTxt", "name": "Text", "fill": "#4ade80", "content": "\u2714 Going", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                            ]
                                        },
                                        {"type": "text", "id": "ev4Cat", "name": "Category", "fill": "#e10908", "content": "Meetup", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "ev4Arrow", "name": "Arrow", "fill": "#555555", "content": "\u276f", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                    ]
                }
            ]
        }
    ]
}

data["children"].append(events_frame)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added 'MyEvents' frame to dashboard.pen")
print(f"Total frames: {len(data['children'])}")
for child in data["children"]:
    print(f"  [{child['name']}] at ({child['x']}, {child['y']})")
