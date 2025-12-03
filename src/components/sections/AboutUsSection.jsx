import React from 'react';
import { motion as Motion } from 'framer-motion';
import Exclude from '../../assets/images/Exclude.png';
import Frame5 from '../../assets/images/Frame 5.png';

const AboutUsSection = () => {
  return (
    <section
      id="about"
      className="w-full flex justify-center items-center relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: '1rem',
        paddingBottom: '2rem',
        marginBottom: '1.5rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 text-center relative z-10">
        {/* About Us Container */}
        <div className="relative">
          {/* Main Content Box */}
          <div
            className="relative overflow-visible pr-6 lg:pr-[240px] min-h-[200px] lg:min-h-[310px]"
            style={{
              backgroundImage: `url(${Exclude})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '16px',
              height: 'auto',
              paddingTop: '1rem',
              paddingBottom: '1.5rem',
              paddingLeft: '1.5rem',
              position: 'relative'
            }}
          >
            {/* About Us Title Badge */}
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="absolute"
              style={{
                top: '6px',
                left: '10px',
                boxShadow: 'none',
                borderBottom: 'none'
              }}
            >
              <h2
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: 'clamp(18px, 4vw, 20px)',
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
            </Motion.div>

            {/* Content Area - Minimal Layout */}
            <Motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                paddingTop: '2rem',
                paddingBottom: '0.5rem',
                height: '100%',
                minHeight: '220px'
              }}
            >
              {/* Empty content area - Design shows minimal layout */}
            </Motion.div>
          </div>

          {/* Frame 5 Background - Bottom Right */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute block right-0 -bottom-5 w-[140px] h-[100px] lg:w-[240px] lg:h-[160px] lg:-bottom-[35px]"
            style={{
              zIndex: 5
            }}
          >
            <img
              src={Frame5}
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
          </Motion.div>

          {/* Mascot Character - Positioned on Top of Frame 5 */}
          <Motion.div
            initial={{ opacity: 0, x: 15, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute block -right-[10px] bottom-[10px] w-[140px] h-[140px] lg:-right-[20px] lg:bottom-[20px] lg:w-[240px] lg:h-[240px]"
            style={{
              zIndex: 10
            }}
          >
            <img
              src="/src/assets/images/OBJECTS1.png"
              alt="Pharmacy Mascot Character"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)',
                filter: 'contrast(1.02) saturate(1.05) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
