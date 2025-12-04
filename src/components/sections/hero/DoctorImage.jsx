import { motion as Motion } from 'framer-motion';

export const DoctorImage = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative z-20 h-[450px] md:h-[700px] lg:h-[600px] max-w-7xl mx-auto left-[25%] md:left-[30%] lg:left-[20%] text-center  -translate-x-1/2 "
      
    >
      <div className="relative w-full h-[350px] md:h-[700px] lg:h-[600px] max-w-[300px] md:max-w-[450px] lg:max-w-[400px]">
        <img
          src="/src/assets/images/Mask group.png"
          alt="Healthcare Professional"
          className="w-full h-full block object-contain"
        />
      </div>
    </Motion.div>
  );
};
