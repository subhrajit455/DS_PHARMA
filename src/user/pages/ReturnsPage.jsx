import React, { useEffect, useState } from "react";

const ReturnsPolicyPage = () => {
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
      icon: "⏰",
      title: "Return Window",
      items: [
        "All products can be returned within 10 days of purchase for a full refund.",
        "The 10-day period begins from the date of delivery, not the order date.",
        "Items returned after the 10-day window may be refused or subject to a restocking fee.",
        "Unopened and unused items have a 60-day return window for store credit.",
        "Prescription medications cannot be returned once opened due to safety regulations.",
      ],
    },
    {
      icon: "📋",
      title: "Return Eligibility",
      items: [
        "Products must be in original, unused condition with all original packaging intact.",
        "Items must include all original accessories, documentation, and packaging materials.",
        "Prescription items can only be returned if unused and in sealed original packaging.",
        "Damaged items caused by mishandling are not eligible for return (we cover manufacturing defects).",
        "Sale items are final sale unless they are defective or damaged during delivery.",
      ],
    },
    {
      icon: "📦",
      title: "How to Request a Return",
      items: [
        'Log in to your account and navigate to "My Orders" or "Order History".',
        "Select the order containing the item you wish to return.",
        'Click "Request Return" and follow the provided instructions.',
        "Print the prepaid delivery label provided in your return confirmation email.",
        "Ships must receive your return within the 10-day window to qualify for a refund.",
      ],
    },
    {
      icon: "🚚",
      title: "Delivery & Handling",
      items: [
        "We provide a free prepaid return delivery label for all eligible returns.",
        "You are responsible for packaging the item securely to prevent damage during return shipment.",
        "Drop off your package at any participating carrier location or arrange a pickup.",
        "Items sent without a return authorization number will not be accepted and will be returned to you.",
        "Return delivery times vary by carrier; tracking is provided with your return label.",
      ],
    },
    {
      icon: "💰",
      title: "Refunds & Processing",
      items: [
        "Once we receive and inspect your return, you will receive a return confirmation email.",
        "Refunds are processed within 7-10 business days of inspection.",
        "The refund will be issued to your original payment method (credit card, digital wallet, etc.).",
        "Original delivery charges are non-refundable; we only refund the product price.",
        "Restocking fees (up to 20%) may apply to items returned outside the standard return window.",
      ],
    },
    {
      icon: "⚠️",
      title: "Exceptions & Restrictions",
      items: [
        "Clearance and final sale items cannot be returned for refunds.",
        "Custom or personalized items cannot be returned unless defective.",
        "Items with signs of use, wear, or damage are subject to refusal.",
        "Health and beauty items (opened or used) cannot be returned for safety reasons.",
        "Hazardous materials have specific return conditions—contact support for details.",
        "We do not accept any exchange of the product.",
      ],
    },
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroSectionStyle}>
        <h1 style={titleStyle}>Returns Policy</h1>
        <p style={subtitleStyle}>Last updated: March 2026</p>
        <p style={{ ...subtitleStyle, marginTop: "15px" }}>
          We want you to be completely satisfied with your purchase. Our
          hassle-free return policy makes it easy to return items within 10 days
          of delivery.
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
          <h3 style={contactTitleStyle}>Need Help With Your Return?</h3>
          <p style={contactTextStyle}>
            Have questions about our returns policy or need assistance
            processing your return? Our customer support team is here to help
            you every step of the way.
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
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;
