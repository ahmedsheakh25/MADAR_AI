import React, { useEffect, ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  header, 
  footer,
  className = ''
}) => {
  const { height, width, isMobile, deviceType } = useResponsive();

  useEffect(() => {
    // Prevent body scroll on mount and manage viewport
    const originalBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      height: document.body.style.height,
      width: document.body.style.width
    };
    
    // Lock viewport
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    
    // Handle iOS viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--actual-vh', `${window.innerHeight}px`);
    };
    
    setVH();
    
    // Set device class for CSS targeting
    document.documentElement.classList.remove('mobile', 'tablet', 'desktop');
    document.documentElement.classList.add(deviceType);
    
    // Handle resize and orientation change
    const handleResize = () => {
      setTimeout(setVH, 100); // Delay to ensure accurate measurements
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Prevent iOS bounce
    const preventBounce = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      const target = e.target as Element;
      const scrollableParent = target.closest('.overflow-y-auto-safe, .layout-sidebar, .modal-body');
      
      if (!scrollableParent) {
        e.preventDefault();
      }
    };
    
    // Only add touch prevention on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.addEventListener('touchmove', preventBounce, { passive: false });
    }
    
    return () => {
      // Restore original styles
      Object.entries(originalBodyStyle).forEach(([property, value]) => {
        (document.body.style as any)[property] = value;
      });
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.removeEventListener('touchmove', preventBounce);
      }
    };
  }, [deviceType]);

  const layoutStyle = {
    height: `${height}px`,
    width: `${width}px`,
    maxHeight: `${height}px`,
    maxWidth: `${width}px`,
  };

  return (
    <div 
      className={`app-container overflow-hidden-all ${className}`}
      style={layoutStyle}
    >
      {header && (
        <header 
          className="app-header flex-shrink-0"
          style={{ height: 'var(--header-height)' }}
        >
          {header}
        </header>
      )}
      
      <main 
        className="page-content flex-1 overflow-hidden flex flex-col"
        style={{ 
          maxHeight: header ? 'calc(var(--content-height) - var(--header-height))' : 'var(--content-height)',
          paddingBottom: isMobile ? 'var(--dock-height)' : '80px' // Account for dock
        }}
      >
        <div className="content-inner flex-1 overflow-hidden">
          {children}
        </div>
      </main>
      
      {footer && (
        <footer 
          className="app-footer flex-shrink-0"
          style={{ height: 'var(--footer-height)' }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
};

// Higher-order component for easy wrapping
export const withResponsiveLayout = <P extends object>(
  Component: React.ComponentType<P>,
  layoutProps?: Omit<ResponsiveLayoutProps, 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ResponsiveLayout {...layoutProps}>
      <Component {...(props as P)} ref={ref} />
    </ResponsiveLayout>
  ));
  
  WrappedComponent.displayName = `withResponsiveLayout(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ResponsiveLayout; 