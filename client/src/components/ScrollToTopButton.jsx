// components/ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = ({
  showAfter = 300,
  className = "",
  iconSize = 24,
  position = "bottom-8 right-8",
  color = "bg-primary",
  hoverColor = "hover:bg-primaryDark",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled beyond the specified height
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed ${position} ${color} ${hoverColor} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={iconSize} />
        </button>
      )}
    </>
  );
};

// Default props
ScrollToTopButton.defaultProps = {
  showAfter: 300,
  iconSize: 24,
  position: "bottom-8 right-8",
  color: "bg-primary",
  hoverColor: "hover:bg-primaryDark",
};

export default ScrollToTopButton;
