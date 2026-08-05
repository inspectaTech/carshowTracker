#!/usr/bin/env python3
"""Add a new full-page 'Events' display frame to dashboard.pen.

Eventbrite-style event detail page:
  - Full-width hero image + title bar (title, meta, breadcrumb, share)
  - Left column: every CreateEvent form field rendered read-only
    (Date & Time stat cards -> Map -> Location/Zip -> Description -> Cost -> Category)
  - Right column: action area (RSVP button, attendee count, share)
Placed in its own empty canvas area (bottom-right cell) — user will rearrange.
"""

import json

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)


def text(node_id, name, content, color="#FFFFFF", size=14, weight="normal", align=None):
    n = {"type": "text", "id": node_id, "name": name, "fill": color, "content": content,
         "fontFamily": "Inter", "fontSize": size, "fontWeight": weight}
    if align:
        n["textAlign"] = align
    return n


def icon(node_id, name, icon_name, color="#888888", w=20, h=20):
    return {"type": "icon", "id": node_id, "name": name, "width": w, "height": h,
            "icon": icon_name, "library": "lucide", "fill": color}


def card(node_id, name, w="fill_container", h="fill_container", fill="#0a0d12", radius=12,
         layout="vertical", gap=12, padding=16, x=None, y=None):
    n = {"type": "frame", "id": node_id, "name": name, "clip": True, "width": w, "height": h,
         "fill": fill, "cornerRadius": radius, "layout": layout, "gap": gap, "padding": padding}
    if x is not None:
        n["x"] = x
    if y is not None:
        n["y"] = y
    return n


def section_label(node_id, content):
    return text(node_id, "SectionTitle", content, "#FFFFFF", 18)


def field_label(node_id, content):
    return text(node_id, "FieldLabel", content, "#FFFFFF", 14)


def stat_card(node_id, label, value, icon_name):
    return {
        "type": "frame", "id": node_id, "name": "StatCard", "clip": True,
        "width": "fill_container", "height": 96, "fill": "#0a0d12", "cornerRadius": 10,
        "gap": 10, "padding": 16, "alignItems": "center",
        "children": [
            icon(f"{node_id}Icon", "Icon", icon_name, "#e10908", 24, 24),
            {"type": "frame", "id": f"{node_id}Txt", "name": "TextBlock", "width": "fill_container",
             "fill": "transparent", "layout": "vertical", "gap": 2,
             "children": [
                 text(f"{node_id}Val", "Value", value, "#FFFFFF", 16),
                 text(f"{node_id}Lbl", "Label", label, "#888888", 13),
             ]},
        ],
    }


