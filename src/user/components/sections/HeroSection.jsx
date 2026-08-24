import { useEffect, useRef, useState } from "react";
import banner1 from "../../../assets/banner/banner1.jpg";
import banner2 from "../../../assets/banner/banner2.jpg";
import marqueeService from "@/services/marqueeService";

const slides = [
  {
    title: "DS PHARMA",
    subtitle: "Your trusted pharmaceutical partner",
    image: banner1,
  },
  {
    title: "DS PHARMA",
    subtitle: "Quality medicines, delivered fast",
    image: banner2,
  },
];

const AUTO_ADVANCE_MS = 5000;

const ResponsiveHeroSection = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marqueeMessages, setMarqueeMessages] = useState([]);

  // Fetch marquee notifications
  useEffect(() => {
    const controller = new AbortController();
    const fetchNotifications = async () => {
      try {
        const data = await marqueeService.getVisibleMessages({
          signal: controller.signal,
        });
        setMarqueeMessages(data);
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error("Failed to fetch marquee notifications:", error);
      }
    };
    fetchNotifications();
    return () => controller.abort();
  }, []);

  const scrollToIndex = (index) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  const goTo = (direction) => {
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % slides.length
        : (currentIndex - 1 + slides.length) % slides.length;

    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goTo("next");
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Keep scroll position sync when user manually scrolls
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  return (
    <>
    <section className="relative w-full overflow-hidden">
      {/* Marquee Notification Banner */}

      {/* Hero Slides */}
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x scrollbar-hide"
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="min-w-full snap-center shrink-0 relative flex items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 text-white min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]"
            style={{
              // minHeight: "70vh",
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 text-center max-w-2xl">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold">
                {slide.title}
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl opacity-90">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex justify-between px-2 sm:px-4">
        <button
          type="button"
          onClick={() => goTo("prev")}
          className="pointer-events-auto rounded-full bg-white/70 p-2 sm:p-3 shadow-md backdrop-blur hover:bg-white text-xl sm:text-2xl"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo("next")}
          className="pointer-events-auto rounded-full bg-white/70 p-2 sm:p-3 shadow-md backdrop-blur hover:bg-white text-xl sm:text-2xl"
        >
          ›
        </button>
      </div>
    
    </section>
    <div 
    style={{
            width: "100%"
          }}>
      {marqueeMessages.length > 0 && (
        <marquee
          scrollamount="20"
          style={{
            width: "100%",
            background: "rgb(5 255 211 / 60%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            padding: "4px 0",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "white",
          }}
        >
          {marqueeMessages.map((msg, index) => (
            <span key={index} >
              {msg.title}
            </span>
          ))}
        </marquee>
      )}
    </div>
    </>
  );
};

export default ResponsiveHeroSection;
