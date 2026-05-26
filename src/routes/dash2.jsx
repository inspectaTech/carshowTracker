import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Layers, MessageSquare, Compass, Award, Shield, User, Heart, Share2, Eye, Plus } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/dash2')({ component: Dash2Page })

// Mock Dataset for Premium Stacking Slides (Features of CarShow Tracker)
const PILING_SLIDES = [
  {
    id: 1,
    title: "CARSHOW TRACKER",
    subtitle: "The Ultimate Experience",
    description: "Welcome to the future of car show management and analytics. Swipe or scroll to stack your features and explore what makes our tracking system unique.",
    color: "from-indigo-950/90 to-zinc-950",
    accent: "text-indigo-400",
    icon: <Car className="h-16 w-16 text-indigo-400" />
  },
  {
    id: 2,
    title: "REAL-TIME TRACKING",
    subtitle: "Precision Live Syncing",
    description: "Monitor registrations, arrivals, and vehicle data in real time. Features seamless background database connection with instant dashboard telemetry metrics.",
    color: "from-emerald-950/90 to-zinc-950",
    accent: "text-emerald-400",
    icon: <Compass className="h-16 w-16 text-emerald-400" />
  },
  {
    id: 3,
    title: "AERODYNAMIC DESIGN",
    subtitle: "Premium High-End Visuals",
    description: "Engineered with Awwwards-level scrollytelling capabilities, smooth GPU-accelerated HTML5 canvas renderings, and elegant cinematic overlays.",
    color: "from-rose-950/90 to-zinc-950",
    accent: "text-rose-400",
    icon: <Award className="h-16 w-16 text-rose-400" />
  },
  {
    id: 4,
    title: "ENTERPRISE SECURITY",
    subtitle: "Safe & Redundant Systems",
    description: "Robust data structures designed for maximum up-time. Your collection records, venue locations, and organizer profiles are secured at every layer.",
    color: "from-amber-950/90 to-zinc-950",
    accent: "text-amber-400",
    icon: <Shield className="h-16 w-16 text-amber-400" />
  },
  {
    id: 5,
    title: "CARSHOW TRACKER",
    subtitle: "Built With Passion",
    description: "",
    color: "from-zinc-950 to-zinc-950",
    accent: "text-blue-400",
    icon: null,
    isFooter: true,
  },
]

// Mock Dataset for premium scrollable activity feed
const FEED_ITEMS = [
  {
    id: 1,
    user: "@supercar_spotteur",
    avatar: "SS",
    avatarColor: "bg-indigo-500",
    time: "2 hours ago",
    title: "Spotted a pristine Porsche 911 GT3 RS",
    content: "Captured this beautiful shark blue GT3 RS during the morning roll-in at our virtual tracking venue. Perfect paint, aerodynamic wing, pure class.",
    likes: 124,
    comments: 18,
    views: "1.2k"
  },
  {
    id: 2,
    user: "@track_leader",
    avatar: "TL",
    avatarColor: "bg-emerald-500",
    time: "4 hours ago",
    title: "V8 Classic Muscle Show is live!",
    content: "Registrations are fully checked-in. We have over 85 classic muscle cars lined up in the central lot. Tune into the live telemetry dashboard.",
    likes: 98,
    comments: 12,
    views: "892"
  },
  {
    id: 3,
    user: "@carbon_works",
    avatar: "CW",
    avatarColor: "bg-rose-500",
    time: "1 day ago",
    title: "Exotic Carbon Fiber components showcase",
    content: "Deep diving into internal component styling. Here is a breakdown of our high-end carbon fiber wing elements and aerodynamic undertrays.",
    likes: 215,
    comments: 42,
    views: "2.4k"
  },
  {
    id: 4,
    user: "@auto_admin",
    avatar: "AA",
    avatarColor: "bg-amber-500",
    time: "2 days ago",
    title: "Database Syncing Updates Complete",
    content: "Improved MongoDB aggregation pipeline latency. Real-time statistics are now pushing 45% faster down to client routers.",
    likes: 64,
    comments: 5,
    views: "412"
  },
  {
    id: 5,
    user: "@vintage_revival",
    avatar: "VR",
    avatarColor: "bg-purple-500",
    time: "3 days ago",
    title: "1967 Shelby Mustang GT500 Fastback",
    content: "Confirmed entry for our upcoming Summer Classic. Beautiful raven black with gold stripes. You don't want to miss the exhaust note on this one.",
    likes: 310,
    comments: 55,
    views: "3.1k"
  }
]

