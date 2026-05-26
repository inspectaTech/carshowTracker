# Prompts

#### Landing page design promp

I would like to plan some Landing page designs Using pencil. The landing page is for the Car Show Tracker social network site. I'm not sure what should be on the page so i am open for suggestions. We have already produced a landing page that I like so many of the things we added to that page can be reproduced on the new designs. I may want multiple designs that may include different elements in the design visuals. I also want elegant modern designs.

#### Scroll Animation Prompt

ACT AS:
A world-class Creative Developer (Awwwards-level) specializing in Next.js,
Framer Motion, and high-performance scrollytelling experiences.

THE TASK:
Build a high-end scrollytelling landing page for a product brand
called “carshowtracker”.

The core mechanic is a scroll-linked animation that plays an image sequence
of a “supercar” visually rotating around the automobile as the user scrolls down the page.

TECH STACK:

- Framework: tanstack start (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion
- Rendering: HTML5 Canvas (for performance)

VISUAL DIRECTION & COLOR:

- Seamless Blending:
  The component background MUST perfectly match the background color of the
  image sequence so the edges of the frames are completely invisible.
- Color Palette:
  Pure dark mode. Use [BACKGROUND HEX COLOR — e.g. #050505] or
  eye-drop the image background directly.
- Typography:
  [FONT FAMILY — e.g. Inter / San Francisco / Geist].
  Clean, minimalist, tracking-tight.
- Text Colors:
  Headings: text-white/90
  Body: text-white/60

IMPLEMENTATION DETAILS:

1. The Sticky Canvas

- Create a component called `HeroScroll.jsx`.
- The outer container should be h-[400vh] to allow extended scroll time.
- Inside it, render a <canvas> element that is:
  - position: sticky
  - top-0
  - h-screen
  - w-full
- The canvas must be perfectly centered and fill the viewport.

1. Scroll Logic

- Load a sequence of 41 images generated from an image splitter.
- animation images can be found in animations/hero-test-001 in the project root folder
- use variables to store the image folder location and naming convention so it can be set dynamically later by the developers
- Naming convention:
  `[FRAME_PREFIX]_[i]_[OPTIONAL SUFFIX].[ext]`
- For this use:
  `[ezgif-frame-]_[i].jpg` in which case the i is the tripple digit number incrementing from 001 to 041 at the completion of the scroll.
- Use useScroll from Framer Motion to map scroll progress (0 → 1)
  to the frame index (0 → TOTAL FRAMES - 1).
- On every scroll update:
  - Calculate the current frame index
  - Draw the corresponding image to the canvas
- Ensure smooth interpolation and no visible stutter.

1. Text Overlays (The Story)
   Overlay optional animated text sections that fade in and out as the product
   disassembles and reassembles. Provide components properties that allow dynamic input of the text

SCROLL SECTIONS (Editable):

- 0% Scroll:
  "[HERO HEADLINE]"
  (Centered)

- 30% Scroll:
  "[FEATURE / MESSAGE #1]"
  (Left aligned)
  → Product begins expanding / separating

- 60% Scroll:
  "[FEATURE / MESSAGE #2]"
  (Right aligned)
  → Product fully exploded, internal components visible

- 90% Scroll:
  "[CTA / FINAL MESSAGE]"
  (Centered)
  → Product smoothly reassembles

Text animations should be subtle, cinematic, and scroll-synced.

- After the animation ends scrolling down the page can continue normally.
- The scrolling animation should work in reverse once the header is back in view and the user is scrolling back to the top of the page. (all based off the page scroll position)

4. Polish & UX

- Add a loading state with a spinner while all images preload.
- Do NOT start scroll animation until images are fully loaded.
- Ensure the canvas scales correctly on mobile (contain fit).
- Maintain consistent aspect ratio across devices.

OUTPUT:
Generate the complete, production-ready code for:

- page.tsx
- [SCROLL COMPONENT NAME].tsx
- globals.css

Use nano banana to generate UI components if needed.
