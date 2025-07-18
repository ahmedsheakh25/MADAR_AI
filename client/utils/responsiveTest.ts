export interface TestResult {
  viewport: string;
  dimensions: string;
  verticalScroll: boolean;
  horizontalScroll: boolean;
  overflowCount: number;
  overflowElements: Array<{
    element: string;
    bounds: string;
    position: string;
    bottom: number;
    right: number;
  }>;
  performance: {
    renderTime: number;
    memoryUsage?: number;
  };
}

export const runResponsiveTests = (): TestResult[] => {
  const tests = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Surface Pro', width: 912, height: 1368 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Medium', width: 1440, height: 900 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 }
  ];

  const results: TestResult[] = [];

  // Store original dimensions
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;

  tests.forEach(({ name, width, height }) => {
    const startTime = performance.now();

    // Simulate viewport change
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    // Allow time for layout recalculation
    setTimeout(() => {
      // Check for scroll issues
      const hasVerticalScroll = document.body.scrollHeight > height;
      const hasHorizontalScroll = document.body.scrollWidth > width;
      
      // Find overflow elements
      const overflowElements: TestResult['overflowElements'] = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > height || rect.right > width) {
          // Skip if element is intentionally positioned off-screen
          const styles = window.getComputedStyle(el);
          if (styles.position === 'fixed' && 
              (parseInt(styles.left) < -1000 || parseInt(styles.top) < -1000)) {
            return;
          }

          overflowElements.push({
            element: el.className || el.tagName,
            bounds: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
            position: `${Math.round(rect.left)},${Math.round(rect.top)}`,
            bottom: Math.round(rect.bottom),
            right: Math.round(rect.right)
          });
        }
      });

      const renderTime = performance.now() - startTime;
      
      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ('memory' in performance) {
        memoryUsage = (performance as any).memory.usedJSHeapSize;
      }

      results.push({
        viewport: name,
        dimensions: `${width}x${height}`,
        verticalScroll: hasVerticalScroll,
        horizontalScroll: hasHorizontalScroll,
        overflowCount: overflowElements.length,
        overflowElements: overflowElements.slice(0, 5), // Top 5 overflow elements
        performance: {
          renderTime,
          memoryUsage
        }
      });
    }, 100);
  });

  // Restore original dimensions
  setTimeout(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalHeight,
    });
    window.dispatchEvent(new Event('resize'));
  }, tests.length * 150);

  return results;
};

export const analyzeResponsiveResults = (results: TestResult[]) => {
  const issues = {
    scrollIssues: results.filter(r => r.verticalScroll || r.horizontalScroll),
    overflowIssues: results.filter(r => r.overflowCount > 0),
    performanceIssues: results.filter(r => r.performance.renderTime > 100),
    criticalViewports: results.filter(r => 
      (r.verticalScroll || r.horizontalScroll) && 
      (r.viewport.includes('iPhone') || r.viewport.includes('Galaxy'))
    )
  };

  console.group('📊 Responsive Analysis Summary');
  console.log(`Total viewports tested: ${results.length}`);
  console.log(`Viewports with scroll issues: ${issues.scrollIssues.length}`);
  console.log(`Viewports with overflow issues: ${issues.overflowIssues.length}`);
  console.log(`Viewports with performance issues: ${issues.performanceIssues.length}`);
  console.log(`Critical mobile issues: ${issues.criticalViewports.length}`);

  if (issues.criticalViewports.length > 0) {
    console.warn('🚨 Critical mobile viewport issues detected:');
    console.table(issues.criticalViewports);
  }

  if (issues.overflowIssues.length > 0) {
    console.warn('⚠️ Common overflow elements:');
    const commonOverflows = new Map();
    issues.overflowIssues.forEach(result => {
      result.overflowElements.forEach(el => {
        const key = el.element;
        commonOverflows.set(key, (commonOverflows.get(key) || 0) + 1);
      });
    });
    console.table(Array.from(commonOverflows.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10));
  }

  console.groupEnd();

  return issues;
};

// Quick test function for development
export const quickResponsiveTest = () => {
  console.log('🔄 Running quick responsive test...');
  
  const currentViewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    hasVerticalScroll: document.body.scrollHeight > window.innerHeight,
    hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
  };

  console.log('Current viewport:', currentViewport);
  
  if (currentViewport.hasVerticalScroll || currentViewport.hasHorizontalScroll) {
    console.warn('⚠️ Scroll detected in current viewport');
    
    // Find elements causing overflow
    const overflowElements: string[] = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > window.innerHeight || rect.right > window.innerWidth) {
        overflowElements.push(el.className || el.tagName);
      }
    });
    
    console.log('Elements causing overflow:', [...new Set(overflowElements)].slice(0, 10));
  } else {
    console.log('✅ No scroll issues in current viewport');
  }
  
  return currentViewport;
};

// Export for global access in development
if (typeof window !== 'undefined') {
  (window as any).runResponsiveTests = runResponsiveTests;
  (window as any).quickResponsiveTest = quickResponsiveTest;
  (window as any).analyzeResponsiveResults = analyzeResponsiveResults;
} 