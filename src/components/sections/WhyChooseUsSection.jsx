import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    icon: '/src/assets/icons/iconamoon_delivery-fill.png',
    text: 'All Over India Delivery'
  },
  {
    id: 2,
    icon: '/src/assets/icons/icon-park_customer.png',
    text: '60K+ Happy Customer'
  },
  {
    id: 3,
    icon: '/src/assets/icons/icon-park-solid_healthy-recognition.png',
    text: 'Certified Medicine'
  },
  {
    id: 4,
    icon: '/src/assets/icons/healthicons_medicines.png',
    text: '10000+ Medicine Available'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const WhyChooseUsSection = () => {
  return (
    <section 
      className="w-full mb-6 flex justify-center items-center" 
      style={{ 
        width: '100%',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        marginBottom: '2rem'
      }}
    >
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #D5F5ED 0%, #C1EDE3 50%, #B8E8DD 100%)',
            
            minHeight: '280px'
          }}
        >
          <div 
            className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center justify-center"
            style={{
              paddingTop: '2rem',
              paddingBottom: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              gap: '2rem',
              margin: '0 50px'
            }}
          >
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <div className=''>
              <div className='left-0 top-0 text-left'>
                  <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ 
                  fontFamily: 'Gyrotrope',
                  fontSize: 'clamp(20px, 3vw, 26px)',
                  fontWeight: 700,
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  marginBottom: '1.5rem'
                }}
              >
                Why Choose Us
              </motion.h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{
                  rowGap: '1.5rem',
                  columnGap: '1.5rem'
                }}
              >
                {features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    variants={itemVariants}
                    className="flex items-center group"
                    style={{ gap: '0.75rem' }}
                  >
                    {/* Icon Container - Pixel Perfect */}
                    <div 
                      className="shrink-0 bg-white flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-105"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <img 
                        src={feature.icon} 
                        alt="" 
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain',
                          filter: 'contrast(1.1)',
                          imageRendering: '-webkit-optimize-contrast'
                        }}
                      />
                    </div>

                    {/* Text - Pixel Perfect Typography */}
                    <span 
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        fontWeight: 600,
                        lineHeight: '1.4',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            </div>
            {/* Right Images - Pixel Perfect Positioning */}
            <div className="relative hidden lg:flex items-center justify-end">
              <div 
                className="relative w-full"
                style={{
                  height: '300px',
                  minHeight: '300px'
                }}
              >
                {/* Background Shape - Exact Positioning */}
                <div 
                  className="absolute"
                  style={{
                    right: '0px',
                    top: '55%',
                    transform: 'translateY(-50%)',
                    width: '280px',
                    maxWidth: '290px',
                    height: 'auto',
                    zIndex: 14,
                    position: 'absolute'
                  }}
                >
                  <img
                    src="/src/assets/images/Subtract.png"
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      filter: 'brightness(1.02) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </div>

                {/* Doctor Image - Exact Positioning */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute"
                  style={{
                    right: '2px',
                    bottom: '0px',
                    width: '50%',
                    maxHeight: '370px',
                    maxWidth: '280px',
                    zIndex: 15
                  }}
                >
                  <img
                    src="/src/assets/images/doctor.png"
                    alt="Healthcare Professional"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                      padding: '30px',
                      filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))',
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </motion.div>

                {/* Objects Image - Positioned on Upper Left of Doctor */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
                  className="absolute"
                  style={{
                    left: '310px',
                    top: '',
                    width: '160px',
                    zIndex: 13,
                    position: 'absolute'
                  }}
                >
                  <img
                    src="/src/assets/images/OBJECTS.png"
                    alt="Medical Objects"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
                      imageRendering: '-webkit-optimize-contrast',
                      transform: 'translateZ(0)'
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