# ---------------------------------------------------------------------------
# Build the frame
# ---------------------------------------------------------------------------
events_root = {
    "type": "frame", "id": "eventsRoot", "x": 4708, "y": 4341,
    "name": "Events", "clip": True, "width": 1440, "height": 1400,
    "fill": "#04080b", "layout": "vertical", "gap": 0,
    "children": [
        # ---- Hero image (full-width header) ----
        {
            "type": "rectangle", "cornerRadius": [0, 0, 0, 0], "id": "evHeroImg",
            "name": "HeroImage", "fill": {"type": "image", "enabled": True,
            "url": "satellite.jpeg", "mode": "fill"},
            "width": "fill_container", "height": 260,
        },
        # ---- Title bar below hero ----
        {
            "type": "frame", "id": "evTitleBar", "name": "TitleBar", "clip": True,
            "width": "fill_container", "height": 150, "fill": "#0a0d12",
            "layout": "vertical", "gap": 8, "padding": [24, 40],
            "children": [
                # Breadcrumb + share row
                {"type": "frame", "id": "evTopRow", "name": "TopRow", "width": "fill_container",
                 "fill": "transparent", "justifyContent": "space_between", "alignItems": "center",
                 "children": [
                     {"type": "frame", "id": "evBackBtn", "name": "BackButton", "clip": True,
                      "width": 160, "height": 36, "fill": "#04080b", "cornerRadius": 8,
                      "stroke": "#333333", "strokeWidth": 1, "gap": 8, "padding": [0, 14],
                      "justifyContent": "center", "alignItems": "center",
                      "children": [
                          icon("evBackIcon", "Icon", "arrow-left", "#888888", 16, 16),
                          text("evBackLabel", "Label", "← Back to events", "#AAAAAA", 14),
                      ]},
                     {"type": "frame", "id": "evShareTopBtn", "name": "ShareButton", "clip": True,
                      "width": 110, "height": 36, "fill": "#04080b", "cornerRadius": 8,
                      "stroke": "#333333", "strokeWidth": 1, "gap": 8, "padding": [0, 14],
                      "justifyContent": "center", "alignItems": "center",
                      "children": [
                          icon("evShareTopIcon", "Icon", "share-2", "#888888", 16, 16),
                          text("evShareTopLabel", "Label", "Share", "#AAAAAA", 14),
                      ]},
                 ]},
                # Title
                text("evTitle", "Title", "SoCal JDM Meet 2026", "#FFFFFF", 32),
                # Meta line
                {"type": "frame", "id": "evMetaRow", "name": "MetaRow", "width": "fill_container",
                 "fill": "transparent", "gap": 20, "alignItems": "center",
                 "children": [
                     {"type": "frame", "id": "evMetaDate", "name": "MetaItem", "fill": "transparent",
                      "gap": 8, "alignItems": "center",
                      "children": [icon("evMetaDateIcon", "Icon", "calendar", "#888888", 18, 18),
                                   text("evMetaDateTxt", "Text", "Sat, Jul 15, 2026", "#AAAAAA", 16)]},
                     {"type": "frame", "id": "evMetaTime", "name": "MetaItem", "fill": "transparent",
                      "gap": 8, "alignItems": "center",
                      "children": [icon("evMetaTimeIcon", "Icon", "clock", "#888888", 18, 18),
                                   text("evMetaTimeTxt", "Text", "6:00 PM – 10:00 PM", "#AAAAAA", 16)]},
                     {"type": "frame", "id": "evMetaLoc", "name": "MetaItem", "fill": "transparent",
                      "gap": 8, "alignItems": "center",
                      "children": [icon("evMetaLocIcon", "Icon", "map-pin", "#888888", 18, 18),
                                   text("evMetaLocTxt", "Text", "Los Angeles, CA", "#AAAAAA", 16)]},
                 ]},
            ],
        },
        # ---- Body: two columns ----
        {
            "type": "frame", "id": "evBody", "name": "Body", "clip": True,
            "width": "fill_container", "height": "fill_container", "fill": "#04080b",
            "layout": "horizontal", "gap": 30, "padding": [40, 30],
            "children": [
                # ================= LEFT COLUMN (all form fields) =================
                {
                    "type": "frame", "id": "evLeftCol", "name": "LeftColumn",
                    "width": 920, "height": "fill_container", "fill": "transparent",
                    "layout": "vertical", "gap": 22,
                    "children": [
                        # --- Date & Time ---
                        section_label("evSecDateTime", "Date & Time"),
                        {"type": "frame", "id": "evDateTimeRow", "name": "DateTimeRow",
                         "width": "fill_container", "fill": "transparent", "gap": 16,
                         "children": [
                             stat_card("evDtDate", "Date", "Jul 15, 2026", "calendar"),
                             stat_card("evDtStart", "Start Time", "6:00 PM", "clock"),
                             stat_card("evDtEnd", "End Time", "10:00 PM", "clock-4"),
                         ]},
                        # --- Location: map then info ---
                        section_label("evSecLoc", "Location"),
                        {
                            "type": "frame", "id": "evMap", "name": "EventMap", "clip": True,
                            "width": "fill_container", "height": 240, "fill": "#0a0d12",
                            "cornerRadius": 12, "justifyContent": "center", "alignItems": "center",
                            "children": [
                                {"type": "frame", "id": "evMapInner", "name": "MapInner",
                                 "width": "fill_container", "height": "fill_container",
                                 "fill": "#1a1d22", "cornerRadius": 12,
                                 "justifyContent": "center", "alignItems": "center",
                                 "children": [
                                     icon("evMapPin", "MapPin", "map-pin", "#e10908", 44, 44),
                                     text("evMapText", "MapText", "Interactive map", "#555555", 14),
                                 ]},
                            ],
                        },
                        # Location info (same as form: address + zip)
                        {"type": "frame", "id": "evLocInfo", "name": "LocationInfo",
                         "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 12,
                         "layout": "vertical", "gap": 10, "padding": 20,
                         "children": [
                             field_label("evLocLabel", "Location"),
                             {"type": "frame", "id": "evLocRow", "name": "LocationRow",
                              "width": "fill_container", "fill": "transparent", "gap": 10,
                              "alignItems": "center",
                              "children": [
                                  icon("evLocIcon", "Icon", "map-pin", "#888888", 18, 18),
                                  text("evLocAddr", "Address",
                                       "1200 Fairplex Dr, Pomona, CA", "#FFFFFF", 16),
                              ]},
                             {"type": "frame", "id": "evZipRow", "name": "ZipRow",
                              "width": "fill_container", "fill": "transparent", "gap": 10,
                              "alignItems": "center",
                              "children": [
                                  icon("evZipIcon", "Icon", "hash", "#888888", 18, 18),
                                  text("evZipText", "ZipCode", "Zip Code: 91768", "#FFFFFF", 16),
                              ]},
                         ]},
                        # --- Description (rendered rich text) ---
                        section_label("evSecDesc", "About this event"),
                        {"type": "frame", "id": "evDescBody", "name": "DescriptionBody",
                         "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 12,
                         "layout": "vertical", "gap": 10, "padding": 20,
                         "children": [
                             text("evDescP1", "Paragraph",
                                  "Join us for the biggest JDM meet of the summer! Hundreds of Japanese classics, imports, and modern JDM icons will fill the Fairplex grounds.",
                                  "#AAAAAA", 15),
                             text("evDescP2", "Paragraph",
                                  "Featuring live drifting demos, a vendor village, food trucks, and awards for Best in Show across 12 categories.",
                                  "#AAAAAA", 15),
                             text("evDescP3", "Paragraph",
                                  "Gates open at 6:00 PM. Rain or shine. All makes and models welcome — you do not need a JDM car to attend.",
                                  "#AAAAAA", 15),
                         ]},
                        # --- Cost ---
                        section_label("evSecCost", "Cost"),
                        {"type": "frame", "id": "evCostCard", "name": "CostCard",
                         "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 12,
                         "layout": "horizontal", "gap": 16, "padding": 20, "alignItems": "center",
                         "children": [
                             {"type": "frame", "id": "evCostChip", "name": "CostChip", "clip": True,
                              "width": 90, "height": 40, "fill": "#e10908", "cornerRadius": 8,
                              "justifyContent": "center", "alignItems": "center",
                              "children": [text("evCostChipTxt", "Label", "Free", "#FFFFFF", 15)]},
                             text("evCostNote", "Note", "Free entry • Parking $10", "#888888", 14),
                         ]},
                        # --- Category ---
                        section_label("evSecCat", "Category"),
                        {"type": "frame", "id": "evCatRow", "name": "CategoryRow",
                         "width": "fill_container", "fill": "transparent", "gap": 10,
                         "children": [
                             {"type": "frame", "id": "evCatTag1", "name": "Tag", "clip": True,
                              "fill": "#1a1d22", "cornerRadius": 6, "padding": [6, 14],
                              "children": [text("evCatTag1Txt", "T", "JDM", "#e10908", 13)]},
                             {"type": "frame", "id": "evCatTag2", "name": "Tag", "clip": True,
                              "fill": "#1a1d22", "cornerRadius": 6, "padding": [6, 14],
                              "children": [text("evCatTag2Txt", "T", "Import", "#e10908", 13)]},
                             {"type": "frame", "id": "evCatTag3", "name": "Tag", "clip": True,
                              "fill": "#1a1d22", "cornerRadius": 6, "padding": [6, 14],
                              "children": [text("evCatTag3Txt", "T", "Meetup", "#e10908", 13)]},
                         ]},
                    ],
                },
                # ================= RIGHT COLUMN (action area) =================
                {
                    "type": "frame", "id": "evRightCol", "name": "RightColumn",
                    "width": 420, "height": "fill_container", "fill": "transparent",
                    "layout": "vertical", "gap": 20,
                    "children": [
                        # RSVP / Get Tickets
                        {"type": "frame", "id": "evRsvpBtn", "name": "RsvpButton", "clip": True,
                         "width": "fill_container", "height": 64, "fill": "#e10908",
                         "cornerRadius": 10, "justifyContent": "center", "alignItems": "center",
                         "children": [
                             text("evRsvpLabel", "Label", "Get Tickets", "#FFFFFF", 20),
                         ]},
                        # Attendee count
                        {"type": "frame", "id": "evAttendCard", "name": "AttendeeCard", "clip": True,
                         "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 12,
                         "layout": "vertical", "gap": 14, "padding": 20,
                         "children": [
                             text("evAttendCount", "Count", "234 attending", "#FFFFFF", 18),
                             {"type": "frame", "id": "evAttendRow", "name": "AvatarStack",
                              "width": "fill_container", "fill": "transparent", "gap": 10,
                              "alignItems": "center",
                              "children": [
                                  {"type": "rectangle", "cornerRadius": 16, "id": "evAv1",
                                   "name": "Avatar", "fill": "#e10908", "width": 32, "height": 32},
                                  {"type": "rectangle", "cornerRadius": 16, "id": "evAv2",
                                   "name": "Avatar", "fill": "#1a1d22", "width": 32, "height": 32},
                                  {"type": "rectangle", "cornerRadius": 16, "id": "evAv3",
                                   "name": "Avatar", "fill": "#333333", "width": 32, "height": 32},
                                  {"type": "rectangle", "cornerRadius": 16, "id": "evAv4",
                                   "name": "Avatar", "fill": "#555555", "width": 32, "height": 32},
                                  text("evAttendMore", "More", "+230", "#888888", 13),
                              ]},
                             text("evAttendSub", "Subtext",
                                  "Join 234 car enthusiasts going", "#888888", 13),
                         ]},
                        # Share
                        {"type": "frame", "id": "evShareBtn", "name": "ShareButton", "clip": True,
                         "width": "fill_container", "height": 48, "fill": "#04080b",
                         "cornerRadius": 10, "stroke": "#333333", "strokeWidth": 1,
                         "gap": 10, "padding": [0, 20], "justifyContent": "center",
                         "alignItems": "center",
                         "children": [
                             icon("evShareIcon", "Icon", "share-2", "#FFFFFF", 20, 20),
                             text("evShareLabel", "Label", "Share this event", "#FFFFFF", 16),
                         ]},
                    ],
                },
            ],
        },
    ],
}

data["children"].append(events_root)

with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Added 'Events' root frame at (4708, 4341) 1440x1400")
print("Total root frames:", len(data['children']))