function Dash2Page() {
  const [activeTab, setActiveTab] = useState(0) // 0 = Piling Stack, 1 = Feed
  const [currentSlide, setCurrentSlide] = useState(0) // Stacking slide index

  // Touch and wheel event locks
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const isTransitioning = useRef(false)
  const pilingRef = useRef(null)

  const SWIPE_THRESHOLD = 50
  const ANIMATION_COOLDOWN = 600

  // Touch Start capture
  const handleTouchStart = (e) => {
    touchStartY.current = e.targetTouches[0].clientY
  }

  // Touch Move capture
  const handleTouchMove = (e) => {
    touchEndY.current = e.targetTouches[0].clientY
  }

  // Touch End evaluation
  const handleTouchEnd = () => {
    if (isTransitioning.current) return
    const startY = touchStartY.current
    const endY = touchEndY.current
    const swipeDistance = startY - endY

    if (swipeDistance > SWIPE_THRESHOLD && currentSlide < PILING_SLIDES.length - 1) {
      triggerSlideChange(currentSlide + 1)
    } else if (swipeDistance < -SWIPE_THRESHOLD && currentSlide > 0) {
      triggerSlideChange(currentSlide - 1)
    }

    touchStartY.current = 0
    touchEndY.current = 0
  }

  const triggerSlideChange = (nextIndex) => {
    isTransitioning.current = true
    setCurrentSlide(nextIndex)
    setTimeout(() => {
      isTransitioning.current = false
    }, ANIMATION_COOLDOWN)
  }

  // Non-passive wheel event listener to lock viewport and trigger pile navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (activeTab !== 0) return
      
      // Prevent default page scrolling
      e.preventDefault()
      
      if (isTransitioning.current) return
      
      if (e.deltaY > 0 && currentSlide < PILING_SLIDES.length - 1) {
        triggerSlideChange(currentSlide + 1)
      } else if (e.deltaY < 0 && currentSlide > 0) {
        triggerSlideChange(currentSlide - 1)
      }
    }

    const el = pilingRef.current
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (el) {
        el.removeEventListener('wheel', handleWheel)
      }
    }
  }, [activeTab, currentSlide])

  return (
    <div className="relative w-screen h-[calc(100vh-73px)] overflow-hidden bg-zinc-950 text-white flex flex-col select-none">
      
      {/* Horizontal View Slider */}
      <div 
        className="flex-1 flex w-[200vw] h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeTab * 100}vw)` }}
      >
        
        {/* VIEW 1: PREMIUM PAGE PILING CARD LAYERED SYSTEM */}
        <div
          ref={pilingRef}
          className="w-screen h-full relative overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress / Navigation Dot System */}
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
            {PILING_SLIDES.map((_, index) => {
              const isActive = index === currentSlide
              return (
                <button
                  key={index}
                  onClick={() => !isTransitioning.current && triggerSlideChange(index)}
                  className="relative p-2 focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div 
                    className="rounded-full bg-white"
                    animate={{
                      height: isActive ? 28 : 8,
                      width: isActive ? 10 : 8,
                      opacity: isActive ? 1 : 0.35,
                      backgroundColor: isActive ? "#ffffff" : "#6b7280"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </button>
              )
            })}
          </div>

          {/* Core Page Pile Stacking Wrapper */}
          <AnimatePresence mode="popLayout">
            {PILING_SLIDES.map((slide, index) => {
              if (index > currentSlide) return null

              return (
                <motion.div
                  key={slide.id}
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 bg-gradient-to-br ${slide.color} border-b border-white/5`}
                  style={{ zIndex: index }}
                  initial={index === currentSlide ? { y: '100%', opacity: 0 } : false}
                  animate={{ 
                    y: '0%',
                    opacity: index === currentSlide ? 1 : 0
                  }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 130,
                    restDelta: 0.001
                  }}
                >
                  {slide.isFooter ? (
                    <div className="w-full h-full overflow-y-auto flex items-center justify-center">
                      <Footer />
                    </div>
                  ) : (
                    <div className="max-w-xl text-center flex flex-col items-center">
                      <motion.div 
                        className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {slide.icon}
                      </motion.div>
                      
                      <motion.span 
                        className={`text-xs md:text-sm font-mono tracking-widest uppercase ${slide.accent} mb-3 block`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {slide.subtitle}
                      </motion.span>
                      
                      <motion.h1 
                        className="text-4xl md:text-6xl font-black tracking-tighter text-white/95 mb-6 leading-none"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {slide.title}
                      </motion.h1>
                      
                      <motion.p 
                        className="text-sm md:text-base text-white/60 leading-relaxed max-w-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {slide.description}
                      </motion.p>
                      
                      <motion.div 
                        className="mt-12 flex items-center justify-center gap-2 text-white/30 text-xs font-mono tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span>Scroll Down or Swipe Up</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* VIEW 2: ISOLATED HIGH-PERFORMANCE NATIVE SCROLL FEED */}
        <div className="w-screen h-full overflow-y-auto bg-zinc-950 p-6 md:p-12 pb-28 select-text">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/5 py-4 z-40 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white/90">
                  User Activity Feed
                </h2>
                <p className="text-sm text-white/50 font-mono mt-0.5">Live tracking updates from the field</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-600/20 shadow-indigo-600/10">
                <Plus className="h-4 w-4" />
                <span>Post Update</span>
              </button>
            </div>

            <div className="space-y-6">
              {FEED_ITEMS.map((item) => (
                <div 
                  key={item.id} 
                  className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-sm hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl ${item.avatarColor} flex items-center justify-center font-bold text-white shadow-inner font-mono`}>
                        {item.avatar}
                      </div>
                      <div>
                        <span className="font-semibold text-indigo-400 block text-sm tracking-wide">{item.user}</span>
                        <span className="text-xs text-white/40 font-mono">{item.time}</span>
                      </div>
                    </div>
                    <span className="text-xs text-white/30 font-mono flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
                      <Eye className="h-3.5 w-3.5" />
                      {item.views}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white/90 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-6 border-t border-white/5 pt-4 text-white/50 text-xs font-mono">
                    <button className="flex items-center gap-2 hover:text-rose-400 transition-colors group">
                      <Heart className="h-4 w-4 group-hover:fill-rose-400" />
                      <span>{item.likes} Likes</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.comments} Comments</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* STATIC APP-STYLE BOTTOM NAVIGATION DOCK */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-950/90 border-t border-white/5 backdrop-blur-lg flex justify-around items-center z-50 px-6">
        <button
          onClick={() => setActiveTab(0)}
          className={`flex flex-col items-center justify-center gap-1.5 py-2 px-6 rounded-xl transition-all duration-300 ${activeTab === 0 ? 'text-indigo-400 bg-white/5 border border-white/10' : 'text-white/40 hover:text-white/60'}`}
        >
          <Layers className="h-5 w-5" />
          <span className="text-xs font-semibold tracking-wide uppercase font-mono">Piling Stack</span>
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`flex flex-col items-center justify-center gap-1.5 py-2 px-6 rounded-xl transition-all duration-300 ${activeTab === 1 ? 'text-indigo-400 bg-white/5 border border-white/10' : 'text-white/40 hover:text-white/60'}`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-semibold tracking-wide uppercase font-mono">Vertical Feed</span>
        </button>
      </div>

    </div>
  )
}
