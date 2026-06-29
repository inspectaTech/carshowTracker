#!/usr/bin/env python3
"""Add a Login/Sign Up screen frame to dashboard.pen"""

import json, uuid, shutil, os

PEN_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen"
BACKUP_PATH = r"c:\Users\d3pot\version-control\antigravity\carshowTracker\planning\pencil\dashboard.pen.bak"

# Read the current file
with open(PEN_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Backup
shutil.copy2(PEN_PATH, BACKUP_PATH)

def make_id():
    return uuid.uuid4().hex[:12]

# ---------- LOGIN / SIGN UP FRAME ----------
login_frame = {
    "type": "frame",
    "id": "loginRoot",
    "x": 0,
    "y": 0,
    "name": "Login",
    "clip": True,
    "width": 1440,
    "height": 960,
    "fill": "#04080b",
    "layout": "none",
    "children": [
        # Background decorative elements
        {
            "type": "rectangle",
            "id": make_id(),
            "x": 0,
            "y": 0,
            "name": "BgGradient",
            "fill": "#04080b",
            "width": 1440,
            "height": 960
        },
        # Center login card
        {
            "type": "frame",
            "id": "loginCard",
            "layoutPosition": "absolute",
            "x": 480,
            "y": 80,
            "name": "LoginCard",
            "clip": True,
            "width": 480,
            "height": 800,
            "fill": "#0a0d12",
            "cornerRadius": 16,
            "layout": "vertical",
            "padding": [40, 48],
            "alignItems": "center",
            "gap": 20,
            "children": [
                # Logo
                {
                    "type": "rectangle",
                    "cornerRadius": 8,
                    "id": "loginLogo",
                    "name": "Logo",
                    "fill": {"type": "image", "enabled": True, "url": "cst_logo.png", "mode": "fill"},
                    "width": 200,
                    "height": 82
                },
                # Welcome text
                {
                    "type": "text",
                    "id": "welcomeTitle",
                    "name": "WelcomeTitle",
                    "fill": "#FFFFFF",
                    "content": "Welcome Back",
                    "fontFamily": "Inter",
                    "fontSize": 32,
                    "fontWeight": "normal"
                },
                {
                    "type": "text",
                    "id": "welcomeSub",
                    "name": "WelcomeSubtitle",
                    "fill": "#888888",
                    "content": "Sign in to your Car Show Tracker account",
                    "fontFamily": "Inter",
                    "fontSize": 16,
                    "fontWeight": "normal"
                },
                # Spacer
                {"type": "frame", "id": make_id(), "name": "Spacer", "width": "fill_container", "height": 10, "fill": "transparent"},
                # Email field
                {
                    "type": "frame",
                    "id": "emailField",
                    "name": "EmailField",
                    "clip": True,
                    "width": "fill_container",
                    "height": 52,
                    "fill": "#04080b",
                    "cornerRadius": 8,
                    "gap": 10,
                    "padding": [0, 16],
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "emailIcon",
                            "name": "Icon",
                            "fill": "#888888",
                            "content": "✉️",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        },
                        {
                            "type": "text",
                            "id": "emailPlaceholder",
                            "name": "Placeholder",
                            "fill": "#555555",
                            "content": "Email address",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # Password field
                {
                    "type": "frame",
                    "id": "passField",
                    "name": "PasswordField",
                    "clip": True,
                    "width": "fill_container",
                    "height": 52,
                    "fill": "#04080b",
                    "cornerRadius": 8,
                    "gap": 10,
                    "padding": [0, 16],
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "passIcon",
                            "name": "Icon",
                            "fill": "#888888",
                            "content": "🔒",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        },
                        {
                            "type": "text",
                            "id": "passPlaceholder",
                            "name": "Placeholder",
                            "fill": "#555555",
                            "content": "Password",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # Forgot password link
                {
                    "type": "frame",
                    "id": "forgotRow",
                    "name": "ForgotRow",
                    "width": "fill_container",
                    "fill": "transparent",
                    "justifyContent": "flex_end",
                    "children": [
                        {
                            "type": "text",
                            "id": "forgotLink",
                            "name": "ForgotPassword",
                            "fill": "#e10908",
                            "content": "Forgot password?",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # Sign In button
                {
                    "type": "frame",
                    "id": "signInBtn",
                    "name": "SignInButton",
                    "clip": True,
                    "width": "fill_container",
                    "height": 52,
                    "fill": "#e10908",
                    "cornerRadius": 8,
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "signInLabel",
                            "name": "Label",
                            "fill": "#FFFFFF",
                            "content": "Sign In",
                            "fontFamily": "Inter",
                            "fontSize": 18,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # Divider
                {
                    "type": "frame",
                    "id": "divider",
                    "name": "Divider",
                    "width": "fill_container",
                    "fill": "transparent",
                    "gap": 12,
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "rectangle",
                            "id": make_id(),
                            "name": "Line",
                            "fill": "#333333",
                            "width": "fill_container",
                            "height": 1
                        },
                        {
                            "type": "text",
                            "id": "dividerText",
                            "name": "Text",
                            "fill": "#666666",
                            "content": "or continue with",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                        },
                        {
                            "type": "rectangle",
                            "id": make_id(),
                            "name": "Line",
                            "fill": "#333333",
                            "width": "fill_container",
                            "height": 1
                        }
                    ]
                },
                # Google OAuth button
                {
                    "type": "frame",
                    "id": "googleBtn",
                    "name": "GoogleButton",
                    "clip": True,
                    "width": "fill_container",
                    "height": 48,
                    "fill": "#04080b",
                    "cornerRadius": 8,
                    "stroke": "#333333",
                    "strokeWidth": 1,
                    "gap": 10,
                    "padding": [0, 20],
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "googleIcon",
                            "name": "Icon",
                            "fill": "#FFFFFF",
                            "content": "G",
                            "fontFamily": "Inter",
                            "fontSize": 20,
                            "fontWeight": "bold"
                        },
                        {
                            "type": "text",
                            "id": "googleLabel",
                            "name": "Label",
                            "fill": "#FFFFFF",
                            "content": "Continue with Google",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # GitHub OAuth button
                {
                    "type": "frame",
                    "id": "githubBtn",
                    "name": "GitHubButton",
                    "clip": True,
                    "width": "fill_container",
                    "height": 48,
                    "fill": "#04080b",
                    "cornerRadius": 8,
                    "stroke": "#333333",
                    "strokeWidth": 1,
                    "gap": 10,
                    "padding": [0, 20],
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "githubIcon",
                            "name": "Icon",
                            "fill": "#FFFFFF",
                            "content": "⬛",
                            "fontFamily": "Inter",
                            "fontSize": 20,
                            "fontWeight": "bold"
                        },
                        {
                            "type": "text",
                            "id": "githubLabel",
                            "name": "Label",
                            "fill": "#FFFFFF",
                            "content": "Continue with GitHub",
                            "fontFamily": "Inter",
                            "fontSize": 16,
                            "fontWeight": "normal"
                        }
                    ]
                },
                # Spacer
                {"type": "frame", "id": make_id(), "name": "Spacer", "width": "fill_container", "height": "fill_container", "fill": "transparent"},
                # Sign Up link
                {
                    "type": "frame",
                    "id": "signupRow",
                    "name": "SignUpRow",
                    "width": "fill_container",
                    "fill": "transparent",
                    "gap": 6,
                    "justifyContent": "center",
                    "alignItems": "center",
                    "children": [
                        {
                            "type": "text",
                            "id": "noAccount",
                            "name": "NoAccountText",
                            "fill": "#888888",
                            "content": "Don't have an account?",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                        },
                        {
                            "type": "text",
                            "id": "signupLink",
                            "name": "SignUpLink",
                            "fill": "#e10908",
                            "content": "Sign Up",
                            "fontFamily": "Inter",
                            "fontSize": 14,
                            "fontWeight": "normal"
                        }
                    ]
                }
            ]
        }
    ]
}

# Add the new frame to children
data["children"].append(login_frame)

# Write back
with open(PEN_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✅ Added 'Login' frame to {PEN_PATH}")
print(f"📦 Backup saved to {BACKUP_PATH}")
