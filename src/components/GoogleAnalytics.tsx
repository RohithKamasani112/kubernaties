import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking ID
const GA_TRACKING_ID = 'G-E0RJ7PRRGB';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Google Analytics component for tracking page views
export const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views when route changes
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

// Utility functions for tracking events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for common events
export const trackCourseStart = (courseName: string) => {
  trackEvent('course_start', 'engagement', courseName);
};

export const trackCourseComplete = (courseName: string) => {
  trackEvent('course_complete', 'engagement', courseName);
};

export const trackChallengeStart = (challengeName: string) => {
  trackEvent('challenge_start', 'engagement', challengeName);
};

export const trackChallengeComplete = (challengeName: string, timeSpent?: number) => {
  trackEvent('challenge_complete', 'engagement', challengeName, timeSpent);
};

export const trackPlaygroundOpen = (projectName: string) => {
  trackEvent('playground_open', 'engagement', projectName);
};

export const trackFeedbackSubmit = (feedbackType: string) => {
  trackEvent('feedback_submit', 'engagement', feedbackType);
};

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', 'engagement', videoTitle);
};

export const trackDownload = (fileName: string) => {
  trackEvent('download', 'engagement', fileName);
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'engagement', searchTerm);
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', 'interaction', `${buttonName}_${location}`);
};

export default GoogleAnalytics;
