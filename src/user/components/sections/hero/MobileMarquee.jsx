import { motion as Motion } from 'framer-motion';
import { useAnnouncements } from '@/shared/contexts/AnnouncementContext';

export const MobileMarquee = () => {
  // Fetch marquee messages from admin
  const { marqueeMessages } = useAnnouncements();
  
  // Get enabled marquee (should be only one active marquee at a time)
  const activeMarquee = marqueeMessages.find(marquee => marquee.isEnabled);
  
  // If no active marquee or no messages, don't render
  if (!activeMarquee || !activeMarquee.messages || activeMarquee.messages.length === 0) {
    return null;
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="absolute bottom-0 left-0 right-0 z-10 w-full flex items-center overflow-hidden sm:hidden h-10 bg-white/30 backdrop-blur-[2px]"
    >
      <div 
        className="flex whitespace-nowrap gap-5 animate-marquee w-max pl-[100%] font-semibold text-sm tracking-[0.5px]" 
        style={{ 
          fontFamily: 'Gyrotrope, sans-serif',
          color: activeMarquee.color || '#e94242'
        }}
      >
        {/* Render messages */}
        {activeMarquee.messages.map((message, index) => (
          <span key={index} className="pr-[30px] inline-block">
            {message}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {activeMarquee.messages.map((message, index) => (
          <span key={`dup-${index}`} className="pr-[30px] inline-block">
            {message}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll-marquee ${activeMarquee.speed || 20}s linear infinite;
        }
      `}</style>
    </Motion.div>
  );
};
