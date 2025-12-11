import { motion as Motion } from 'framer-motion';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { useEffect, useRef, useState } from 'react';

export const HeroAddImage = () => {
  const { banners, marqueeMessages } = useAnnouncements();
  const marqueeRef = useRef(null);
  const containerRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(22);
  const [animationId] = useState(() => `marquee-${Math.random().toString(36).substr(2, 9)}`);

  // Find the first enabled hero banner
  const heroBanner = banners.find(b => b.isEnabled && b.position === 'hero');
  
  // Find the first enabled hero marquee
  const heroMarquee = marqueeMessages.find(m => m.isEnabled && m.position === 'hero');

  // Perfect marquee calculation with pixel-based positioning
  useEffect(() => {
    if (heroMarquee && marqueeRef.current && containerRef.current) {
      const timer = setTimeout(() => {
        if (!marqueeRef.current || !containerRef.current) return;
        
        // Get exact pixel measurements
        const contentWidth = marqueeRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        
        // Calculate exact pixel positions for perfect marquee behavior:
        // START: Content positioned completely off-screen to the right
        const startPosition = containerWidth; // in pixels
        
        // END: Content positioned completely off-screen to the left
        // Content must travel its entire width past the left edge
        const endPosition = -contentWidth; // in pixels
        
        // Total distance to travel
        const totalDistance = startPosition + Math.abs(endPosition);
        
        // Calculate duration based on speed setting
        // Lower speed value = faster scroll
        const baseSpeed = 80; // pixels per second (adjustable)
        const speedMultiplier = heroMarquee.speed / 22; // Normalize from admin setting
        const pixelsPerSecond = baseSpeed * speedMultiplier;
        
        const calculatedDuration = totalDistance / pixelsPerSecond;
        
        setAnimationDuration(calculatedDuration);

        // Inject dynamic keyframes with EXACT pixel positioning
        const styleId = `marquee-style-${animationId}`;
        let styleSheet = document.getElementById(styleId);
        
        if (!styleSheet) {
          styleSheet = document.createElement('style');
          styleSheet.id = styleId;
          document.head.appendChild(styleSheet);
        }

        // Use pixel values for precise control
        // This ensures the animation ends EXACTLY when content is fully off-screen
        styleSheet.textContent = `
          @keyframes ${animationId} {
            0% {
              transform: translateX(${startPosition}px);
            }
            100% {
              transform: translateX(${endPosition}px);
            }
          }
        `;
      }, 160);

      // Cleanup
      return () => {
        clearTimeout(timer);
        const sheet = document.getElementById(`marquee-style-${animationId}`);
        if (sheet) {
          sheet.remove();
        }
      };
    }
  }, [heroMarquee, animationId]);

  // Don't render if no banner is available - AFTER all hooks
  if (!heroBanner) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="hidden sm:block absolute bottom-0 right-0 z-10 w-full  md:max-w-[60%] lg:max-w-3xl"
    >
      <img
        src={heroBanner.imageBase64 || heroBanner.imageUrl}
        alt={heroBanner.title}
        className="w-full h-auto block object-contain"
      />

      {/* Perfect Marquee - Pixel-Perfect Positioning */}
      {heroMarquee && (
        <div 
          ref={containerRef}
          className="absolute top-1/2 md:left-[60%] lg:left-[59%] -translate-x-1/2 -translate-y-1/2 w-full bg-transparent overflow-hidden z-1" 
          style={{ height: '50px' }}
        >
          <div 
            ref={marqueeRef}
            className="font-semibold text-lg tracking-[0.5px] md:text-xs lg:text-lg" 
            style={{ 
              fontFamily: 'Gyrotrope, sans-serif',
              color: heroMarquee.color,
              position: 'absolute',
              height: '100%',
              margin: 0,
              lineHeight: '50px',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              animation: `${animationId} ${animationDuration}s linear infinite`,
              willChange: 'transform'
            }}
          >
            {heroMarquee.messages.map((message, index) => (
              <span 
                key={index} 
                style={{ 
                  paddingRight: '60px',
                  display: 'inline-block'
                }}
              >
                {message}
              </span>
            ))}
          </div>
        </div>
      )}
    </Motion.div>
  );
};
