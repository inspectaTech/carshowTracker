#!/usr/bin/env python3
"""Update dashboard.pen:
1. EditProfile modal - add Handle field (below Display Name) + Divider + About Me section, grow modal.
2. New root frame 'HandleStates' - showcase of Checking/Available/Taken/Invalid handle field states (own area).
3. Login card - restructure to match real LoginForm.jsx (toggle, error box, OAuth before divider, labeled fields).
4. New root frame 'LoginSignUp' - Sign Up tab variant (own area).
Edits .pen JSON directly (DeepSeek proxy can't batch_design reliably).
"""

import json
import copy

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"

with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)


def find_root(name):
    for c in data["children"]:
        if c.get("name") == name:
            return c
    raise KeyError(f"root frame {name} not found")


def find_child(parent, node_id):
    for c in parent.get("children", []):
        if c.get("id") == node_id:
            return c
    raise KeyError(f"node {node_id} not found")


# ---------------------------------------------------------------------------
# 1. EDIT PROFILE MODAL
# ---------------------------------------------------------------------------
edit_prof = find_root("EditProfile")
ep_modal = find_child(edit_prof, "epModal")
ep_form = find_child(ep_modal, "epForm")

# Grow the modal + its root so the longer form fits (real modal scrolls internally)
ep_modal["height"] = 1180
edit_prof["height"] = 1230

# Reference existing field nodes to keep (label + input pairs)
field_first = find_child(ep_form, "epFieldFirst")
input_name = find_child(ep_form, "epInputName")
field_bio = find_child(ep_form, "epFieldBio")
input_bio = find_child(ep_form, "epInputBio")
field_loc = find_child(ep_form, "epFieldLoc")
input_loc = find_child(ep_form, "epInputLoc")
field_social = find_child(ep_form, "epFieldSocial")
input_social = find_child(ep_form, "epInputSocial")
spacer = find_child(ep_form, "a4b91348c077")
btn_row = find_child(ep_form, "epBtnRow")


def label(node_id, content, size=14, color="#FFFFFF"):
    return {"type": "text", "id": node_id, "name": "FieldLabel", "fill": color,
            "content": content, "fontFamily": "Inter", "fontSize": size, "fontWeight": "normal"}


def input_field(node_id, prefix=None, value="", placeholder="#555555", height=48,
                value_color="#FFFFFF", icon=None):
    children = []
    if prefix:
        children.append({"type": "text", "id": f"{node_id}Prefix", "name": "Prefix",
                         "fill": "#555555", "content": prefix, "fontFamily": "Inter",
                         "fontSize": 16, "fontWeight": "normal"})
    children.append({"type": "text", "id": f"{node_id}Val", "name": "Value",
                     "fill": value_color, "content": value, "fontFamily": "Inter",
                     "fontSize": 16, "fontWeight": "normal"})
    if icon:
        children.append({"type": "text", "id": f"{node_id}Icon", "name": "Icon",
                         "fill": "#555555", "content": icon, "fontFamily": "Inter",
                         "fontSize": 16, "fontWeight": "normal"})
    return {"type": "frame", "id": node_id, "name": "InputField", "clip": True,
            "width": "fill_container", "height": height, "fill": "#04080b",
            "cornerRadius": 8, "padding": [0, 14], "justifyContent": "center",
            "alignItems": "center", "children": children}


def textarea(node_id, value, height=80):
    return {"type": "frame", "id": node_id, "name": "InputTextArea", "clip": True,
            "width": "fill_container", "height": height, "fill": "#04080b",
            "cornerRadius": 8, "padding": [12, 14],
            "children": [{"type": "text", "id": f"{node_id}Val", "name": "Value",
                          "fill": "#FFFFFF", "textGrowth": "fixed-width-height",
                          "width": 620, "height": height - 24, "content": value,
                          "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"}]}


# Handle field (below Display Name)
field_handle = label("epFieldHandle", "Handle")
input_handle = input_field("epInputHandle", prefix="@", value="gearhead_23")
status_handle = {
    "type": "frame", "id": "epHandleStatus", "name": "StatusHint",
    "width": "fill_container", "fill": "transparent", "gap": 6, "alignItems": "center",
    "children": [{"type": "text", "id": "epHandleStatusTxt", "name": "StatusText",
                  "fill": "#4ade80", "content": "✓ Available",
                  "fontFamily": "Inter", "fontSize": 12, "fontWeight": "normal"}],
}

