## Here is a comprehensive deployment plan specifically formatted for you to copy and paste directly into your AntiGravity agent. It provides all architectural requirements, dependencies, and code structures needed to generate the build automatically.

## 📋 AntiGravity Agent Instruction Blueprint: Split View App (Page-Piling & Native Feed)

Objective:
Build a responsive, single-page web layout optimized for mobile app viewports. The interface splits horizontally into two distinct core views via a fixed bottom navigation system: View 1 features a vertical, layered "page-piling" card presentation stack, and View 2 features a standard native vertically scrolling user activity feed.

---

## 1. Project Prerequisites & Dependencies

Please ensure the following packages are initialized and available within the environment:

- framer-motion (For hardware-accelerated piling animations and state transitions)
- tailwind-css (For modern layouts, responsive viewports, and custom scroll behaviors)
- lucide-react (Optional, for clean bottom navigation iconography)

---

## 2. Architectural Code Implementation

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Dataset for Piling Layered System
const PILING_SLIDES = [
{ id: 1, text: "Welcome to Page Piling", color: "bg-indigo-600" },
{ id: 2, text: "Slide 2 Overlays Slide 1", color: "bg-emerald-600" },
{ id: 3, text: "Slide 3 Overlays Slide 2", color: "bg-rose-600" },
{ id: 4, text: "Slide 4 Overlays Slide 3", color: "bg-amber-600" },
];

// Mock Dataset for Natively Scrolling User Feed
const FEED*ITEMS = Array.from({ length: 12 }, (*, i) => ({
id: i,
user: `@user_creator_${i + 1}`,
content: "This is a standard social media or content feed item. It scrolls natively up and down without breaking any page piling animations because it lives in its own horizontal view container.",
}));

export default function AppLayout() {
const [activeTab, setActiveTab] = useState(0); // 0 = Page Piling, 1 = User Feed
const [currentSlide, setCurrentSlide] = useState(0); // Active index of stacking slides

// Custom Touch/Gesture tracking refs to isolate scrolling
const touchStartY = useRef(0);
const touchEndY = useRef(0);
const isTransitioning = useRef(false);

const SWIPE_THRESHOLD = 50;
const ANIMATION_COOLDOWN = 600;

// Capture Touch Starts safely
const handleTouchStart = (e) => {
touchStartY.current = e.targetTouches.clientY;
};

// Monitor Touch Progress without rubber-banding page boundaries
const handleTouchMove = (e) => {
touchEndY.current = e.targetTouches.clientY;
};

// Evaluate final swipe vector and execute index increment/decrement
const handleTouchEnd = () => {
if (isTransitioning.current) return;

    const startY = touchStartY.current;
    const endY = touchEndY.current;
    const swipeDistance = startY - endY;

    if (swipeDistance > SWIPE_THRESHOLD && currentSlide < PILING_SLIDES.length - 1) {
      triggerSlideChange(currentSlide + 1);
    } else if (swipeDistance < -SWIPE_THRESHOLD && currentSlide > 0) {
      triggerSlideChange(currentSlide - 1);
    }

    touchStartY.current = 0;
    touchEndY.current = 0;

};

// Handle Desktop Mouse Wheel events for the page pile
const handlePilingWheel = (e) => {
if (isTransitioning.current) return;
if (e.deltaY > 0 && currentSlide < PILING_SLIDES.length - 1) {
triggerSlideChange(currentSlide + 1);
} else if (e.deltaY < 0 && currentSlide > 0) {
triggerSlideChange(currentSlide - 1);
}
};

const triggerSlideChange = (nextIndex) => {
isTransitioning.current = true;
setCurrentSlide(nextIndex);
setTimeout(() => {
isTransitioning.current = false;
}, ANIMATION_COOLDOWN);
};

return (
<div className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white flex flex-col select-none">

      {/* 200vw Master Horizontal Slider Wrapper */}
      <div
        className="flex-1 flex w-[200vw] h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeTab * 50}vw)` }}
      >

        {/* VIEW 1: LAYERED PAGE PILING INFRASTRUCTURE */}
        <div
          className="w-screen h-full relative overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handlePilingWheel}
        >
          {/* Vertical Smart Progress Indicator */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
            {PILING_SLIDES.map((_, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={index}
                  onClick={() => !isTransitioning.current && triggerSlideChange(index)}
                  className="relative p-2 focus:outline-none"
                  aria-label={`Navigate to slide ${index + 1}`}
                >
                  <motion.div
                    className="rounded-full bg-white"
                    animate={{
                      height: isActive ? 24 : 8,
                      width: 8,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </button>
              );
            })}
          </div>

          {/* Core Page Pile Stacking Animations */}
          <AnimatePresence mode="popLayout">
            {PILING_SLIDES.map((slide, index) => {
              if (index > currentSlide) return null;

              return (
                <motion.div
                  key={slide.id}
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${slide.color}`}
                  style={{ zIndex: index }}
                  initial={index === currentSlide ? { y: '100%' } : false}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{
                    type: 'spring',
                    damping: 26,
                    stiffness: 140,
                    restDelta: 0.001
                  }}
                >
                  <h1 className="text-3xl font-extrabold mb-2 text-center">{slide.text}</h1>
                  <p className="text-sm opacity-70 bg-black/20 px-3 py-1 rounded-full">
                    Swipe or Scroll to Stack
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* VIEW 2: COMPLETELY ISOLATED HIGH-PERFORMANCE NATIVE USER FEED */}
        <div className="w-screen h-full overflow-y-auto p-6 bg-zinc-900 pb-24 select-text">
          <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-zinc-900/90 backdrop-blur py-3">
            User Activity Feed
          </h2>
          <div className="space-y-4">
            {FEED_ITEMS.map((item) => (
              <div key={item.id} className="p-5 bg-zinc-800 rounded-xl border border-zinc-700/50">
                <span className="font-semibold text-indigo-400 block mb-1">{item.user}</span>
                <p className="text-zinc-300 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* STATIC APP-STYLE BOTTOM NAVIGATION DOCK */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-900/95 border-t border-zinc-800 backdrop-blur flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex flex-col items-center gap-1 text-sm font-medium transition-colors ${activeTab === 0 ? 'text-indigo-400' : 'text-zinc-500'}`}
        >
          <span className="text-base font-semibold">Piling Stack</span>
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex flex-col items-center gap-1 text-sm font-medium transition-colors ${activeTab === 1 ? 'text-indigo-400' : 'text-zinc-500'}`}
        >
          <span className="text-base font-semibold">Vertical Feed</span>
        </button>
      </div>

    </div>

);
}

---

## 3. Execution Requirements for the AntiGravity Agent

When parsing this configuration, execute the layout with these structural considerations:

1.  Strict Viewport Constraints: Ensure the parent viewport container maintains w-screen, h-screen, and overflow-hidden at all times to simulate an immersive, native mobile application shell.
2.  Scroll Protection Real Estate: Keep the Piling Container bounded strictly under touch-none styling classes to suppress deep browser default behaviors (like rubber-banding or text selections) when interpreting gesture swiping velocities.
3.  Feed Freedom Rules: Ensure the Activity Feed column remains explicitly styled with select-text and overflow-y-auto rules, enabling regular native web viewport properties when users click over to read through feed items.

---

When you are ready to expand this app or hook up custom features, let me know if you would like to build connected database controllers or implement custom dark-mode color themes!
