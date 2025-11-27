/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';

const ResponsiveHeroSection = () => {

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(108deg, #E6D4F1 0%, #C4EBF5 50%, #A8EEDF 100%)',
        paddingBottom: '0',
        marginBottom: '3rem'
      }}
    >
      {/* Main Hero Content */}
      <div className="relative flex items-center justify-center w-full" style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '100px' }}>
        {/* Mobile Title - Visible only on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute left-0 right-0 z-30 px-4 sm:hidden top-8"
          style={{
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: 'clamp(32px, 10vw, 48px)',
              fontWeight: 700,
              color: '#2D3748',
              lineHeight: '1.2',
              letterSpacing: '0.02em',
              margin: 0,
              padding: '0 16px',
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.5)'
            }}
          >
            DS Pharma
          </h1>
          <p
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '14px',
              fontWeight: 500,
              color: '#4A5568',
              marginTop: '8px',
              letterSpacing: '0.01em'
            }}
          >
            Best Price For Quality Medicine
          </p>
        </motion.div>

        {/* Large Background Text "DS Pharma" - Enhanced Typography - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden sm:block"
          style={{
            position: 'absolute',
            top: '30%',
            left: '8%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            textAlign: 'center'
          }}
        >
          <h1
            aria-hidden="true"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 700,
              fontSize: '160px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              margin: 0,
              padding: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            DS Pharma
          </h1>
        </motion.div>

        {/* Doctor Image - Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bottom-30 sm:bottom-10 md:bottom-10 lg:bottom-10"
          style={{
            position: 'absolute',
            left: '26%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            maxWidth: '385px',
            width: '65%'
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .doctor-image-container {
                left: 35% !important;
              }
            }
          `}</style>
          <div className="doctor-image-container" style={{ position: 'relative' }}>
            <img
              src="/src/assets/images/Mask group.png"
              alt="Healthcare Professional"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
          </div>
        </motion.div>

        {/* Mascot Card - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hidden md:block"
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '80px',
            zIndex: 30,
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxWidth: '380px',
            minWidth: '260px'
          }}
        >
          {/* Mascot Image */}
          <div style={{
            marginBottom: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src="/src/assets/images/medicine-character.png"
              alt="DS Pharma Mascots"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                maxHeight: '200px',
                maxWidth: '200px',
                position: 'absolute',
                marginBottom: '160px'
              }}
            />
          </div>

          {/* Text Content */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '16px',
                fontWeight: 500,
                color: '#2D3748',
                lineHeight: '1.5',
                margin: 0,
                letterSpacing: '0.01em'
              }}
            >
              <span style={{
                color: '#4FD1C7',
                fontWeight: 700,
                fontSize: '17px'
              }}>DS Pharma</span>
              <span style={{ color: '#2D3748' }}> provides the best</span>
              <br />
              <span style={{ color: '#2D3748' }}>Price For best </span>
              <span style={{
                color: '#4FD1C7',
                fontWeight: 700,
                fontSize: '17px'
              }}>Quality Medicine</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right Image - Hero Add */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="hidden sm:block"
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          zIndex: 10,
          maxWidth: '60vw',
          width: '75%'
        }}
      >
        <img
          src="/src/assets/images/heroAdd.png"
          alt="DS Pharma"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain'
          }}
        />

        {/* Scrolling Text Effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '59%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            backgroundColor: 'transparent',
            padding: '8px 0',
            overflow: 'hidden',
            zIndex: 1
          }}
        >
          <div
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              animation: 'scroll-marquee 30s linear infinite',
              transform: 'translateX(100%)',
              fontFamily: 'Gyrotrope, sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              color: '#e94242',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ paddingRight: '80px', display: 'inline-block' }}>
              ✓ 100% Genuine Medicines
            </span>
            <span style={{ paddingRight: '80px', display: 'inline-block' }}>
              ✓ Expert Pharmacist Support
            </span>
            <span style={{ paddingRight: '80px', display: 'inline-block' }}>
              ✓ Express Home Delivery
            </span>
            <span style={{ paddingRight: '80px', display: 'inline-block' }}>
              ✓ Secure & Safe Payments
            </span>
            <span style={{ paddingRight: '80px', display: 'inline-block' }}>
              ✓ Trusted Healthcare Partner
            </span>
          </div>
        </div>

        <style>{`
          @keyframes scroll-marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </motion.div>

      {/* Bottom Right Decorative Stripes - Pixel Perfect */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="hidden sm:flex"
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          zIndex: 5,
          gap: '12px',
          alignItems: 'flex-end',
          paddingRight: '0px',
          paddingBottom: '0px'
        }}
      >
        {/* First Stripe - Tall Vertical */}
        <div
          style={{
            width: '90%',
            height: '18px',
            transform: 'skewX(-25deg)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: '2px 2px 0 0'
          }}
        />
        {/* Second Stripe - Medium */}
        <div
          style={{
            width: '90%',
            height: '18px',
            transform: 'skewX(-25deg)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderRadius: '2px 2px 0 0'
          }}
        />
      </motion.div>
    </div>
  );
};

export default ResponsiveHeroSection;