# Divider + About Me section
divider = {"type": "rectangle", "id": "epDivider", "name": "Divider",
           "fill": "#333333", "width": "fill_container", "height": 1}
about_title = {"type": "text", "id": "epAboutTitle", "name": "SectionTitle", "fill": "#FFFFFF",
               "content": "About Me", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "normal"}
about_sub = {"type": "text", "id": "epAboutSub", "name": "SectionSubtitle", "fill": "#888888",
             "content": "Tell the community about yourself — your car preferences, style, and story.",
             "fontFamily": "Inter", "fontSize": 13, "fontWeight": "normal"}

about_fields = [
    (label("epFieldAbout", "About Me"), textarea("epInputAbout",
        "Professional napper. My car gets me to the fridge and back.", 80)),
    (label("epFieldBrand", "Favorite Brand"), input_field("epInputBrand", value="e.g. Nissan")),
    (label("epFieldDream", "Dream Car"), input_field("epInputDream", value="e.g. Nissan GT-R R34")),
    (label("epFieldOcc", "Occupation"), input_field("epInputOcc", value="e.g. Automotive Photographer")),
    (label("epFieldDrive", "Drive Style"), input_field("epInputDrive", value="e.g. Performance & Style")),
]

new_form_children = [
    find_child(ep_form, "epAvatarRow"),
    field_first, input_name,
    field_handle, input_handle, status_handle,
    field_bio, input_bio,
    field_loc, input_loc,
    field_social, input_social,
    divider,
    about_title, about_sub,
]
for lab, inp in about_fields:
    new_form_children += [lab, inp]
new_form_children += [spacer, btn_row]

ep_form["children"] = new_form_children
ep_form["gap"] = 16

# ---------------------------------------------------------------------------
# 2. HANDLE STATES SHOWCASE (new root frame in column 4 - own area)
# ---------------------------------------------------------------------------
def state_card(card_id, state_name, handle_val, status_text, status_color, border="#333333"):
    return {
        "type": "frame", "id": card_id, "name": "StateCard", "clip": True,
        "width": "fill_container", "fill": "#0a0d12", "cornerRadius": 12,
        "stroke": border, "strokeWidth": 1, "layout": "vertical", "gap": 10,
        "padding": [16, 18],
        "children": [
            label(f"{card_id}Title", state_name, size=15, color="#FFFFFF"),
            input_field(f"{card_id}Input", prefix="@", value=handle_val),
            {"type": "frame", "id": f"{card_id}Status", "name": "StatusHint",
             "width": "fill_container", "fill": "transparent", "gap": 6, "alignItems": "center",
             "children": [{"type": "text", "id": f"{card_id}StatusTxt", "name": "StatusText",
                           "fill": status_color, "content": status_text,
                           "fontFamily": "Inter", "fontSize": 13, "fontWeight": "normal"}]},
        ],
    }


states_root = {
    "type": "frame", "id": "handleStatesRoot", "x": 4708, "y": 0,
    "name": "HandleStates", "clip": True, "width": 1440, "height": 960,
    "fill": "#04080b", "layout": "none",
    "children": [
        {
            "type": "frame", "id": "hsWrap", "layoutPosition": "absolute", "x": 70, "y": 60,
            "name": "Showcase", "clip": True, "width": 620, "fill": "transparent",
            "layout": "vertical", "gap": 24,
            "children": [
                {"type": "text", "id": "hsTitle", "name": "Title", "fill": "#FFFFFF",
                 "content": "Handle field states", "fontFamily": "Inter", "fontSize": 26,
                 "fontWeight": "normal"},
                state_card("hsChecking", "Checking", "gearhead_23", "Checking availability…", "#888888"),
                state_card("hsAvailable", "Available", "gearhead_23", "✓ Available", "#4ade80"),
                state_card("hsTaken", "Taken", "cardude", "✕ That handle is already taken", "#e10908"),
                state_card("hsInvalid", "Invalid", "ga rah_!", "✕ 2–30 chars: letters, numbers, underscores", "#e10908"),
            ],
        }
    ],
}
data["children"].append(states_root)

# ---------------------------------------------------------------------------
# 3. LOGIN CARD - restructure to match real LoginForm.jsx
# ---------------------------------------------------------------------------
login_root = find_root("Login")
login_card = find_child(login_root, "loginCard")
login_card["height"] = 920
login_card["y"] = 20
login_card["gap"] = 18

