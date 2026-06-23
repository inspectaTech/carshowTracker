# CST Dashboard — Design Spec

**Date:** June 9, 2026
**Source:** User description of cst_dash_ref.jpg

---

## Typography Scale

| Tag | Size | Usage |
|-----|------|-------|
| H1 | 32 | *(reserved — not currently used)* |
| H2 | 28 | Stat values (2.4K, 47, 12...), usernames |
| H3 | 20 | Section titles, profile name |
| H4 | 16 | Sidebar labels, menu items |
| H5 | 14 | Body text, most content |
| H6 | 12 | Captions, subtitles, timestamps |

---

## Layout Foundation

- **Sidebar** (left, thin column) — `#04080b` background
- **Main Content** (right) — Two sections, each ~half view height

## Color Archive

### Current Palette

| Name | Color | Used On |
|------|-------|---------|
| **Alt background** | `#04080b` | Root container, sidebar, main content area |
| **Alt section background** | `#0a0d12` |  card backgrounds |
| **Sidebar Menu Active** | `#0e1116` | Selected nav item (`Nav_Dashboard`) |

### Archived / Replaced Colors

| Original Color | Replaced With | Previously Used On |
|----------------|---------------|-------------------|
| `#1A1A1A` | `#0a0d12` | Selected nav item bg, card backgrounds |
| `#0A0A0A` | `#04080b` | Root container, main content area |
| `#000000` | `#04080b` | Sidebar background |
| `#E53935` | `#e10908` | Red accents (borders, icons, buttons) |
| `#0a0d12` | `#0e1116` | Selected nav item (`Nav_Dashboard`) |


---

## Global Design Notes

- **ALL icons are white outlines** (line drawings, not filled, not brand-colored)
- All components **except the top 2** have rounded corners + dark gray background
- Most text is `#FFFFFF`

---

## Sidebar

### Colors

| Element | Color |
|---------|-------|
| Background | `#04080b` (alt background) |
| Selected menu item bg | Dark gray / off-black |
| Unselected menu items | Flat black or transparent |
| Selected item left border | Red, thickened |
| Text | `#FFFFFF` (white) |
| View Profile button | Red |

### Section 1: Logo + Navigation Menu

**Logo:** Image/placeholder for "Car Show" brand at top

**Menu Item (reusable component):**
- Inner red left border — visible only when selected
- White outline icon (left)
- Text label (right)

| # | Icon | Label | State |
|---|------|-------|-------|
| 1 | House | Dashboard | **Selected** (dark gray bg + red border) |
| 2 | Magnifying Glass | Explore | Default |
| 3 | Car | Garage | Default |
| 4 | People/Group | Community | Default |
| 5 | Calendar | My Events | Default |
| 6 | Newspaper | News | Default |
| 7 | Shopping Cart | Pit Shop | Default |
| 8 | T-Shirt / Clothing | Merch | Default |

### Section 2: Profile + Bottom Menu

**Profile Block:**
- Avatar circle (placeholder)
- Username text (white)
- Red "View Profile" button

**Bottom Menu (same item structure):**
| Icon | Label |
|------|-------|
| Settings Cog | Settings |
| Door + Arrow | Logout |

---

## Main Content — Top Section

Full width, ~50% view height. 3-component grid:
- Top row: 2 components side by side (50% each, ~70% height) + floating overlays
- Bottom row: 1 component (full width, ~30% height, dark gray bg)

### Component 1: User Profile Card

Two-part flexbox: car image (left) + text (right)

**Left:** Large circular car image with **red right border** (rounded)

**Right (stacked, white text):**
- "Gearhead_23" + red verified checkmark
- "@gearhead_23"
- "Cars are my passion. Speed is my therapy. Built not bought."
- Row: 📍 Los Angeles, CA | 📅 Joined May 2022
- IG / YT / TikTok (white outline icons, not brand colored)

### Component 2: Hero / Ad Image

- Site-controlled splash image for advertisements

### Floating Overlays (TopRow, absolute positioned)

These 3 elements are children of the **TopRow** frame, not AdImage, and float over the AdImage area:

| Element | Position | Description |
|---------|----------|-------------|
| 🔔 Notification bell | Top-right `(1060, 10)` | White outline lucide bell icon |
| ⚙️ Settings cog | Top-right `(1092, 10)` | White outline lucide settings icon |
| ✏️ Edit Profile button | Bottom-right `(960, 278)` | White bordered frame with pencil icon + "Edit Profile" text |

### Component 3: Stats Bar (5 displays, full width)

Red icon (30% left) + stacked text (70% right). Title (big) / Subtitle (small).

| # | Icon (outline) | Title | Subtitle |
|---|------|-------|----------|
| 1 | Odometer | 2.4K | Total Points |
| 2 | Trophy | 47 | Badges |
| 3 | Car | 12 | Cars in Garage |
| 4 | People | 1.8K | Followers |
| 5 | Chat Bubble | 320 | Following |

