#!/usr/bin/env python3
"""Add Settings, AddCar, and UploadPhoto frames to dashboard.pen"""

import json, uuid

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def make_id():
    return uuid.uuid4().hex[:12]

# ============= SETTINGS PAGE =============
settings_frame = {
    "type": "frame",
    "id": "settingsRoot",
    "x": 1460,
    "y": 2040,
    "name": "Settings",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "vertical",
    "gap": 0,
    "children": [
        {
            "type": "frame", "id": "stHdr", "name": "PageHeader",
            "clip": True, "width": "fill_container", "height": 80,
            "fill": "#0a0d12", "padding": [0, 30],
            "justifyContent": "space_between", "alignItems": "center",
            "children": [
                {
                    "type": "frame", "id": "stTitleBlock", "name": "TitleBlock",
                    "fill": "transparent", "gap": 8, "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "stIcon", "name": "Icon", "fill": "#e10908", "content": "\u2699\ufe0f", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"},
                        {"type": "text", "id": "stTitle", "name": "Title", "fill": "#FFFFFF", "content": "Settings", "fontFamily": "Inter", "fontSize": 28, "fontWeight": "normal"}
                    ]
                }
            ]
        },
        {
            "type": "frame", "id": "stContent", "name": "Content",
            "clip": True, "width": "fill_container", "height": "fill_container",
            "fill": "transparent", "gap": 0, "layout": "none",
            "children": [
                {
                    "type": "frame", "id": "stNav", "name": "SettingsNav",
                    "x": 0, "y": 0,
                    "width": 280, "height": 880,
                    "fill": "#0a0d12", "layout": "vertical", "gap": 0, "padding": [8, 0],
                    "children": [
                        {"type": "frame", "id": "stNav1", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "#0e1116", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav1Icon", "name": "Icon", "fill": "#e10908", "content": "[profile]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav1Label", "name": "Label", "fill": "#FFFFFF", "content": "Profile", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]},
                        {"type": "frame", "id": "stNav2", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "transparent", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav2Icon", "name": "Icon", "fill": "#888888", "content": "[bell]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav2Label", "name": "Label", "fill": "#888888", "content": "Notifications", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]},
                        {"type": "frame", "id": "stNav3", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "transparent", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav3Icon", "name": "Icon", "fill": "#888888", "content": "[lock]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav3Label", "name": "Label", "fill": "#888888", "content": "Privacy", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]},
                        {"type": "frame", "id": "stNav4", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "transparent", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav4Icon", "name": "Icon", "fill": "#888888", "content": "[pin]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav4Label", "name": "Label", "fill": "#888888", "content": "Home Location", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]},
                        {"type": "frame", "id": "stNav5", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "transparent", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav5Icon", "name": "Icon", "fill": "#888888", "content": "[palette]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav5Label", "name": "Label", "fill": "#888888", "content": "Theme", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]},
                        {"type": "frame", "id": "stNav6", "name": "NavItem", "clip": True, "width": "fill_container", "height": 48, "fill": "transparent", "padding": [0, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNav6Icon", "name": "Icon", "fill": "#888888", "content": "[link]", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                            {"type": "text", "id": "stNav6Label", "name": "Label", "fill": "#888888", "content": "Connected Accounts", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                        ]}
                    ]
                },
                {
                    "type": "frame", "id": "stPanel", "name": "SettingsPanel",
                    "x": 300, "y": 0,
                    "width": 1100, "height": 880,
                    "fill": "transparent", "layout": "vertical", "gap": 24, "padding": [30, 30],
                    "children": [
                        {"type": "text", "id": "stPanelTitle", "name": "PanelTitle", "fill": "#FFFFFF", "content": "Profile Settings", "fontFamily": "Inter", "fontSize": 24, "fontWeight": "normal"},
                        {"type": "frame", "id": "stThemeRow", "name": "ThemeRow",
                            "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 10,
                            "padding": [16, 20], "alignItems": "center", "gap": 12,
                            "children": [
                                {"type": "text", "id": "stThemeLabel", "name": "Label", "fill": "#FFFFFF", "content": "[moon] Dark Mode", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "frame", "id": "stThemeSpacer", "name": "Spacer", "width": "fill_container", "height": 1, "fill": "transparent"},
                                {"type": "frame", "id": "stToggle", "name": "ToggleSwitch",
                                    "width": 52, "height": 28, "fill": "#e10908", "cornerRadius": 14,
                                    "justifyContent": "flex_end", "alignItems": "center", "padding": [0, 4],
                                    "children": [
                                        {"type": "rectangle", "id": make_id(), "name": "ToggleDot", "fill": "#FFFFFF", "width": 22, "height": 22, "cornerRadius": 11}
                                    ]
                                }
                            ]
                        },
                        {"type": "frame", "id": "stLocRow", "name": "LocationRow",
                            "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 10,
                            "padding": [16, 20], "alignItems": "center", "gap": 12,
                            "children": [
                                {"type": "text", "id": "stLocLabel", "name": "Label", "fill": "#FFFFFF", "content": "[pin] Home Location", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                                {"type": "frame", "id": "stLocSpacer", "name": "Spacer", "width": "fill_container", "height": 1, "fill": "transparent"},
                                {"type": "frame", "id": "stLocValue", "name": "LocationValue",
                                    "width": 200, "height": 40, "fill": "#04080b", "cornerRadius": 8,
                                    "padding": [0, 14], "justifyContent": "center",
                                    "children": [
                                        {"type": "text", "id": "stLocText", "name": "Text", "fill": "#FFFFFF", "content": "Los Angeles, CA", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                    ]
                                },
                                {"type": "frame", "id": "stLocChange", "name": "ChangeBtn",
                                    "width": 80, "height": 36, "fill": "#04080b", "cornerRadius": 6,
                                    "stroke": "#333333", "strokeWidth": 1, "justifyContent": "center", "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "stLocChangeLabel", "name": "Label", "fill": "#888888", "content": "Change", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "stNotifTitle", "name": "SectionTitle", "fill": "#FFFFFF", "content": "Notification Preferences", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "normal"},
                        {"type": "frame", "id": "stNotif1", "name": "NotifRow", "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 10, "padding": [14, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNotif1Label", "name": "Label", "fill": "#FFFFFF", "content": "Event reminders", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                            {"type": "frame", "id": "stNotif1Spacer", "name": "Spacer", "width": "fill_container", "height": 1, "fill": "transparent"},
                            {"type": "frame", "id": "stNotif1Toggle", "name": "Toggle", "width": 44, "height": 24, "fill": "#e10908", "cornerRadius": 12, "justifyContent": "flex_end", "alignItems": "center", "padding": [0, 3], "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Dot", "fill": "#FFFFFF", "width": 18, "height": 18, "cornerRadius": 9}
                            ]}
                        ]},
                        {"type": "frame", "id": "stNotif2", "name": "NotifRow", "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 10, "padding": [14, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNotif2Label", "name": "Label", "fill": "#FFFFFF", "content": "New followers", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                            {"type": "frame", "id": "stNotif2Spacer", "name": "Spacer", "width": "fill_container", "height": 1, "fill": "transparent"},
                            {"type": "frame", "id": "stNotif2Toggle", "name": "Toggle", "width": 44, "height": 24, "fill": "#333333", "cornerRadius": 12, "justifyContent": "flex_start", "alignItems": "center", "padding": [0, 3], "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Dot", "fill": "#888888", "width": 18, "height": 18, "cornerRadius": 9}
                            ]}
                        ]},
                        {"type": "frame", "id": "stNotif3", "name": "NotifRow", "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 10, "padding": [14, 20], "alignItems": "center", "children": [
                            {"type": "text", "id": "stNotif3Label", "name": "Label", "fill": "#FFFFFF", "content": "Car show updates", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"},
                            {"type": "frame", "id": "stNotif3Spacer", "name": "Spacer", "width": "fill_container", "height": 1, "fill": "transparent"},
                            {"type": "frame", "id": "stNotif3Toggle", "name": "Toggle", "width": 44, "height": 24, "fill": "#e10908", "cornerRadius": 12, "justifyContent": "flex_end", "alignItems": "center", "padding": [0, 3], "children": [
                                {"type": "rectangle", "id": make_id(), "name": "Dot", "fill": "#FFFFFF", "width": 18, "height": 18, "cornerRadius": 9}
                            ]}
                        ]}
                    ]
                }
            ]
        }
    ]
}

data["children"].append(settings_frame)

# ============= ADD/EDIT CAR MODAL =============
addcar_frame = {
    "type": "frame",
    "id": "addCarRoot",
    "x": 0,
    "y": 3060,
    "name": "AddCar",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "none",
    "children": [
        {"type": "rectangle", "id": make_id(), "name": "Overlay", "fill": "#00000080", "width": 1440, "height": 960, "x": 0, "y": 0},
        {
            "type": "frame", "id": "acModal", "layoutPosition": "absolute",
            "x": 370, "y": 40, "name": "AddCarModal",
            "clip": True, "width": 700, "height": 880,
            "fill": "#0a0d12", "cornerRadius": 16, "layout": "vertical", "gap": 0,
            "children": [
                {
                    "type": "frame", "id": "acHdr", "name": "ModalHeader",
                    "clip": True, "width": "fill_container", "height": 60,
                    "fill": "transparent", "padding": [0, 20],
                    "justifyContent": "space_between", "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "acHdrTitle", "name": "Title", "fill": "#FFFFFF", "content": "Add Vehicle", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"},
                        {"type": "text", "id": "acHdrClose", "name": "Close", "fill": "#888888", "content": "\u2715", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"}
                    ]
                },
                {"type": "rectangle", "id": make_id(), "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
                {
                    "type": "frame", "id": "acForm", "name": "FormArea",
                    "clip": True, "width": "fill_container", "height": "fill_container",
                    "fill": "transparent", "layout": "vertical", "gap": 16, "padding": [24, 24],
                    "children": [
                        {
                            "type": "frame", "id": "acPhotoArea", "name": "PhotoArea",
                            "width": "fill_container", "height": 140, "fill": "#04080b",
                            "cornerRadius": 10, "stroke": "#333333", "strokeWidth": 1, "strokeStyle": "dashed",
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {
                                    "type": "frame", "id": "acPhotoInner", "name": "PhotoInner",
                                    "fill": "transparent", "layout": "vertical", "gap": 6, "alignItems": "center",
                                    "children": [
                                        {"type": "icon", "id": "acPhotoIcon", "name": "Icon", "width": 32, "height": 32, "icon": "image-plus", "library": "lucide", "fill": "#555555"},
                                        {"type": "text", "id": "acPhotoText", "name": "Text", "fill": "#555555", "content": "Tap to upload car photo", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "text", "id": "acPhotoSub", "name": "Subtext", "fill": "#444444", "content": "PNG, JPG up to 10MB", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "acRow1", "name": "FormRow",
                            "width": "fill_container", "fill": "transparent", "gap": 16,
                            "children": [
                                {
                                    "type": "frame", "id": "acField1", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel1", "name": "Label", "fill": "#FFFFFF", "content": "Make", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput1", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput1Val", "name": "Value", "fill": "#555555", "content": "Select make \u25be", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                },
                                {
                                    "type": "frame", "id": "acField2", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel2", "name": "Label", "fill": "#FFFFFF", "content": "Model", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput2", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput2Val", "name": "Value", "fill": "#555555", "content": "Enter model", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "acRow2", "name": "FormRow",
                            "width": "fill_container", "fill": "transparent", "gap": 16,
                            "children": [
                                {
                                    "type": "frame", "id": "acField3", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel3", "name": "Label", "fill": "#FFFFFF", "content": "Year", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput3", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput3Val", "name": "Value", "fill": "#555555", "content": "Select year \u25be", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                },
                                {
                                    "type": "frame", "id": "acField4", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel4", "name": "Label", "fill": "#FFFFFF", "content": "Horsepower", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput4", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput4Val", "name": "Value", "fill": "#555555", "content": "Enter HP", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "frame", "id": "acRow3", "name": "FormRow",
                            "width": "fill_container", "fill": "transparent", "gap": 16,
                            "children": [
                                {
                                    "type": "frame", "id": "acField5", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel5", "name": "Label", "fill": "#FFFFFF", "content": "Drivetrain", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput5", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput5Val", "name": "Value", "fill": "#555555", "content": "Select drivetrain \u25be", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                },
                                {
                                    "type": "frame", "id": "acField6", "name": "Field", "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 6,
                                    "children": [
                                        {"type": "text", "id": "acLabel6", "name": "Label", "fill": "#FFFFFF", "content": "Color", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "acInput6", "name": "Input", "clip": True, "width": "fill_container", "height": 48, "fill": "#04080b", "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center", "children": [
                                            {"type": "text", "id": "acInput6Val", "name": "Value", "fill": "#555555", "content": "Enter color", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                        ]}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "acLabel7", "name": "Label", "fill": "#FFFFFF", "content": "Modifications / Notes", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                        {
                            "type": "frame", "id": "acInput7", "name": "InputTextArea",
                            "clip": True, "width": "fill_container", "height": 80, "fill": "#04080b",
                            "cornerRadius": 8, "padding": [12, 14],
                            "children": [
                                {"type": "text", "id": "acInput7Val", "name": "Value", "fill": "#555555", "content": "List any modifications...", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}
                            ]
                        },
                        {"type": "frame", "id": make_id(), "name": "Spacer", "width": "fill_container", "height": "fill_container", "fill": "transparent"},
                        {
                            "type": "frame", "id": "acBtnRow", "name": "ButtonRow",
                            "width": "fill_container", "fill": "transparent", "gap": 12, "justifyContent": "flex_end",
                            "children": [
                                {"type": "frame", "id": "acCancelBtn", "name": "CancelBtn",
                                    "clip": True, "width": 120, "height": 44, "fill": "transparent",
                                    "stroke": "#333333", "strokeWidth": 1, "cornerRadius": 8,
                                    "justifyContent": "center", "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "acCancelLabel", "name": "Label", "fill": "#888888", "content": "Cancel", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                },
                                {"type": "frame", "id": "acSaveBtn", "name": "SaveBtn",
                                    "clip": True, "width": 160, "height": 44, "fill": "#e10908",
                                    "cornerRadius": 8, "justifyContent": "center", "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "acSaveLabel", "name": "Label", "fill": "#FFFFFF", "content": "Add Vehicle", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
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

data["children"].append(addcar_frame)

# ============= UPLOAD PHOTO MODAL =============
upload_frame = {
    "type": "frame",
    "id": "uploadRoot",
    "x": 1460,
    "y": 3060,
    "name": "UploadPhoto",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "none",
    "children": [
        {"type": "rectangle", "id": make_id(), "name": "Overlay", "fill": "#00000080", "width": 1440, "height": 960, "x": 0, "y": 0},
        {
            "type": "frame", "id": "upModal", "layoutPosition": "absolute",
            "x": 420, "y": 80, "name": "UploadPhotoModal",
            "clip": True, "width": 600, "height": 800,
            "fill": "#0a0d12", "cornerRadius": 16, "layout": "vertical", "gap": 0,
            "children": [
                {
                    "type": "frame", "id": "upHdr", "name": "ModalHeader",
                    "clip": True, "width": "fill_container", "height": 60,
                    "fill": "transparent", "padding": [0, 20],
                    "justifyContent": "space_between", "alignItems": "center",
                    "children": [
                        {"type": "text", "id": "upHdrTitle", "name": "Title", "fill": "#FFFFFF", "content": "Upload Photo", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"},
                        {"type": "text", "id": "upHdrClose", "name": "Close", "fill": "#888888", "content": "\u2715", "fontFamily": "Inter", "fontSize": 22, "fontWeight": "normal"}
                    ]
                },
                {"type": "rectangle", "id": make_id(), "name": "Divider", "fill": "#333333", "width": "fill_container", "height": 1},
                {
                    "type": "frame", "id": "upContent", "name": "Content",
                    "clip": True, "width": "fill_container", "height": "fill_container",
                    "fill": "transparent", "layout": "vertical", "gap": 24, "padding": [30, 30],
                    "children": [
                        {
                            "type": "frame", "id": "upDropZone", "name": "DropZone",
                            "width": "fill_container", "height": 280, "fill": "#04080b",
                            "cornerRadius": 12, "stroke": "#333333", "strokeWidth": 2, "strokeStyle": "dashed",
                            "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {
                                    "type": "frame", "id": "upDropInner", "name": "DropInner",
                                    "fill": "transparent", "layout": "vertical", "gap": 10, "alignItems": "center",
                                    "children": [
                                        {"type": "icon", "id": "upDropIcon", "name": "UploadIcon", "width": 56, "height": 56, "icon": "upload-cloud", "library": "lucide", "fill": "#555555"},
                                        {"type": "text", "id": "upDropText", "name": "Text", "fill": "#888888", "content": "Drag & drop your photo here", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"},
                                        {"type": "text", "id": "upDropSub", "name": "Subtext", "fill": "#555555", "content": "or", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
                                        {"type": "frame", "id": "upBrowseBtn", "name": "BrowseButton",
                                            "clip": True, "width": 160, "height": 44, "fill": "#e10908",
                                            "cornerRadius": 8, "justifyContent": "center", "alignItems": "center",
                                            "children": [
                                                {"type": "text", "id": "upBrowseLabel", "name": "Label", "fill": "#FFFFFF", "content": "Browse Files", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                            ]
                                        },
                                        {"type": "text", "id": "upDropFormats", "name": "Formats", "fill": "#444444", "content": "PNG, JPG, WebP, GIF \u2022 Max 10MB", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "text", "id": "upTypeTitle", "name": "SectionTitle", "fill": "#FFFFFF", "content": "Photo Type", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"},
                        {
                            "type": "frame", "id": "upTypeRow", "name": "TypeRow",
                            "width": "fill_container", "fill": "transparent", "gap": 12,
                            "children": [
                                {"type": "frame", "id": "upType1", "name": "TypeOption",
                                    "clip": True, "width": "fill_container", "height": 60,
                                    "fill": "#0e1116", "cornerRadius": 10, "stroke": "#e10908", "strokeWidth": 1,
                                    "gap": 10, "padding": [0, 14], "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "upType1Icon", "name": "Icon", "fill": "#e10908", "content": "[car]", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "normal"},
                                        {"type": "text", "id": "upType1Label", "name": "Label", "fill": "#FFFFFF", "content": "Car Photo", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                    ]
                                },
                                {"type": "frame", "id": "upType2", "name": "TypeOption",
                                    "clip": True, "width": "fill_container", "height": 60,
                                    "fill": "transparent", "cornerRadius": 10, "stroke": "#333333", "strokeWidth": 1,
                                    "gap": 10, "padding": [0, 14], "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "upType2Icon", "name": "Icon", "fill": "#888888", "content": "[camera]", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "normal"},
                                        {"type": "text", "id": "upType2Label", "name": "Label", "fill": "#888888", "content": "Activity Photo", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                    ]
                                },
                                {"type": "frame", "id": "upType3", "name": "TypeOption",
                                    "clip": True, "width": "fill_container", "height": 60,
                                    "fill": "transparent", "cornerRadius": 10, "stroke": "#333333", "strokeWidth": 1,
                                    "gap": 10, "padding": [0, 14], "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "upType3Icon", "name": "Icon", "fill": "#888888", "content": "[person]", "fontFamily": "Inter", "fontSize": 20, "fontWeight": "normal"},
                                        {"type": "text", "id": "upType3Label", "name": "Label", "fill": "#888888", "content": "Avatar", "fontFamily": "Inter", "fontSize": 15, "fontWeight": "normal"}
                                    ]
                                }
                            ]
                        },
                        {"type": "frame", "id": make_id(), "name": "Spacer", "width": "fill_container", "height": "fill_container", "fill": "transparent"},
                        {
                            "type": "frame", "id": "upBtnRow", "name": "ButtonRow",
                            "width": "fill_container", "fill": "transparent", "gap": 12, "justifyContent": "flex_end",
                            "children": [
                                {"type": "frame", "id": "upCancelBtn", "name": "CancelBtn",
                                    "clip": True, "width": 120, "height": 44, "fill": "transparent",
                                    "stroke": "#333333", "strokeWidth": 1, "cornerRadius": 8,
                                    "justifyContent": "center", "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "upCancelLabel", "name": "Label", "fill": "#888888", "content": "Cancel", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
                                    ]
                                },
                                {"type": "frame", "id": "upUploadBtn", "name": "UploadBtn",
                                    "clip": True, "width": 160, "height": 44, "fill": "#e10908",
                                    "cornerRadius": 8, "justifyContent": "center", "alignItems": "center",
                                    "children": [
                                        {"type": "text", "id": "upUploadLabel", "name": "Label", "fill": "#FFFFFF", "content": "Upload Photo", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "normal"}
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

data["children"].append(upload_frame)

# Write back
with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Added 3 new frames to dashboard.pen")
for child in data["children"]:
    print(f'   [{child["name"]}] at ({child["x"]}, {child["y"]})  {child["width"]}x{child["height"]}')
