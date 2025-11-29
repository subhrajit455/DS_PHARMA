import React from 'react';
import { motion } from 'framer-motion';

const AboutUsSection = () => {
  return (
    <section
      id="about"
      className="w-full flex justify-center items-center"
      style={{
        width: '100%',
        paddingTop: '1rem',
        paddingBottom: '2rem',
        marginBottom: '1.5rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 text-center">
        {/* About Us Container */}
        <div className="relative">
          {/* Main Content Box */}
          <div
            className="relative overflow-visible"
            style={{
              background: 'linear-gradient(to right, #A0F0E8 0%, #85E8DC 100%)',
              borderRadius: '16px',
              minHeight: '310px',
              height: 'auto',
              paddingTop: '1rem',
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
                borderRadius: '8px 8px',
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
                paddingTop: '2.5rem',
                paddingBottom: '1rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                gap: '1.5rem',
                maxWidth: '900px'
              }}
            >
              {/* Main Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(15px, 2.8vw, 17px)',
                    lineHeight: '1.7',
                    color: '#111827',
                    margin: 0,
                    fontWeight: 500
                  }}
                >
                  Welcome to <span style={{
                    fontWeight: 700,
                    color: '#059669',
                    fontSize: 'clamp(16px, 3vw, 18px)'
                  }}>DS Pharma</span>, your trusted partner in health and wellness.
                </p>

                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    lineHeight: '1.7',
                    color: '#374151',
                    margin: 0
                  }}
                >
                  We are committed to providing high-quality medicines, healthcare products, and professional
                  pharmaceutical services to our community with care and compassion.
                </p>
              </div>

              {/* Mission Statement with Icon */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(14px, 2.5vw, 15px)',
                    lineHeight: '1.7',
                    color: '#1F2937',
                    margin: 0,
                    fontStyle: 'italic'
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    marginRight: '0.5rem',
                    color: '#059669'
                  }}>💊</span>
                  With years of experience in the pharmaceutical industry, we understand the importance of
                  accessible and affordable healthcare. Our mission is to ensure that every customer receives
                  genuine medications, expert advice, and compassionate care.
                </p>
              </div>

              {/* Values Grid */}
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  width: '100%'
                }}
              >
                {[
                  { icon: '✓', title: 'Quality & Authenticity', color: '#10B981' },
                  { icon: '♥', title: 'Customer-Centric', color: '#EF4444' },
                  { icon: '⚕', title: 'Expert Care', color: '#3B82F6' },
                  { icon: '₹', title: 'Affordable Prices', color: '#F59E0B' }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'default'
                    }}
                    whileHover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.5rem',
                        color: value.color,
                        fontWeight: 'bold',
                        minWidth: '24px',
                        textAlign: 'center'
                      }}
                    >
                      {value.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 'clamp(13px, 2.3vw, 14px)',
                        fontWeight: 600,
                        color: '#1F2937',
                        lineHeight: '1.3'
                      }}
                    >
                      {value.title}
                    </span>
                  </motion.div>
                ))}
              </div>
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
    </section >
  );
};

export default AboutUsSection;
