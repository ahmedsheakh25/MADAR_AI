const auditResponsive = () => {
  const issues = [];
  
  // Check viewport overflow
  if (document.body.scrollHeight > window.innerHeight) {
    issues.push(`Vertical scroll detected: ${document.body.scrollHeight}px > ${window.innerHeight}px`);
  }
  
  if (document.body.scrollWidth > window.innerWidth) {
    issues.push(`Horizontal scroll detected: ${document.body.scrollWidth}px > ${window.innerWidth}px`);
  }
  
  // Find overflowing elements
  const overflowElements = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > window.innerHeight || rect.right > window.innerWidth) {
      overflowElements.push({
        element: el.className || el.tagName,
        bounds: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        position: `${Math.round(rect.left)},${Math.round(rect.top)}`,
        bottom: Math.round(rect.bottom),
        right: Math.round(rect.right)
      });
    }
  });

  // Check for fixed positioned elements that might cause issues
  const fixedElements = [];
  document.querySelectorAll('*').forEach(el => {
    const styles = window.getComputedStyle(el);
    if (styles.position === 'fixed') {
      fixedElements.push({
        element: el.className || el.tagName,
        position: styles.position,
        zIndex: styles.zIndex
      });
    }
  });

  console.group('🔍 Responsive Audit Results');
  console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
  console.log('Document size:', `${document.body.scrollWidth}x${document.body.scrollHeight}`);
  
  if (issues.length > 0) {
    console.warn('⚠️ Issues found:', issues);
  } else {
    console.log('✅ No scroll issues detected');
  }
  
  if (overflowElements.length > 0) {
    console.warn('📏 Overflowing elements:', overflowElements.slice(0, 10)); // Show first 10
  }
  
  if (fixedElements.length > 0) {
    console.log('📌 Fixed positioned elements:', fixedElements);
  }
  
  console.groupEnd();
  
  return { issues, overflowElements, fixedElements };
};

// Run on mount and resize
const debouncedAudit = (() => {
  let timeoutId;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(auditResponsive, 300);
  };
})();

window.addEventListener('load', auditResponsive);
window.addEventListener('resize', debouncedAudit);
window.addEventListener('orientationchange', debouncedAudit);

// Export for manual testing
if (typeof window !== 'undefined') {
  window.auditResponsive = auditResponsive;
}

export { auditResponsive }; 