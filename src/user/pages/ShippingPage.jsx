import React, { useEffect, useState } from "react";

const DeliveryPolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)",
    paddingTop: "80px",
    paddingBottom: "60px",
  };

  const heroSectionStyle = {
    textAlign: "center",
    padding: "60px 20px",
    color: "#ffffff",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.8s ease-out",
  };

  const titleStyle = {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "800",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    letterSpacing: "1px",
  };

  const subtitleStyle = {
    fontSize: "clamp(1rem, 2vw, 1.3rem)",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.8",
    opacity: "0.95",
  };

  const contentContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const sectionStyle = (delay) => ({
    background: "#ffffff",
    borderRadius: "20px",
    padding: "clamp(30px, 5vw, 50px)",
    marginBottom: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    transition: `all 0.8s ease-out ${delay}s`,
  });

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  };

  const iconContainerStyle = {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    flexShrink: 0,
  };

  const sectionTitleStyle = {
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
    fontWeight: "700",
    color: "#2d3748",
    margin: 0,
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const listItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "15px",
    fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
    lineHeight: "1.7",
    color: "#4a5568",
  };

  const bulletStyle = {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)",
    borderRadius: "50%",
    marginTop: "8px",
    flexShrink: 0,
  };

  const contactSectionStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f7fffe 100%)",
    borderRadius: "20px",
    padding: "clamp(40px, 5vw, 60px)",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "scale(1)" : "scale(0.95)",
    transition: "all 0.8s ease-out 0.8s",
  };

  const contactTitleStyle = {
    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "20px",
  };

  const contactTextStyle = {
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    color: "#718096",
    marginBottom: "30px",
    maxWidth: "700px",
    margin: "0 auto 30px",
    lineHeight: "1.7",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "18px 45px",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#ffffff",
    background: "linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 20px rgba(159, 194, 191, 0.4)",
    textDecoration: "none",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const [hoveredButton, setHoveredButton] = useState(false);

  const buttonHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 30px rgba(159, 194, 191, 0.5)",
  };

  const sections = [
    {
      icon: "🚚",
      title: "Delivery Methods",
      items: [
        "Standard Delivery (5-7 business days): Free for orders over ₹4,200, ₹500 for orders under ₹4,200.",
        "Express Delivery (2-3 business days): ₹1,100 for all orders, includes tracking and insurance.",
        "Overnight Delivery (1 business day): ₹2,000 for next-day morning delivery to most locations.",
        "Prescription Orders: All prescription items are shipped via tracked, insured carriers for safety.",
        "Scheduled Delivery: Choose your preferred delivery date for a customized delivery experience.",
      ],
    },
    {
      icon: "⏱️",
      title: "Order Processing",
      items: [
        "Orders are processed Monday through Friday, excluding holidays and weekends.",
        "Standard processing time is 1-2 business days from order confirmation.",
        "Orders placed after 2 PM will be processed the following business day.",
        "Expedited processing is available for an additional ₹800 fee (ships same business day).",
        "Prescription orders may require verification and take an additional 24 hours to process.",
      ],
    },
    {
      icon: "📍",
      title: "Delivery Locations",
      items: [
        "We deliver to all 50 U.S. states, including Alaska and Hawaii (with additional fees).",
        "APO/FPO military addresses: Standard delivery, additional delivery time expected.",
        "Overseas military addresses: Contact customer support for delivery options and costs.",
        "P.O. Boxes: Accepted for most items; call 1-800-PHARM-99 to verify addressability.",
        "Pickup points: Not currently available; all orders require a residential or business address.",
      ],
    },
    {
      icon: "📦",
      title: "Tracking & Delivery",
      items: [
        "All orders include a tracking number provided via email within 24 hours of shipment.",
        "Track your package in real-time through your account dashboard or carrier website.",
        "Delivery confirmation is required for all orders over ₹8,400.",
        "Signature may be required for certain medications and high-value items.",
        "Delivery dates are estimates; carrier delays may occur due to weather or unforeseen circumstances.",
      ],
    },
    {
      icon: "⚠️",
      title: "Delivery Restrictions",
      items: [
        "Certain controlled substances and medications have restricted delivery zones—contact support for details.",
        "Hazardous items (flammable, corrosive) require special handling and may have higher delivery costs.",
        "Live products require expedited delivery to ensure freshness and viability upon delivery.",
        "Some items cannot be shipped to certain states due to regulatory restrictions.",
        "Oversized items may incur additional delivery fees not reflected at checkout.",
      ],
    },
    {
      icon: "🌍",
      title: "International Delivery",
      items: [
        "International delivery is available to select countries; verify eligibility at checkout.",
        "International orders require valid passport information and customs documentation.",
        "Delivery times vary from 10-30 business days depending on destination country.",
        "International customers are responsible for all customs duties, taxes, and brokerage fees.",
        "Prescription medications may not be eligible for international shipment due to regulations.",
      ],
    },
    {
      icon: "💔",
      title: "Damaged or Lost Packages",
      items: [
        "Report damaged packages within 48 hours of delivery with photos of damage and packaging.",
        "Lost packages are investigated with the carrier; replacement or refund issued within 10 business days.",
        "We automatically file claims for packages not delivered within the guaranteed window.",
        "Insurance is included on all orders; additional coverage available upon request.",
        "Keep original packaging for 30 days in case inspection or claim is needed.",
      ],
    },
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroSectionStyle}>
        <h1 style={titleStyle}>Delivery Policy</h1>
        <p style={subtitleStyle}>Last updated: March 2026</p>
        <p style={{ ...subtitleStyle, marginTop: "15px" }}>
          We offer flexible delivery options to get your medications and health
          products to you quickly and safely. Learn about our delivery methods,
          delivery times, and tracking options.
        </p>
      </div>

      <div style={contentContainerStyle}>
        {/* Content Sections */}
        {sections.map((section, index) => (
          <div key={index} style={sectionStyle(0.2 + index * 0.1)}>
            <div style={sectionHeaderStyle}>
              <div style={iconContainerStyle}>
                <span>{section.icon}</span>
              </div>
              <h2 style={sectionTitleStyle}>{section.title}</h2>
            </div>
            <ul style={listStyle}>
              {section.items.map((item, idx) => (
                <li key={idx} style={listItemStyle}>
                  <span style={bulletStyle}></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Section */}
        <div style={contactSectionStyle}>
          <h3 style={contactTitleStyle}>Questions About Delivery?</h3>
          <p style={contactTextStyle}>
            Have questions about delivery times, delivery options, or need to
            update your delivery address? Our customer support team is available
            to assist you.
          </p>
          <a
            href="/contact"
            style={{
              ...buttonStyle,
              ...(hoveredButton ? buttonHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPolicyPage;
