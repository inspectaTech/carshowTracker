import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const HeroScroll = ({ 
  headline = "THE FUTURE OF TRACKING",
  feature1 = "AERODYNAMIC PRECISION",
  description1 = "Engineered for maximum downforce and stability. Every curve serves a purpose in the pursuit of pure velocity.",
  feature2 = "MECHANICAL EXCELLENCE",
  description2 = "Precision-tuned internal components revealed. A symphony of mechanical innovation and digital tracking.",
  cta = "DRIVE THE EXPERIENCE",
  ctab = "GET STARTED",
  frameCount = 41,
  folderPath = "/animations/hero-test-001",
  fileNamePrefix = "ezgif-frame-",
  fileNameSuffix = "",
  fileExt = "jpg",
  lastFrameHold = 0.2, // Percentage of scroll to hold the last frame (0 to 1)
  // Mobile variants
  mobileFrameCount,
  mobileFolderPath,
  mobileFileNamePrefix,
  mobileFileNameSuffix,
  mobileFileExt,
  mobileLastFrameHold
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute active config
  const activeConfig = useMemo(() => {
    if (isMobile) {
      return {
        frameCount: mobileFrameCount ?? frameCount,
        folderPath: mobileFolderPath ?? folderPath,
        fileNamePrefix: mobileFileNamePrefix ?? fileNamePrefix,
        fileNameSuffix: mobileFileNameSuffix ?? fileNameSuffix,
        fileExt: mobileFileExt ?? fileExt,
        lastFrameHold: mobileLastFrameHold ?? lastFrameHold,
      };
    }
    return {
      frameCount,
      folderPath,
      fileNamePrefix,
      fileNameSuffix,
      fileExt,
      lastFrameHold,
    };
  }, [isMobile, frameCount, folderPath, fileNamePrefix, fileNameSuffix, fileExt, lastFrameHold, mobileFrameCount, mobileFolderPath, mobileFileNamePrefix, mobileFileNameSuffix, mobileFileExt, mobileLastFrameHold]);

  // Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress (0 to 1) to frame index (0 to frameCount - 1)
  // Reaches the last frame at (1 - lastFrameHold) and holds it until the end
  const frameIndex = useTransform(
    scrollYProgress, 
    [0, 1 - activeConfig.lastFrameHold], 
    [0, activeConfig.frameCount - 1],
    { clamp: true }
  );



  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];
    setIsLoading(true);
    setLoadProgress(0);

    const preloadImages = async () => {
      const promises = [];
      const { frameCount, folderPath, fileNamePrefix, fileNameSuffix, fileExt } = activeConfig;
      
      for (let i = 1; i <= frameCount; i++) {
        const indexStr = i.toString().padStart(3, '0');
        const src = `${folderPath}/${fileNamePrefix}${indexStr}${fileNameSuffix}.${fileExt}`;
        
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / frameCount) * 100));
            resolve(img);
          };
          img.onerror = () => {
            console.warn(`Failed to load frame: ${src}`);
            resolve(null); // Continue loading even if one fails
          };
        });
        
        img.src = src;
        loadedImages[i - 1] = img;
        promises.push(promise);
      }

      try {
        await Promise.all(promises);
        setImages(loadedImages.filter(img => img !== null));
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load images", err);
      }
    };

    preloadImages();
  }, [activeConfig]);


  // Draw to canvas
  const render = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;

    const ctx = canvas.getContext('2d');
    const img = images[Math.round(index)];
    
    if (img) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate contain fit
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (canvasAspect > imgAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  // Update canvas on frame change
  useMotionValueEvent(frameIndex, "change", (latest) => {
    render(latest);
  });

  // Initial render and resize handling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      render(frameIndex.get());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameIndex]);

  // Milestone calculation based on usable scroll (before hold)
  const animEnd = 1 - activeConfig.lastFrameHold;

  
  const headlineOpacity = useTransform(scrollYProgress, (v) => v > (animEnd * 0.2) ? 0 : 1);
  const feature1Opacity = useTransform(scrollYProgress, (v) => (v > (animEnd * 0.3) && v < (animEnd * 0.55)) ? 1 : 0);
  const feature2Opacity = useTransform(scrollYProgress, (v) => (v > (animEnd * 0.65) && v < (animEnd * 0.95)) ? 1 : 0);
  const ctaOpacity = useTransform(scrollYProgress, (v) => v >= animEnd ? 1 : 0);



  // Commented out smooth fades
  /*
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const feature1Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 1, 0]);
  const feature2Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  */


  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-sm font-mono tracking-widest uppercase opacity-60">
              Loading {loadProgress}%
            </p>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-full object-contain"
        />

        {/* Overlays */}
        {!isLoading && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 md:p-20">

            {/* 0% Headline */}
            <motion.div 
              style={{ opacity: headlineOpacity }}
              className="absolute text-center"
            >
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/90">
                {headline}
              </h1>
              <p className="mt-4 text-white/40 font-mono tracking-widest uppercase text-sm">
                Scroll to explore
              </p>
            </motion.div>

            {/* 30% Feature 1 - Left */}
            <motion.div 
              style={{ opacity: feature1Opacity }}
              className="absolute left-8 md:left-20 max-w-md"
            >
              <h2 className="text-2xl md:text-4xl font-semibold text-white/90 mb-4">
                {feature1}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {description1}
              </p>
            </motion.div>

            {/* 60% Feature 2 - Right */}
            <motion.div 
              style={{ opacity: feature2Opacity }}
              className="absolute right-8 md:right-20 text-right max-w-md"
            >
              <h2 className="text-2xl md:text-4xl font-semibold text-white/90 mb-4">
                {feature2}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {description2}
              </p>
            </motion.div>

            {/* 90% CTA */}
            <motion.div 
              style={{ opacity: ctaOpacity }}
              className="absolute text-center"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-white/90 mb-8">
                {cta}
              </h2>
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all pointer-events-auto transform hover:scale-105 active:scale-95">
                {ctab}
              </button>

            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HeroScroll;
