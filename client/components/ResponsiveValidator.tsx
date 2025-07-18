import React, { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { quickResponsiveTest } from '../utils/responsiveTest';

interface ResponsiveValidatorProps {
  showInProduction?: boolean;
}

export const ResponsiveValidator: React.FC<ResponsiveValidatorProps> = ({
  showInProduction = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const responsive = useResponsive();

  useEffect(() => {
    // Only show in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' || showInProduction) {
      setIsVisible(true);
    }
  }, [showInProduction]);

  const runTest = () => {
    const results = quickResponsiveTest();
    setTestResults(results);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <div className="mb-2 font-bold">Responsive Validator</div>
      
      <div className="space-y-1 mb-3">
        <div>Device: {responsive.deviceType}</div>
        <div>Size: {responsive.width}x{responsive.height}</div>
        <div>Scale: {responsive.scale.toFixed(2)}</div>
        <div>Orientation: {responsive.isLandscape ? 'landscape' : 'portrait'}</div>
      </div>

      <button 
        onClick={runTest}
        className="bg-blue-600 px-2 py-1 rounded text-xs mb-2"
      >
        Run Test
      </button>

      {testResults && (
        <div className="space-y-1">
          <div className={testResults.hasVerticalScroll ? 'text-red-400' : 'text-green-400'}>
            V-Scroll: {testResults.hasVerticalScroll ? 'FAIL' : 'PASS'}
          </div>
          <div className={testResults.hasHorizontalScroll ? 'text-red-400' : 'text-green-400'}>
            H-Scroll: {testResults.hasHorizontalScroll ? 'FAIL' : 'PASS'}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
};

export default ResponsiveValidator; 