---

## Main Content — Bottom Section

~50% view height. Grid: Left (~23%) + Right (~77%, stacked)

### Component 4: About Me (left)

- Title "About Me" + short red underline under first ~3 letters
- Bio paragraph (white): "Car enthusiast since day one. I live for weekend drives, track days, and late night builds. JDM at heart. Always chasing the next build."
- 4 info items: circle outline icon + title (white) + description (red)

| Icon (circle outline) | Title | Description |
|------|-------|-------------|
| Star | Favorite Brand | Nissan |
| Star | Dream Car | Nissan GT-R R34 |
| Camera | Occupation | Automotive Photographer |
| Clock | Drive | Performance & Style |

### Component 5: My Garage (right-top)

Title bar: "My Garage" (left) + "View All >" red text (right)

4 car cards — `border-left: 1px solid red`, inline specs with · separator

| Title | Specs |
|-------|------|
| Nissan GT-R R34 | 2000 · 600 HP · AWD |
| Toyota Supra MK4 | 1998 · 320 HP · RWD |
| Honda Civic Type R | 2021 · 306 HP · FWD |
| Mazda RX-7 FD | 1995 · 276 HP · RWD |

### Component 6: My Highway (right-bottom)

Title bar: "My Highway" (left) + "View All >" red text (right)

50/50 split below:

**Left — Activity Feed:**
- Large image + 3 text rows: "Posted a new photo" / "Nissan GT-R R34 at Angeles Crest Hwy" / "2h ago"

**Right — Stats (white outline icons):**
- Heart outline 128 likes | Chat outline 16 comments | ⋯ horizontal 3-dot menu

---

## Layout Foundation

- **Sidebar** (left, thin column) — dark background
- **Main Content** (right, larger area) — Two sections, each ~half view height

---

## Main Content — Top Section (3-component grid)

Full width, ~50% view height. 3 components in a grid:
- **Top row:** 2 components side by side (50% width each, ~70% of section height) + floating overlays
- **Bottom row:** 1 component (full width, ~30% of section height)
- Top 2 components: black/transparent background
- Bottom component: dark gray background

### Component 1: User Profile Card

Two-part flexbox: car image (left) + text stats (right)

**Left:** Large circular user car image with **red right border** — rounded, matching container shape.

**Right text section (stacked):**
1. "Gearhead_23" — with red verified checkmark (like Twitter)
2. "@gearhead_23" — username handle
3. "Cars are my passion. Speed is my therapy. Built not bought." — description
4. Row: 📍 Los Angeles, CA | 📅 Joined May 2022
5. Three white social icons: Instagram, YouTube, TikTok (not brand colored)

### Component 2: Hero / Ad Image

- Site-controlled splash image for advertisements

### Component 3: Stats Bar (5 displays across full width)

Each display: red icon (30% left) + stacked text (70% right)
Larger title text on top, smaller subtitle below.

| # | Icon | Title | Subtitle |
|---|------|-------|----------|
| 1 | Odometer | 2.4K | Total Points |
| 2 | Trophy | 47 | Badges |
| 3 | Car | 12 | Cars in Garage |
| 4 | People/Group | 1.8K | Followers |
| 5 | Chat Bubble | 320 | Following |

---

## Sidebar Colors

| Element | Color |
|---------|-------|
| Background | #04080b (alt background) |
| Selected menu item bg | Dark gray / off-black |
| Unselected menu items | Flat black or transparent |
| Selected item left border | Red, thickened |
| Text | #FFFFFF (white) |
| View Profile button | Red |

---

## Sidebar — Section 1: Logo + Navigation Menu

### Logo
- Image/placeholder for "Car Show" brand at top

### Menu Item Structure (reusable component)
Each item container has:
- **Inner red left border** — visible only when selected (not outer container border)
- **Icon** (left-aligned)
- **Text label** (right of icon)

| # | Icon | Label | State |
|---|------|-------|-------|
| 1 | House | Dashboard | Selected (dark gray bg + red border) |
| 2 | Magnifying Glass | Explore | Default |
| 3 | Car | Garage | Default |
| 4 | People/Group | Community | Default |
| 5 | Calendar | My Events | Default |
| 6 | Newspaper | News | Default |
| 7 | Shopping Cart | Pit Shop | Default |
| 8 | T-Shirt / Clothing | Merch | Default |

---

## Sidebar — Section 2: Profile + Bottom Menu

### Profile Block
- Avatar circle (placeholder profile image)
- Username text (white)
- Red "View Profile" button

### Bottom Menu Items (same structure as main menu)
| # | Icon | Label |
|---|------|-------|
| 1 | Settings Cog | Settings |
| 2 | Door + Arrow | Logout |

---

## Design Principles

- Build menu items as reusable components (dynamic add/remove)
- Red border is an inner accent line, not the outer container border
- Most dashboard text is white
- Maintain two-section grid: Sidebar | Main Content