logo = find_child(login_card, "loginLogo")
welcome_title = find_child(login_card, "welcomeTitle")
welcome_sub = find_child(login_card, "welcomeSub")
email_field = find_child(login_card, "emailField")
pass_field = find_child(login_card, "passField")
forgot_row = find_child(login_card, "forgotRow")
sign_in_btn = find_child(login_card, "signInBtn")
divider = find_child(login_card, "divider")
google_btn = find_child(login_card, "googleBtn")
github_btn = find_child(login_card, "githubBtn")
signup_row = find_child(login_card, "signupRow")

# Add show/hide-password eye to password field
pass_field["children"].append({"type": "text", "id": "passEye", "name": "EyeToggle",
                               "fill": "#555555", "content": "👁", "fontFamily": "Inter",
                               "fontSize": 16, "fontWeight": "normal"})

def mode_toggle(node_id, active="signin"):
    active_bg = "#0a0d12"
    active_color = "#FFFFFF"
    inactive_color = "#666666"
    si_bg = active_bg if active == "signin" else "transparent"
    su_bg = active_bg if active == "signup" else "transparent"
    si_col = active_color if active == "signin" else inactive_color
    su_col = active_color if active == "signup" else inactive_color
    return {
        "type": "frame", "id": f"{node_id}", "name": "ModeToggle", "clip": True,
        "width": "fill_container", "height": 44, "fill": "#04080b", "cornerRadius": 8,
        "gap": 4, "padding": [4, 4], "alignItems": "center",
        "children": [
            {"type": "frame", "id": f"{node_id}SignIn", "name": "Tab", "clip": True,
             "width": "fill_container", "height": 36, "fill": si_bg, "cornerRadius": 6,
             "justifyContent": "center", "alignItems": "center",
             "children": [{"type": "text", "id": f"{node_id}SignInTxt", "name": "Label",
                           "fill": si_col, "content": "Sign In", "fontFamily": "Inter",
                           "fontSize": 14, "fontWeight": "normal"}]},
            {"type": "frame", "id": f"{node_id}SignUp", "name": "Tab", "clip": True,
             "width": "fill_container", "height": 36, "fill": su_bg, "cornerRadius": 6,
             "justifyContent": "center", "alignItems": "center",
             "children": [{"type": "text", "id": f"{node_id}SignUpTxt", "name": "Label",
                           "fill": su_col, "content": "Sign Up", "fontFamily": "Inter",
                           "fontSize": 14, "fontWeight": "normal"}]},
        ],
    }


def field_group(node_id, label_text, inner_field):
    return {
        "type": "frame", "id": node_id, "name": "FieldGroup",
        "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 8,
        "children": [label(f"{node_id}Label", label_text), inner_field],
    }


error_box = {
    "type": "frame", "id": "loginError", "name": "ErrorBox", "clip": True,
    "width": "fill_container", "height": 44, "fill": "#1a0a0c", "cornerRadius": 8,
    "stroke": "#e10908", "strokeWidth": 1, "justifyContent": "center", "alignItems": "center",
    "children": [{"type": "text", "id": "loginErrorTxt", "name": "ErrorText", "fill": "#e10908",
                  "content": "Invalid email or password", "fontFamily": "Inter",
                  "fontSize": 13, "fontWeight": "normal"}],
}

oauth_section = {
    "type": "frame", "id": "oauthSection", "name": "OAuthSection",
    "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 12,
    "children": [google_btn, github_btn],
}

form_section = {
    "type": "frame", "id": "formSection", "name": "FormSection",
    "width": "fill_container", "fill": "transparent", "layout": "vertical", "gap": 14,
    "children": [
        field_group("emailGroup", "Email Address", email_field),
        field_group("passGroup", "Password", pass_field),
        forgot_row,
    ],
}

login_card["children"] = [
    logo,
    welcome_title,
    welcome_sub,
    mode_toggle("lgModeToggle", active="signin"),
    error_box,
    oauth_section,
    divider,
    form_section,
    sign_in_btn,
    signup_row,
]

