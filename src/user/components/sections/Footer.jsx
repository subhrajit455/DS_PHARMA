import React from "react";
import { motion as Motion } from "framer-motion";
import logo from "../../../assets/images/Logo.png";

/* ================= ICONS ================= */

const FacebookIcon = () => (
  <svg width="22" height="22" fill="currentColor">
    <path d="M9.2 21.5h4v-8h3.6l.4-4h-4V7.5c0-.55.45-1 1-1h3v-4h-3c-2.76 0-5 2.24-5 5v2H7.2v4h2v8z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="22" height="22" fill="currentColor">
    <path d="M12 0C8.7 0 8.3.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.3 0 8.7 0 12c0 3.3.01 3.7.07 4.95.2 4.35 2.63 6.78 6.98 6.98C8.3 23.99 8.7 24 12 24c3.3 0 3.7-.01 4.95-.07 4.35-.2 6.78-2.63 6.98-6.98.06-1.25.07-1.65.07-4.95 0-3.3-.01-3.7-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.7.01 15.3 0 12 0z" />
  </svg>
);

const XIcon = () => (
  <svg width="22" height="22" fill="currentColor">
    <path d="M18.24 2.25h3.3l-7.2 8.26 8.5 11.24h-6.6l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.25 2.25h6.8l4.7 6.2z" />
  </svg>
);

/* ================= COMPONENT ================= */

const Footer = () => {
  const quickLinks = [
    { id: 1, label: "Home", href: "/" },
    { id: 2, label: "About", href: "/about" },
    { id: 3, label: "Contact", href: "/contact" },
    { id: 4, label: "Categories", href: "/categories" },
    { id: 5, label: "Privacy Policy", href: "/privacy-policy" },
    { id: 6, label: "Terms", href: "/terms-of-service" },
    { id: 7, label: "Shipping", href: "/shipping-policy" },
    { id: 8, label: "Returns", href: "/returns-policy" },
    { id: 9, label: "Admin", href: "/admin" },
  ];

  const socialLinks = [
    { id: 1, icon: FacebookIcon },
    { id: 2, icon: XIcon },

  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* LOGO */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={styles.section}
        >
          <div style={styles.logoBox}>
            <img src={logo} alt="logo" style={styles.logo} />
          </div>
        </Motion.div>

        {/* LINKS */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={styles.section}
        >
          <h3 style={styles.heading}>Quick Links</h3>

          <div style={styles.linkContainer}>
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                style={styles.link}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </Motion.div>

        {/* CONTACT */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={styles.section}
        >
          <h3 style={styles.heading}>Contact Info</h3>

          <p style={styles.text}>
            <a href="mailto:helpdesk@dspharma.online" style={styles.link}>
              helpdesk@dspharma.online
            </a>
            <br />
            <a href="mailto:dscommunication3@gmail.com" style={styles.link}>
              dscommunication3@gmail.com
            </a>
          </p>

          <p style={styles.text}>
            <a href="tel:9382713623" style={styles.link}>
              9382713623
            </a>
            / 
            <a href="tel:9564200437" style={styles.link}>
              9564200437
            </a>
          </p>

          <p style={styles.text}>
            <a href="https://goo.gl/maps/1Z5n9sXo7mL2" style={styles.link} target="_blank" rel="noopener noreferrer">
              Debalaya, Deganga, Berachampa, North 24 Parganas,
              Kolkata, West Bengal - 743424
            </a>
          </p>

          {/* SOCIAL */}
          <h4 style={{ ...styles.heading, marginTop: 14 }}>
            Social Media
          </h4>

          <div style={styles.socialContainer}>
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  style={styles.socialIcon}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Icon />
                </div>
              );
            })}
          </div>
        </Motion.div>
      </div>

      {/* COPYRIGHT */}
      <div style={styles.copy}>
        © 2026 Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

/* ================= STYLES ================= */

const styles = {
  footer: {
    background: "#D1F5EB",
    padding: "40px 16px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "space-between",
  },

  section: {
    flex: "1 1 250px",
    minWidth: "220px",
  },

  logoBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "260px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },

  logo: {
    width: "100%",
    height: "auto",
  },

  heading: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  linkContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  link: {
    fontSize: "14px",
    textDecoration: "none",
    color: "#000",
  },

  text: {
    fontSize: "14px",
    marginBottom: "8px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },

  socialContainer: {
    display: "flex",
    gap: "12px",
  },

  socialIcon: {
    background: "#fff",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
  },

  copy: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "13px",
    color: "#444",
  },
};