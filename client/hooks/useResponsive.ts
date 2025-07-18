import { useState, useEffect, useCallback } from 'react';

export interface ResponsiveDimensions {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  scale: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  safeArea: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const useResponsive = (): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLandscape: false,
        scale: 1,
        deviceType: 'desktop',
        safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const isDesktop = width >= 1024;
    const isLandscape = width > height;

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
      scale: calculateScale(width),
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      safeArea: getSafeArea()
    };
  });

  const calculateScale = useCallback((width: number): number => {
    // Dynamic scale calculation based on design base width
    const baseWidth = 1440;
    const minScale = 0.8;
    const maxScale = 1.2;
    
    let scale = width / baseWidth;
    scale = Math.max(minScale, Math.min(maxScale, scale));
    
    return scale;
  }, []);

  const getSafeArea = useCallback(() => {
    if (typeof window === 'undefined') {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    // Try to get safe area insets from CSS environment variables
    const style = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0', 10),
      right: parseInt(style.getPropertyValue('--sar') || '0', 10),
      bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
      left: parseInt(style.getPropertyValue('--sal') || '0', 10)
    };
  }, []);

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const isDesktop = width >= 1024;
    const isLandscape = width > height;
    const scale = calculateScale(width);
    const safeArea = getSafeArea();
    
    setDimensions({
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
      scale,
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      safeArea
    });
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--vw-actual', `${width}px`);
    root.style.setProperty('--vh-actual', `${height}px`);
    root.style.setProperty('--scale-computed', scale.toString());
    
    // Update viewport height for mobile browsers
    const vh = height * 0.01;
    root.style.setProperty('--vh', `${vh}px`);
  }, [calculateScale, getSafeArea]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial values
    updateDimensions();
    
    // Create debounced handler to avoid excessive updates
    let timeoutId: number;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateDimensions, 150);
    };

    // Add event listeners
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', () => {
      // Delay orientation change to let browser adjust
      setTimeout(updateDimensions, 200);
    });
    
    // Handle focus events that might change viewport on mobile
    window.addEventListener('focusin', debouncedUpdate);
    window.addEventListener('focusout', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', updateDimensions);
      window.removeEventListener('focusin', debouncedUpdate);
      window.removeEventListener('focusout', debouncedUpdate);
    };
  }, [updateDimensions]);

  return dimensions;
};

// Additional utility hooks for specific use cases
export const useBreakpoint = (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
  const { deviceType } = useResponsive();
  return deviceType === breakpoint;
};

export const useIsMobileDevice = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

export const useViewportSize = () => {
  const { width, height } = useResponsive();
  return { width, height };
};

export const useOrientation = () => {
  const { isLandscape } = useResponsive();
  return isLandscape ? 'landscape' : 'portrait';
}; 