# ---------------------------------------------------------------------------
# 4. LOGIN SIGN UP VARIANT (new root frame in column 4 - own area)
# ---------------------------------------------------------------------------
def signup_field(node_id, label_text, value, placeholder_color="#555555", icon="🔒"):
    return field_group(node_id, label_text, input_field(f"{node_id}Input", value=value,
                                                       icon=icon))


full_name_group = field_group("suNameGroup", "Full Name",
                              input_field("suNameInput", value="Gearhead_23", icon="👤"))
email_group = field_group("suEmailGroup", "Email Address",
                          input_field("suEmailInput", value="you@example.com", icon="✉️"))
pass_group = field_group("suPassGroup", "Password",
                         input_field("suPassInput", value="••••••••", icon="🔒"))
confirm_group = field_group("suConfirmGroup", "Confirm Password",
                            input_field("suConfirmInput", value="••••••••", icon="🔒"))

create_btn = {
    "type": "frame", "id": "suCreateBtn", "name": "SubmitButton", "clip": True,
    "width": "fill_container", "height": 52, "fill": "#e10908", "cornerRadius": 8,
    "justifyContent": "center", "alignItems": "center",
    "children": [{"type": "text", "id": "suCreateLabel", "name": "Label", "fill": "#FFFFFF",
                  "content": "Create Account", "fontFamily": "Inter", "fontSize": 18,
                  "fontWeight": "normal"}],
}

signup_row = {
    "type": "frame", "id": "suSignupRow", "name": "SignUpRow",
    "width": "fill_container", "fill": "transparent", "gap": 6,
    "justifyContent": "center", "alignItems": "center",
    "children": [
        {"type": "text", "id": "suHasAccount", "name": "HasAccountText", "fill": "#888888",
         "content": "Already have an account?", "fontFamily": "Inter", "fontSize": 14,
         "fontWeight": "normal"},
        {"type": "text", "id": "suSignInLink", "name": "SignInLink", "fill": "#e10908",
         "content": "Sign In", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "normal"},
    ],
}

su_divider = copy.deepcopy(divider)
su_divider["id"] = "suDivider"

su_card = {
    "type": "frame", "id": "suCard", "layoutPosition": "absolute", "x": 480, "y": 20,
    "name": "LoginCard", "clip": True, "width": 480, "height": 920, "fill": "#0a0d12",
    "cornerRadius": 16, "layout": "vertical", "gap": 18, "padding": [40, 48],
    "alignItems": "center",
    "children": [
        copy.deepcopy(logo),
        {"type": "text", "id": "suTitle", "name": "WelcomeTitle", "fill": "#FFFFFF",
         "content": "Create Account", "fontFamily": "Inter", "fontSize": 32, "fontWeight": "normal"},
        {"type": "text", "id": "suSub", "name": "WelcomeSubtitle", "fill": "#888888",
         "content": "Join the car show community", "fontFamily": "Inter", "fontSize": 16,
         "fontWeight": "normal"},
        mode_toggle("suModeToggle", active="signup"),
        {"type": "frame", "id": "suOAuth", "name": "OAuthSection", "width": "fill_container",
         "fill": "transparent", "layout": "vertical", "gap": 12,
         "children": [copy.deepcopy(google_btn), copy.deepcopy(github_btn)]},
        su_divider,
        {"type": "frame", "id": "suForm", "name": "FormSection", "width": "fill_container",
         "fill": "transparent", "layout": "vertical", "gap": 14,
         "children": [full_name_group, email_group, pass_group, confirm_group]},
        create_btn,
        signup_row,
    ],
}

signup_root = {
    "type": "frame", "id": "loginSignUpRoot", "x": 4708, "y": 1238,
    "name": "LoginSignUp", "clip": True, "width": 1440, "height": 960,
    "fill": "#04080b", "layout": "none",
    "children": [
        {"type": "rectangle", "id": "suBg", "x": 0, "y": 0, "name": "Bg",
         "fill": "#04080b", "width": 1440, "height": 960},
        su_card,
    ],
}
data["children"].append(signup_root)

# ---------------------------------------------------------------------------
# WRITE
# ---------------------------------------------------------------------------
with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("dashboard.pen updated:")
print("  - EditProfile modal: added Handle field + Divider + About Me section, height 1180")
print("  - New root frame: HandleStates showcase (x=4708,y=0)")
print("  - Login card: restructured to match real LoginForm (toggle, error, OAuth-first, labels)")
print("  - New root frame: LoginSignUp variant (x=4708,y=1238)")
