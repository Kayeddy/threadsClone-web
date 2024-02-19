"use client";
import React, { useEffect, useState } from "react";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";

/**
 * ScrollToTopIndicator component to show a scroll-to-top button after scrolling down.
 */
const ScrollToTopIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Toggles visibility of the scroll-to-top button based on the page's scroll position.
   */
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  /**
   * Smoothly scrolls the user to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-[400px] bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out z-50 bg-dark-1 p-4"
        >
          <DoubleArrowUpIcon />
        </button>
      )}
    </>
  );
};

export default ScrollToTopIndicator;
