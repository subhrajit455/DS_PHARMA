import { motion as Motion } from 'framer-motion';

export const MobileMarquee = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="absolute bottom-0 left-0 right-0 z-10 w-full flex items-center overflow-hidden sm:hidden h-10 bg-white/30 backdrop-blur-[2px]"
    >
      <div className="flex whitespace-nowrap animate-marquee w-max pl-[100%] font-semibold text-sm text-[#e94242] tracking-[0.5px]" style={{ fontFamily: 'Gyrotrope, sans-serif' }}>
        <span className="pr-[30px] inline-block">✓ 100% Genuine Medicines</span>
        <span className="pr-[30px] inline-block">✓ Expert Pharmacist Support</span>
        <span className="pr-[30px] inline-block">✓ Express Home Delivery</span>
        <span className="pr-[30px] inline-block">✓ Secure & Safe Payments</span>
        <span className="pr-[30px] inline-block">✓ Trusted Healthcare Partner</span>
      </div>
      <style>{`
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: scroll-marquee 20s linear infinite;
        }
      `}</style>
    </Motion.div>
  );
};
