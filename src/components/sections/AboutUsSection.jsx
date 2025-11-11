import React from 'react';
import { motion } from 'framer-motion';

const AboutUsSection = () => {
  return (
    <section 
      id="about"
      className="w-full flex justify-center items-center" 
      style={{ 
        width: '100%',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        marginBottom: '1.5rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* About Us Container */}
        <div className="relative">
          {/* Main Content Box */}
          <div
            className="relative overflow-visible"
            style={{
              background: 'linear-gradient(to right, #A0F0E8 0%, #85E8DC 100%)',
              borderRadius: '16px',
              minHeight: '160px',
              height: 'auto',
              paddingTop: '3rem',
              paddingBottom: '2rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              position: 'relative'
            }}
          >
            {/* About Us Title Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="absolute"
              style={{
                top: '-12px',
                left: '0px',
                background: '#FFFFFF',
                borderRadius: '8px 8px 0 0',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                boxShadow: 'none',
                borderBottom: 'none'
              }}
            >
              <h2
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  fontWeight: 600,
                  lineHeight: '1.3',
                  letterSpacing: '0em',
                  color: '#000000',
                  margin: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                About Us
              </h2>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                paddingTop: '0px',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Content placeholder - can add description text here */}
            </motion.div>
          </div>

          {/* Mascot Character - Positioned on Right */}
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute hidden lg:block"
            style={{
              right: '0px',
              bottom: '0px',
              top: '24px',
              width: '180px',
              zIndex: 10
            }}
          >
            {/* Transparent Container for Mascot */}
            <div
              style={{
                background: 'transparent',
                padding: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <img
                src="/src/assets/images/OBJECTS1.png"
                alt="Pharmacy Mascot Character"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  display: 'block',
                  objectFit: 'contain',
                  imageRendering: '-webkit-optimize-contrast',
                  transform: 'translateZ(0)',
                  filter: 'contrast(1.02) saturate(1.05)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
