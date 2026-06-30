#!/usr/bin/env python3
"""Update My Highway frames: add toggle icons to list view, add grid view frame."""

import json, uuid, shutil

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def make_id():
    return uuid.uuid4().hex[:12]

# Find and update the existing MyHighway frame (list view)
for child in data["children"]:
    if child["name"] == "MyHighway":
        # Find the filter bar and add view toggle icons
        for c in child.get("children", []):
            if c.get("name") == "FilterBar":
                # Add view toggle icons to the right of tabs
                c["justifyContent"] = "space_between"
                c["children"].append(
                    {
                        "type": "frame",
                        "id": "hwViewToggle",
                        "name": "ViewToggle",
                        "fill": "transparent",
                        "gap": 4,
                        "alignItems": "center",
                        "children": [
                            {
                                "type": "frame",
                                "id": "hwListViewBtn",
                                "name": "ListViewBtn",
                                "width": 36, "height": 36,
                                "fill": "#0e1116",
                                "cornerRadius": 6,
                                "justifyContent": "center",
                                "alignItems": "center",
                                "children": [
                                    {"type": "text", "id": "hwListIcon", "name": "Icon", "fill": "#e10908", "content": "☰", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                                ]
                            },
                            {
                                "type": "frame",
                                "id": "hwGridViewBtn",
                                "name": "GridViewBtn",
                                "width": 36, "height": 36,
                                "fill": "transparent",
                                "cornerRadius": 6,
                                "justifyContent": "center",
                                "alignItems": "center",
                                "children": [
                                    {"type": "text", "id": "hwGridIcon", "name": "Icon", "fill": "#666666", "content": "⊞", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                                ]
                            }
                        ]
                    }
                )
        break

# Add Grid View frame (right column, same row as MyHighway list)
grid_frame = {
    "type": "frame",
    "id": "highwayGridRoot",
    "x": 1566,
    "y": 4994,
    "name": "MyHighway_Grid",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "vertical",
    "gap": 0,
    "children": [
        # Header (same as list view)
        {
            "type": "frame", "id": "hwgHdr", "name": "PageHeader",
            "clip": True, "width": "fill_container", "height": 80,
            "fill": "#0a0d12", "padding": [0, 30],
            "justifyContent": "space_between", "alignItems": "center",
            "children": [
                {
                    "type": "frame", "id": "hwgTitleBlock", "name": "TitleBlock",
                    "fill": "transparent", "gap": 8, "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "hwgIcon", "name": "Icon", "fill": "#e10908", "content": "✦ Highway", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "hwgTitle", "name": "Title", "fill": "#FFFFFF", "content": "My Highway", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "hwgCount", "name": "Count", "fill": "#888888", "content": "24 activities", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                },
                {
                    "type": "frame", "id": "hwgUploadBtn", "name": "UploadButton",
                    "clip": True, "width": 140, "height": 44,
                    "fill": "#e10908", "cornerRadius": 8, "gap": 8,
                    "padding": [0, 16], "justifyContent": "center", "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "hwgUploadIcon", "name": "Icon", "fill": "#FFFFFF", "content": "+", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "bold"},
                        {"type": "text", "id": "hwgUploadLabel", "name": "Label", "fill": "#FFFFFF", "content": "Upload", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                    ]
                }
            ]
        },
        # Tabs + view toggle
        {
            "type": "frame", "id": "hwgFilter", "name": "FilterBar",
            "clip": True, "width": "fill_container", "height": 50,
            "fill": "#04080b", "padding": [0, 30], "gap": 24,
            "alignItems": "center", "justifyContent": "space_between",
            "children": [
                {
                    "type": "frame", "id": "hwgTabs", "name": "Tabs",
                    "fill": "transparent", "gap": 24, "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "hwgTab1", "name": "Tab", "fill": "#e10908", "content": "All Activity", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                        {"type": "text", "id": "hwgTab2", "name": "Tab", "fill": "#888888", "content": "Photos", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                        {"type": "text", "id": "hwgTab3", "name": "Tab", "fill": "#888888", "content": "Events", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                    ]
                },
                {
                    "type": "frame",
                    "id": "hwgViewToggle",
                    "name": "ViewToggle",
                    "fill": "transparent",
                    "gap": 4,
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "frame",
                            "id": "hwgListViewBtn",
                            "name": "ListViewBtn",
                            "width": 36, "height": 36,
                            "fill": "transparent",
                            "cornerRadius": 6,
                            "justifyContent": "center",
                            "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "hwgListIcon", "name": "Icon", "fill": "#666666", "content": "☰", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                            ]
                        },
                        {
                            "type": "frame",
                            "id": "hwgGridViewBtn",
                            "name": "GridViewBtn",
                            "width": 36, "height": 36,
                            "fill": "#0e1116",
                            "cornerRadius": 6,
                            "justifyContent": "center",
                            "alignItems": "center",
                            "children": [
                                {"type": "text", "id": "hwgGridIcon", "name": "Icon", "fill": "#e10908", "content": "⊞", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
                            ]
                        }
                    ]
                }
            ]
        },
        {"type": "rectangle", "id": make_id(), "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
        # Photo grid (3 columns)
        {
            "type": "frame", "id": "hwgGrid", "name": "PhotoGrid",
            "clip": True, "width": "fill_container", "height": "fill_container",
            "fill": "#04080b", "layout": "vertical", "gap": 4, "padding": [30, 24],
            "children": [
                # Row 1
                {
                    "type": "frame", "id": "hwgRow1", "name": "GridRow",
                    "width": "fill_container", "height": 260, "fill": "transparent", "gap": 4,
                    "children": [
                        {
                            "type": "frame", "id": "hwgG1", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "Posted a photo", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 128  ✉ 16", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "hwgG2", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "Added a car", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 42  ✉ 8", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "hwgG3", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "Attended a show", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 89  ✉ 12", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                # Row 2
                {
                    "type": "frame", "id": "hwgRow2", "name": "GridRow",
                    "width": "fill_container", "height": 260, "fill": "transparent", "gap": 4,
                    "children": [
                        {
                            "type": "frame", "id": "hwgG4", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "Won Best in Show", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 312  ✉ 45", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "hwgG5", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "New mod installed", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 67  ✉ 11", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "hwgG6", "name": "GridCard",
                            "clip": True, "width": "fill_container", "height": "fill_container",
                            "fill": "#0a0d12", "cornerRadius": 10, "layout": "vertical",
                            "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Photo", "fill": "#1a1d22", "width": "fill_container", "height": 180, "cornerRadius": [10, 10, 0, 0]},
                                {
                                    "type": "frame", "id": make_id(), "name": "Info",
                                    "fill": "transparent", "width": "fill_container", "height": "fill_container",
                                    "layout": "vertical", "gap": 2, "padding": [8, 12], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": make_id(), "name": "Action", "fill": "#FFFFFF", "content": "Track day PB", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": make_id(), "name": "Stats", "fill": "#888888", "content": "♥ 203  ✉ 28", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

data["children"].append(grid_frame)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated dashboard.pen with My Highway views:")
for child in data["children"]:
    print(f"  [{child['name']}] at ({child['x']}, {child['y']})")
