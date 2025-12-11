import { motion as Motion } from 'framer-motion';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';

export const HeroAddImage = () => {
  const { banners, marqueeMessages } = useAnnouncements();

  // Find the first enabled hero banner
  const heroBanner = banners.find(b => b.isEnabled && b.position === 'hero');
  
  // Find the first enabled hero marquee
  const heroMarquee = marqueeMessages.find(m => m.isEnabled && m.position === 'hero');

  // Don't render if no banner is available
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

      {/* Scrolling Text Effect */}
      {heroMarquee && (
        <div className="absolute top-1/2 md:left-[60%] lg:left-[59%] -translate-x-1/2 -translate-y-1/2 w-full bg-transparent py-2 overflow-hidden z-1 mask-linear-fade">
          <div 
            className="flex whitespace-nowrap w-max pl-[100%] font-semibold text-lg tracking-[0.5px] md:text-xs lg:text-lg" 
            style={{ 
              fontFamily: 'Gyrotrope, sans-serif',
              color: heroMarquee.color,
              animation: `scroll-marquee ${heroMarquee.speed}s linear infinite`
            }}
          >
            {heroMarquee.messages.map((message, index) => (
              <span key={index} className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">
                {message}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 1%, black 99%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 1%, black 99%, transparent);
        }
      `}</style>
    </Motion.div>
  );
};
