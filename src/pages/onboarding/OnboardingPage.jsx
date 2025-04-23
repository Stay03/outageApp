import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../hooks/useOnboarding';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import './OnboardingPage.css'; // Import custom CSS for Montserrat font

// Import the GIFs
import powerGif from '../../assets/power.gif';
import analysisGif from '../../assets/analysis.gif';
import chargeGif from '../../assets/charge.gif';

// Loading screen
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white">
    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 font-medium font-inter">Loading resources...</p>
  </div>
);

// Track & Monitor Screen
const TrackMonitorScreen = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-6 onboarding-gif-container"
    >
      <div className="relative w-64 h-64 mb-4 flex items-center justify-center">
        <motion.img 
          src={powerGif} 
          alt="Power outage tracking illustration" 
          className="object-contain max-h-full rounded-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-center px-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-2 font-inter">Track Power Outages in Real-Time</h2>
      <p className="text-gray-600 leading-relaxed max-w-sm font-inter">
        Keep a detailed record of when power goes out and comes back on at your important locations.
      </p>
    </motion.div>
  </div>
);

// Analyze & Understand Screen
const AnalyzeUnderstandScreen = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8"
    >
      <div className="relative w-72 h-72 mb-6 flex items-center justify-center">
        <motion.img 
          src={analysisGif} 
          alt="Data visualization and analysis" 
          className="object-contain max-h-full rounded-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-center px-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-2 font-inter">Discover Patterns & Correlations</h2>
      <p className="text-gray-600 leading-relaxed max-w-sm font-inter">
        Gain insights into what causes outages in your area and how long they typically last.
      </p>
    </motion.div>
  </div>
);

// Prepare & Plan Screen
const PreparePlanScreen = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8"
    >
      <div className="relative w-72 h-72 mb-6 flex items-center justify-center">
        <motion.img 
          src={chargeGif} 
          alt="Preparation and planning" 
          className="object-contain max-h-full rounded-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-center px-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-2 font-inter">Be Prepared, Stay Powered</h2>
      <p className="text-gray-600 leading-relaxed max-w-sm font-inter">
        Use historical patterns to prepare for future outages and minimize disruption to your life.
      </p>
    </motion.div>
  </div>
);

/**
 * Onboarding Page Component
 * Manages the display and navigation between onboarding screens
 */
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { 
    currentScreenIndex, 
    setCurrentScreenIndex, 
    completeOnboarding, 
    hasCompletedOnboarding,
    skipOnboarding
  } = useOnboarding();
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Preload all images before showing the onboarding
  useEffect(() => {
    const imageUrls = [powerGif, analysisGif, chargeGif];
    let loadedCount = 0;
    
    const preloadImages = () => {
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${url}`);
          // Still increment counter to avoid blocking if an image fails
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            setImagesLoaded(true);
          }
        };
      });
    };
    
    preloadImages();
  }, []);
  
  const screens = [
    <TrackMonitorScreen key="track" />, 
    <AnalyzeUnderstandScreen key="analyze" />, 
    <PreparePlanScreen key="prepare" />
  ];
  
  // Handle swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
    
    if (isRightSwipe && currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };
  
  // Redirect if onboarding is already completed
  useEffect(() => {
    if (hasCompletedOnboarding) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasCompletedOnboarding, navigate]);
  
  // Handle navigation button clicks
  const handleNext = () => {
    if (currentScreenIndex === screens.length - 1) {
      // If on the last screen, complete onboarding
      completeOnboarding();
      navigate('/dashboard', { replace: true });
    } else {
      // Otherwise, go to the next screen
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };
  
  const handleSkip = () => {
    skipOnboarding();
    navigate('/dashboard', { replace: true });
  };
  
  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.1
      }
    }
  };
  
  // Show loading screen until all images are loaded
  if (!imagesLoaded) {
    return <LoadingScreen />;
  }
  
  return (
    <div 
      className="flex flex-col min-h-screen max-h-screen bg-white overflow-hidden font-inter"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
    >
 
      
      {/* Main content area - reduced height to ensure buttons are visible */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreenIndex}
            className="w-full h-full flex items-center justify-center"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {screens[currentScreenIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress indicators */}
      <motion.div 
        className="flex justify-center space-x-3 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {screens.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentScreenIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentScreenIndex 
                ? 'w-10 bg-blue-500' 
                : 'w-2 bg-gray-300'
            }`}
            whileHover={{
              scale: index === currentScreenIndex ? 1.1 : 1.5,
            }}
            whileTap={{
              scale: 0.9,
            }}
          />
        ))}
      </motion.div>
      
      {/* Navigation buttons */}
      <motion.div 
        className="flex justify-between items-center p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Back button (hidden on first screen) */}
        {currentScreenIndex > 0 ? (
          <motion.button 
            onClick={handlePrev}
            className="flex items-center text-gray-700 font-medium px-4 py-2 rounded-full font-inter"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft size={20} className="mr-1" /> Back
          </motion.button>
        ) : (
          <div className="w-24"></div>
        )}
        
        {/* Next/Get Started button */}
        <motion.button 
          onClick={handleNext}
          className="bg-blue-500 text-white py-3 px-8 rounded-full font-medium flex items-center shadow-md font-inter"
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
        >
          {currentScreenIndex === screens.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight size={20} className="ml-1" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;