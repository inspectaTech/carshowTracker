#!/usr/bin/env python3
"""Add Create Event modal frame to dashboard.pen"""

import json

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Place in 3rd column below MyEvents (3139, 2520 -> 3139, 3780)
create_event_frame = {
    "type": "frame",
    "id": "createEventRoot",
    "x": 3139,
    "y": 3780,
    "name": "CreateEvent",
    "clip": True,
    "width": 1440,
    "height": 1271,
    "fill": "#04080b",
    "layout": "none",
    "children": [
        # Semi-transparent overlay
        {
            "type": "rectangle",
            "id": "ceOverlay",
            "name": "Overlay",
            "x": 0,
            "y": 0,
            "width": 1440,
            "height": 1271,
            "fill": "#00000080"
        },
        # Modal card
        {
            "type": "frame",
            "id": "ceModal",
            "name": "CreateEventModal",
            "layoutPosition": "absolute",
            "x": 370,
            "y": 20,
            "clip": True,
            "width": 700,
            "height": 940,
            "fill": "#0a0d12",
            "cornerRadius": 16,
            "layout": "vertical",
            "children": [
                # Header
                {
                    "type": "frame",
                    "id": "ceHdr",
                    "name": "ModalHeader",
                    "clip": True,
                    "width": "fill_container",
                    "height": 60,
                    "fill": "transparent",
                    "padding": [0, 20],
                    "justifyContent": "space_between",
                    "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "ceHdrTitle", "name": "Title", "fill": "#FFFFFF", "content": "Create Event", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"},
                        {"type": "text", "id": "ceHdrClose", "name": "Close", "fill": "#888888", "content": "X", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"}
                    ]
                },
                # Divider
                {"type": "rectangle", "id": "ceDiv1", "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
                # Form area
                {
                    "type": "frame",
                    "id": "ceForm",
                    "name": "FormArea",
                    "clip": True,
                    "width": "fill_container",
                    "height": "fill_container",
                    "fill": "transparent",
                    "layout": "vertical",
                    "gap": 16,
                    "padding": 24,
                    "children": [
                        # Photo area
                        {
                            "type": "frame",
                            "id": "cePhotoArea",
                            "name": "PhotoArea",
                            "clip": True,
                            "width": "fill_container",
                            "height": 140,
                            "fill": "#04080b",
                            "cornerRadius": 10,
                            "stroke": "#333333",
                            "strokeWidth": 1,
                            "justifyContent": "center",
                            "alignItems": "center",
                            "children": [
                                {
                                    "type": "frame",
                                    "id": "cePhotoInner",
                                    "name": "PhotoInner",
                                    "fill": "transparent",
                                    "layout": "vertical",
                                    "gap": 6,
                                    "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "cePhotoIcon", "name": "Icon", "fill": "#555555", "content": "[image]", "fontFamily": "Inter", "fontSize": 32, "fontWeight": "normal"},
                                        {"type": "text", "id": "cePhotoLabel", "name": "Label", "fill": "#555555", "content": "Add event photo (optional)", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        # Event title field
                        {
                            "type": "frame",
                            "id": "ceFieldTitle",
                            "name": "Field",
                            "fill": "transparent",
                            "layout": "vertical",
                            "gap": 6,
                            "width": "fill_container",
                            "children": [
                                {"type": "text", "id": "ceLabelTitle", "name": "Label", "fill": "#FFFFFF", "content": "Event Title", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame",
                                    "id": "ceInputTitle",
                                    "name": "InputField",
                                    "clip": True,
                                    "width": "fill_container",
                                    "height": 48,
                                    "fill": "#04080b",
                                    "cornerRadius": 8,
                                    "justifyContent": "center",
                                    "padding": [0, 14],
                                    "children": [
                                        {"type": "text", "id": "ceInputTitleVal", "name": "Value", "fill": "#555555", "content": "Enter event name...", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        # Row: Date + Start Time + End Time
                        {
                            "type": "frame",
                            "id": "ceRow1",
                            "name": "FormRow",
                            "fill": "transparent",
                            "gap": 16,
                            "width": "fill_container",
                            "children": [
                                {
                                    "type": "frame",
                                    "id": "ceFieldDate",
                                    "name": "Field",
                                    "fill": "transparent",
                                    "layout": "vertical",
                                    "gap": 6,
                                    "width": 240,
                                    "children": [
                                        {"type": "text", "id": "ceLabelDate", "name": "Label", "fill": "#FFFFFF", "content": "Date", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {
                                            "type": "frame",
                                            "id": "ceInputDate",
                                            "name": "InputField",
                                            "clip": True,
                                            "width": "fill_container",
                                            "height": 48,
                                            "fill": "#04080b",
                                            "cornerRadius": 8,
                                            "justifyContent": "center",
                                            "padding": [0, 14],
                                            "children": [
                                                {"type": "text", "id": "ceInputDateVal", "name": "Value", "fill": "#FFFFFF", "content": "Sat, Jul 25, 2026", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "frame",
                                    "id": "ceFieldStartTime",
                                    "name": "Field",
                                    "fill": "transparent",
                                    "layout": "vertical",
                                    "gap": 6,
                                    "width": 190,
                                    "children": [
                                        {"type": "text", "id": "ceLabelStartTime", "name": "Label", "fill": "#FFFFFF", "content": "Start Time", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {
                                            "type": "frame",
                                            "id": "ceInputStartTime",
                                            "name": "InputField",
                                            "clip": True,
                                            "width": "fill_container",
                                            "height": 48,
                                            "fill": "#04080b",
                                            "cornerRadius": 8,
                                            "justifyContent": "center",
                                            "padding": [0, 14],
                                            "children": [
                                                {"type": "text", "id": "ceInputStartTimeVal", "name": "Value", "fill": "#FFFFFF", "content": "7:00 PM", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "frame",
                                    "id": "ceFieldEndTime",
                                    "name": "Field",
                                    "fill": "transparent",
                                    "layout": "vertical",
                                    "gap": 6,
                                    "width": 190,
                                    "children": [
                                        {"type": "text", "id": "ceLabelEndTime", "name": "Label", "fill": "#FFFFFF", "content": "End Time", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {
                                            "type": "frame",
                                            "id": "ceInputEndTime",
                                            "name": "InputField",
                                            "clip": True,
                                            "width": "fill_container",
                                            "height": 48,
                                            "fill": "#04080b",
                                            "cornerRadius": 8,
                                            "justifyContent": "center",
                                            "padding": [0, 14],
                                            "children": [
                                                {"type": "text", "id": "ceInputEndTimeVal", "name": "Value", "fill": "#FFFFFF", "content": "10:00 PM", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        # Location field
                        {
                            "type": "frame",
                            "id": "ceFieldLoc",
                            "name": "Field",
                            "fill": "transparent",
                            "layout": "vertical",
                            "gap": 6,
                            "width": "fill_container",
                            "children": [
                                {"type": "text", "id": "ceLabelLoc", "name": "Label", "fill": "#FFFFFF", "content": "Location", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame",
                                    "id": "ceInputLoc",
                                    "name": "InputField",
                                    "clip": True,
                                    "width": "fill_container",
                                    "height": 48,
                                    "fill": "#04080b",
                                    "cornerRadius": 8,
                                    "justifyContent": "center",
                                    "padding": [0, 14],
                                    "children": [
                                        {"type": "text", "id": "ceInputLocVal", "name": "Value", "fill": "#FFFFFF", "content": "Los Angeles Convention Center, CA", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        # Zip Code
                        {
                            "type": "frame",
                            "id": "ceFieldZip",
                            "name": "Field",
                            "fill": "transparent",
                            "layout": "vertical",
                            "gap": 6,
                            "width": 200,
                            "children": [
                                {"type": "text", "id": "ceLabelZip", "name": "Label", "fill": "#FFFFFF", "content": "Zip Code", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame",
                                    "id": "ceInputZip",
                                    "name": "InputField",
                                    "clip": True,
                                    "width": "fill_container",
                                    "height": 48,
                                    "fill": "#04080b",
                                    "cornerRadius": 8,
                                    "justifyContent": "center",
                                    "padding": [0, 14],
                                    "children": [
                                        {"type": "text", "id": "ceInputZipVal", "name": "Value", "fill": "#555555", "content": "90001", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        # Cost section with Free/Paid toggle
                        {
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
                                                {"type": "text", "id": "ceTogglePaidTxt", "name": "Label", "fill": "#FFFFFF", "content": "Paid", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                            ]
                                        },
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
                        },
                        # Description textarea
                        {
                            "type": "frame",
                            "id": "ceFieldDesc",
                            "name": "Field",
                            "fill": "transparent",
                            "layout": "vertical",
                            "gap": 6,
                            "width": "fill_container",
                            "children": [
                                {"type": "text", "id": "ceLabelDesc", "name": "Label", "fill": "#FFFFFF", "content": "Description", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame",
                                    "id": "ceInputDesc",
                                    "name": "InputTextArea",
                                    "clip": True,
                                    "width": "fill_container",
                                    "height": 80,
                                    "fill": "#04080b",
                                    "cornerRadius": 8,
                                    "padding": [12, 14],
                                    "children": [
                                        {
                                            "type": "text",
                                            "id": "ceInputDescVal",
                                            "name": "Value",
                                            "fill": "#555555",
                                            "content": "Describe your event...",
                                            "fontFamily": "Inter",
                                            "fontSize": 14,
                                            "fontWeight": "normal",
                                            "textGrowth": "fixed-width-height",
                                            "width": 620,
                                            "height": 56
                                        }
                                    ]
                                }
                            ]
                        },
                        # Category tags
                        {
                            "type": "frame",
                            "id": "ceFieldCat",
                            "name": "Field",
                            "fill": "transparent",
                            "layout": "vertical",
                            "gap": 6,
                            "width": "fill_container",
                            "children": [
                                {"type": "text", "id": "ceLabelCat", "name": "Label", "fill": "#FFFFFF", "content": "Category", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                {
                                    "type": "frame",
                                    "id": "ceTagRow",
                                    "name": "TagRow",
                                    "fill": "transparent",
                                    "gap": 10,
                                    "alignItems": "center",
                                    "children": [
                                        {
                                            "type": "frame",
                                            "id": "ceTag1",
                                            "name": "Tag",
                                            "clip": True,
                                            "fill": "#e10908",
                                            "cornerRadius": 6,
                                            "padding": [6, 14],
                                            "height": 36,
                                            "justifyContent": "center",
                                            "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "ceTag1Txt", "name": "Label", "fill": "#FFFFFF", "content": "Meetup", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                            ]
                                        },
                                        {
                                            "type": "frame",
                                            "id": "ceTag2",
                                            "name": "Tag",
                                            "clip": True,
                                            "fill": "#1a1d22",
                                            "cornerRadius": 6,
                                            "padding": [6, 14],
                                            "height": 36,
                                            "justifyContent": "center",
                                            "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "ceTag2Txt", "name": "Label", "fill": "#FFFFFF", "content": "JDM", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                            ]
                                        },
                                        {
                                            "type": "frame",
                                            "id": "ceTag3",
                                            "name": "Tag",
                                            "clip": True,
                                            "fill": "#1a1d22",
                                            "cornerRadius": 6,
                                            "padding": [6, 14],
                                            "height": 36,
                                            "justifyContent": "center",
                                            "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "ceTag3Txt", "name": "Label", "fill": "#FFFFFF", "content": "Classic", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                            ]
                                        },
                                        {
                                            "type": "frame",
                                            "id": "ceTag4",
                                            "name": "Tag",
                                            "clip": True,
                                            "fill": "#1a1d22",
                                            "cornerRadius": 6,
                                            "padding": [6, 14],
                                            "height": 36,
                                            "justifyContent": "center",
                                            "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "ceTag4Txt", "name": "Label", "fill": "#FFFFFF", "content": "Euro", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                            ]
                                        },
                                        {
                                            "type": "frame",
                                            "id": "ceTag5",
                                            "name": "Tag",
                                            "clip": True,
                                            "fill": "#1a1d22",
                                            "cornerRadius": 6,
                                            "padding": [6, 14],
                                            "height": 36,
                                            "justifyContent": "center",
                                            "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "ceTag5Txt", "name": "Label", "fill": "#FFFFFF", "content": "Import", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        # Spacer
                        {
                            "type": "frame",
                            "id": "ceSpacer",
                            "name": "Spacer",
                            "fill": "transparent",
                            "width": "fill_container",
                            "height": "fill_container"
                        },
                        # Button row
                        {
                            "type": "frame",
                            "id": "ceBtnRow",
                            "name": "ButtonRow",
                            "fill": "transparent",
                            "gap": 12,
                            "width": "fill_container",
                            "children": [
                                {
                                    "type": "frame",
                                    "id": "ceCancelBtn",
                                    "name": "CancelBtn",
                                    "clip": True,
                                    "width": 120,
                                    "height": 44,
                                    "fill": "transparent",
                                    "cornerRadius": 8,
                                    "stroke": "#333333",
                                    "strokeWidth": 1,
                                    "justifyContent": "center",
                                    "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "ceCancelLabel", "name": "Label", "fill": "#FFFFFF", "content": "Cancel", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                },
                                {
                                    "type": "frame",
                                    "id": "ceCreateBtn",
                                    "name": "CreateBtn",
                                    "clip": True,
                                    "width": 160,
                                    "height": 44,
                                    "fill": "#e10908",
                                    "cornerRadius": 8,
                                    "justifyContent": "center",
                                    "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "ceCreateLabel", "name": "Label", "fill": "#FFFFFF", "content": "Create Event", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
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

data["children"].append(create_event_frame)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added 'CreateEvent' frame to dashboard.pen")
print(f"Total frames: {len(data['children'])}")
for c in data["children"]:
    print(f"  [{c['name']}] at ({c['x']}, {c['y']})")
