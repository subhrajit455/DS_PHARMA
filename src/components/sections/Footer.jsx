import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { id: 1, label: 'Home', href: '/' },
    { id: 2, label: 'Home', href: '/' },
    { id: 3, label: 'Home', href: '/' },
    { id: 4, label: 'Home', href: '/' }
  ];

  const socialLinks = [
    { id: 1, icon: Facebook, href: '#', label: 'Facebook' },
    { id: 2, icon: Instagram, href: '#', label: 'Instagram' },
    { id: 3, icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer 
      id="contact"
      className="w-full flex justify-center items-center mb-20 md:mb-0"
      style={{
        width: '100%',
        background: 'linear-gradient(to right, #B8F0E8 0%, #A0E8DC 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3 flex items-center md:items-start justify-center md:justify-start"
          >
            <div
              style={{
                background: '#D1D5DB',
                borderRadius: '6px',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                paddingLeft: '2rem',
                paddingRight: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '210px'
              }}
            >
              <span
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: 'clamp(18px, 4vw, 22px)',
                  fontWeight: 600,
                  color: '#000000',
                  letterSpacing: '0em'
                }}
              >
                Logo
              </span>
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 flex flex-col items-center md:items-start md:pl-12"
          >
            <h3
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '17px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '14px',
                letterSpacing: '0em'
              }}
            >
              Quick Links
            </h3>
            <nav className="flex flex-col" style={{ gap: '6px' }}>
              {quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#000000',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                    display: 'inline-block',
                    lineHeight: '1.5'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5 flex flex-col md:pl-8"
          >
            <h3
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '17px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '14px',
                letterSpacing: '0em'
              }}
            >
              Contact Info
            </h3>
            
            {/* Contact Details */}
            <div className="flex flex-col mb-5" style={{ gap: '6px' }}>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Gmail
              </p>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Mobile No
              </p>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Address
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '10px',
                  letterSpacing: '0em'
                }}
              >
                Social Media
              </h4>
              <div className="flex items-center" style={{ gap: '12px' }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        color: '#000000',
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Icon size={14} strokeWidth={2.5} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
