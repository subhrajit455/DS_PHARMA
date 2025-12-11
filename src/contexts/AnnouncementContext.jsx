import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AnnouncementContext = createContext(undefined);

// Sample initial data
const initialData = {
  banners: [
    {
      id: 'banner-1',
      title: 'Main Hero Banner',
      imageUrl: '/src/assets/images/heroAdd.png',
      imageBase64: null,
      link: '/products',
      isEnabled: true,
      position: 'hero',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  marqueeMessages: [
    {
      id: 'marquee-1',
      messages: [
        '✓ 100% Genuine Medicines',
        '✓ Expert Pharmacist Support',
        '✓ Express Home Delivery',
        '✓ Secure & Safe Payments',
        '✓ Trusted Healthcare Partner'
      ],
      isEnabled: true,
      color: '#e94242',
      speed: 22,
      position: 'hero',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      type: 'info',
      title: 'Free Delivery',
      message: 'Get free delivery on orders above ₹999',
      isEnabled: true,
      position: 'top',
      dismissible: true,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Provider component
export const AnnouncementProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [marqueeMessages, setMarqueeMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem('ds-pharma-announcements');
        if (stored) {
          const data = JSON.parse(stored);
          setBanners(data.banners || []);
          setMarqueeMessages(data.marqueeMessages || []);
          setAlerts(data.alerts || []);
        } else {
          // Initialize with sample data
          setBanners(initialData.banners);
          setMarqueeMessages(initialData.marqueeMessages);
          setAlerts(initialData.alerts);
          localStorage.setItem('ds-pharma-announcements', JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Error loading announcements:', error);
        // Fallback to initial data
        setBanners(initialData.banners);
        setMarqueeMessages(initialData.marqueeMessages);
        setAlerts(initialData.alerts);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const data = { banners, marqueeMessages, alerts };
      localStorage.setItem('ds-pharma-announcements', JSON.stringify(data));
    }
  }, [banners, marqueeMessages, alerts, loading]);

  // Banner CRUD operations
  const createBanner = (bannerData) => {
    const newBanner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBanners(prev => [...prev, newBanner]);
    return newBanner;
  };

  const updateBanner = (id, bannerData) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, ...bannerData, updatedAt: new Date().toISOString() }
        : banner
    ));
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  const toggleBannerStatus = (id) => {
    setBanners(prev => prev.map(banner =>
      banner.id === id
        ? { ...banner, isEnabled: !banner.isEnabled, updatedAt: new Date().toISOString() }
        : banner
    ));
  };

  // Marquee CRUD operations
  const createMarquee = (marqueeData) => {
    const newMarquee = {
      ...marqueeData,
      id: `marquee-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMarqueeMessages(prev => [...prev, newMarquee]);
    return newMarquee;
  };

  const updateMarquee = (id, marqueeData) => {
    setMarqueeMessages(prev => prev.map(marquee =>
      marquee.id === id
        ? { ...marquee, ...marqueeData, updatedAt: new Date().toISOString() }
        : marquee
    ));
  };

  const deleteMarquee = (id) => {
    setMarqueeMessages(prev => prev.filter(marquee => marquee.id !== id));
  };

  const toggleMarqueeStatus = (id) => {
    setMarqueeMessages(prev => prev.map(marquee =>
      marquee.id === id
        ? { ...marquee, isEnabled: !marquee.isEnabled, updatedAt: new Date().toISOString() }
        : marquee
    ));
  };

  // Alert CRUD operations
  const createAlert = (alertData) => {
    const newAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  };

  const updateAlert = (id, alertData) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id
        ? { ...alert, ...alertData, updatedAt: new Date().toISOString() }
        : alert
    ));
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlertStatus = (id) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id
        ? { ...alert, isEnabled: !alert.isEnabled, updatedAt: new Date().toISOString() }
        : alert
    ));
  };

  const value = {
    // Data
    banners,
    marqueeMessages,
    alerts,
    loading,
    
    // Banner operations
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    
    // Marquee operations
    createMarquee,
    updateMarquee,
    deleteMarquee,
    toggleMarqueeStatus,
    
    // Alert operations
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlertStatus
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

// Custom hook to use the context
export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};
