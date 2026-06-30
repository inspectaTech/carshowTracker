#!/usr/bin/env python3
"""Add My Highway full page frame to dashboard.pen"""

import json, uuid

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def make_id():
    return uuid.uuid4().hex[:12]

# Grid: Row 5, Col 0 (below AddCar)
highway_frame = {
    "type": "frame",
    "id": "highwayRoot",
    "x": 0,
    "y": 4994,
    "name": "MyHighway",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "vertical",
    "gap": 0,
    "children": [
        # Header
        {
            "type": "frame", "id": "hwHdr", "name": "PageHeader",
            "clip": True, "width": "fill_container", "height": 80,
            "fill": "#0a0d12", "padding": [0, 30],
            "justifyContent": "space_between", "alignItems": "center",
            "children": [
                {
                    "type": "frame", "id": "hwTitleBlock", "name": "TitleBlock",
                    "fill": "transparent", "gap": 8, "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "hwIcon", "name": "Icon", "fill": "#e10908", "content": "\u2730 Highway", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "hwTitle", "name": "Title", "fill": "#FFFFFF", "content": "My Highway", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "hwCount", "name": "Count", "fill": "#888888", "content": "24 activities", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                },
                {
                    "type": "frame", "id": "hwUploadBtn", "name": "UploadButton",
                    "clip": True, "width": 140, "height": 44,
                    "fill": "#e10908", "cornerRadius": 8, "gap": 8,
                    "padding": [0, 16], "justifyContent": "center", "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "hwUploadIcon", "name": "Icon", "fill": "#FFFFFF", "content": "+", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "bold"},
                        {"type": "text", "id": "hwUploadLabel", "name": "Label", "fill": "#FFFFFF", "content": "Upload", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                }
            ]
        },
        # Tabs + filter
        {
            "type": "frame", "id": "hwFilter", "name": "FilterBar",
            "clip": True, "width": "fill_container", "height": 50,
            "fill": "#04080b", "padding": [0, 30], "gap": 24,
            "alignItems": "center",
            "children": [
                {"type": "text", "id": "hwTab1", "name": "Tab", "fill": "#e10908", "content": "All Activity", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                {"type": "text", "id": "hwTab2", "name": "Tab", "fill": "#888888", "content": "Photos", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                {"type": "text", "id": "hwTab3", "name": "Tab", "fill": "#888888", "content": "Events", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
            ]
        },
        {"type": "rectangle", "id": make_id(), "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
        # Activity feed
        {
            "type": "frame", "id": "hwFeed", "name": "ActivityFeed",
            "clip": True, "width": "fill_container", "height": "fill_container",
            "fill": "transparent", "layout": "vertical", "gap": 0,
            "children": [
                # Activity 1
                {
                    "type": "frame", "id": "hwAct1", "name": "ActivityItem",
                    "clip": True, "width": "fill_container", "height": 100,
                    "fill": "transparent", "gap": 16, "padding": [30, 24],
                    "alignItems": "center",
                    "children": [
                        {"type": "rectangle", "id": "hwA1Img", "name": "Photo", "fill": "#1a1d22", "width": 70, "height": 70, "cornerRadius": 8},
                        {
                            "type": "frame", "id": "hwA1Text", "name": "TextBlock",
                            "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "hwA1Act", "name": "Action", "fill": "#FFFFFF", "content": "Posted a new photo", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA1Desc", "name": "Desc", "fill": "#AAAAAA", "content": "Nissan GT-R R34 at Angeles Crest Hwy", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA1Time", "name": "Time", "fill": "#666666", "content": "2h ago", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                            ]
                        },
                        {
                            "type": "frame", "id": "hwA1Stats", "name": "Stats",
                            "fill": "transparent", "gap": 16, "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "hwA1Like", "name": "Likes", "fill": "#888888", "content": "\u2665 128", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA1Comm", "name": "Comments", "fill": "#888888", "content": "\u262d 16", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA1More", "name": "More", "fill": "#FFFFFF", "content": "\u22ef", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                            ]
                        }
                    ]
                },
                {"type": "rectangle", "id": make_id(), "name": "HR", "fill": "#333333", "width": "fill_container", "height": 1},
                # Activity 2
                {
                    "type": "frame", "id": "hwAct2", "name": "ActivityItem",
                    "clip": True, "width": "fill_container", "height": 100,
                    "fill": "transparent", "gap": 16, "padding": [30, 24],
                    "alignItems": "center",
                    "children": [
                        {"type": "rectangle", "id": "hwA2Img", "name": "Photo", "fill": "#1a1d22", "width": 70, "height": 70, "cornerRadius": 8},
                        {
                            "type": "frame", "id": "hwA2Text", "name": "TextBlock",
                            "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "hwA2Act", "name": "Action", "fill": "#FFFFFF", "content": "Added a new car", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA2Desc", "name": "Desc", "fill": "#AAAAAA", "content": "Porsche 911 GT3 added to garage", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA2Time", "name": "Time", "fill": "#666666", "content": "1d ago", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                            ]
                        },
                        {
                            "type": "frame", "id": "hwA2Stats", "name": "Stats",
                            "fill": "transparent", "gap": 16, "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "hwA2Like", "name": "Likes", "fill": "#888888", "content": "\u2665 42", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA2Comm", "name": "Comments", "fill": "#888888", "content": "\u262d 8", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA2More", "name": "More", "fill": "#FFFFFF", "content": "\u22ef", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                            ]
                        }
                    ]
                },
                {"type": "rectangle", "id": make_id(), "name": "HR", "fill": "#333333", "width": "fill_container", "height": 1},
                # Activity 3
                {
                    "type": "frame", "id": "hwAct3", "name": "ActivityItem",
                    "clip": True, "width": "fill_container", "height": 100,
                    "fill": "transparent", "gap": 16, "padding": [30, 24],
                    "alignItems": "center",
                    "children": [
                        {"type": "rectangle", "id": "hwA3Img", "name": "Photo", "fill": "#1a1d22", "width": 70, "height": 70, "cornerRadius": 8},
                        {
                            "type": "frame", "id": "hwA3Text", "name": "TextBlock",
                            "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 4, "justifyContent": "center",
                            "children": [
                                {"type": "text", "id": "hwA3Act", "name": "Action", "fill": "#FFFFFF", "content": "Attended a car show", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA3Desc", "name": "Desc", "fill": "#AAAAAA", "content": "SoCal JDM Meet 2026", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA3Time", "name": "Time", "fill": "#666666", "content": "3d ago", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                            ]
                        },
                        {
                            "type": "frame", "id": "hwA3Stats", "name": "Stats",
                            "fill": "transparent", "gap": 16, "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "hwA3Like", "name": "Likes", "fill": "#888888", "content": "\u2665 89", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA3Comm", "name": "Comments", "fill": "#888888", "content": "\u262d 12", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {"type": "text", "id": "hwA3More", "name": "More", "fill": "#FFFFFF", "content": "\u22ef", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

data["children"].append(highway_frame)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added 'MyHighway' frame to dashboard.pen")
print(f"Total frames: {len(data['children'])}")
for child in data["children"]:
    print(f"  [{child['name']}] at ({child['x']}, {child['y']})")
