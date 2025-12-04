import { motion as Motion } from 'framer-motion';

export const HeroAddImage = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="hidden sm:block absolute bottom-0 right-0 z-10 w-full  md:max-w-[60%] lg:max-w-3xl"
    >
      <img
        src="/src/assets/images/heroAdd.png"
        alt="DS Pharma"
        className="w-full h-auto block object-contain"
      />

      {/* Scrolling Text Effect */}
      <div className="absolute top-1/2 md:left-[60%] lg:left-[59%] -translate-x-1/2 -translate-y-1/2 w-full bg-transparent py-2 overflow-hidden z-1 mask-linear-fade">
        <div className="flex whitespace-nowrap animate-marquee w-max pl-[100%] font-semibold text-lg text-[#e94242] tracking-[0.5px] md:text-xs lg:text-lg" style={{ fontFamily: 'Gyrotrope, sans-serif' }}>
          <span className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">✓ 100% Genuine Medicines</span>
          <span className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">✓ Expert Pharmacist Support</span>
          <span className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">✓ Express Home Delivery</span>
          <span className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">✓ Secure & Safe Payments</span>
          <span className="pr-[50px] inline-block md:pr-[25px] lg:pr-[50px]">✓ Trusted Healthcare Partner</span>
        </div>
      </div>

      <style>{`
        @keyframes scroll-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: scroll-marquee 22s linear infinite;
        }
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 1%, black 99%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 1%, black 99%, transparent);
        }
      `}</style>
    </Motion.div>
  );
};
