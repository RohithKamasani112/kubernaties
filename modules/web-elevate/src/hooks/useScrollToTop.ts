import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page when the route changes
 * @param behavior - Scroll behavior ('smooth' | 'auto' | 'instant')
 * @param delay - Optional delay in milliseconds before scrolling
 */
export const useScrollToTop = (
  behavior: ScrollBehavior = 'smooth',
  delay: number = 0
) => {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [location.pathname, behavior, delay]);
};

/**
 * Function to manually scroll to top
 * @param behavior - Scroll behavior ('smooth' | 'auto' | 'instant')
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * Function to scroll to a specific element
 * @param elementId - ID of the element to scroll to
 * @param behavior - Scroll behavior ('smooth' | 'auto' | 'instant')
 * @param offset - Optional offset from the top in pixels
 */
export const scrollToElement = (
  elementId: string,
  behavior: ScrollBehavior = 'smooth',
  offset: number = 0
) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior
    });
  }
};
