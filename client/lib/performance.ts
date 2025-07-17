/**
 * Performance utilities for bundle optimization and runtime monitoring
 */

import React, { lazy, ComponentType } from "react";

// Lazy loading utilities with loading fallbacks
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(factory);
  
  if (fallback) {
    const ComponentWithFallback = (props: any) => 
      React.createElement(
        React.Suspense,
        { fallback: React.createElement(fallback) },
        React.createElement(LazyComponent, props)
      );
    return ComponentWithFallback;
  }
  
  return LazyComponent;
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  
  static startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }
  
  static endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, "measure")[0] as PerformanceEntry;
    const duration = measure?.duration || 0;
    
    // Store metrics for analysis
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }
  
  static getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
  
  static getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    this.metrics.forEach((times, name) => {
      result[name] = {
        average: times.reduce((a, b) => a + b, 0) / times.length,
        count: times.length,
        latest: times[times.length - 1] || 0,
      };
    });
    
    return result;
  }
}

// Bundle size utilities
export function measureBundleSize() {
  if ("connection" in navigator) {
    const connection = (navigator as any).connection;
    const bundleInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
    
    console.log("Network info:", bundleInfo);
    return bundleInfo;
  }
  
  return null;
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if ("memory" in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }
  
  return null;
}

// Image optimization utilities
export function createOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
): string {
  // This would integrate with your image optimization service
  // For now, returning the original URL
  const params = new URLSearchParams();
  
  if (options.width) params.set("w", options.width.toString());
  if (options.height) params.set("h", options.height.toString());
  if (options.quality) params.set("q", options.quality.toString());
  if (options.format && options.format !== "auto") params.set("f", options.format);
  
  return params.toString() ? `${url}?${params}` : url;
}

// Resource preloading
export function preloadResource(url: string, type: "script" | "style" | "image" | "font") {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  
  switch (type) {
    case "script":
      link.as = "script";
      break;
    case "style":
      link.as = "style";
      break;
    case "image":
      link.as = "image";
      break;
    case "font":
      link.as = "font";
      link.crossOrigin = "anonymous";
      break;
  }
  
  document.head.appendChild(link);
  return link;
}

// Animation performance utilities
export function requestIdleCallback(callback: () => void, timeout = 5000) {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 1);
  }
}

export function cancelIdleCallback(id: number) {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Component performance wrapper
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName: string
) {
  return function PerformanceWrappedComponent(props: P) {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      PerformanceMonitor.endMeasure(`${componentName}-render`);
      
      if (endTime - startTime > 16) { // More than one frame
        console.warn(`${componentName} took ${endTime - startTime}ms to render`);
      }
    });
    
    PerformanceMonitor.startMeasure(`${componentName}-render`);
    return React.createElement(Component, props);
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Service Worker utilities for caching
export function registerServiceWorker(swUrl: string): Promise<ServiceWorkerRegistration> {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker.register(swUrl);
  }
  
  return Promise.reject(new Error("Service Worker not supported"));
}

// Critical CSS utilities
export function inlineCriticalCSS(css: string) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

// Web Vitals monitoring
export function measureWebVitals() {
  // This would integrate with web-vitals library
  // For now, measuring basic metrics
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "largest-contentful-paint") {
        console.log("LCP:", entry.startTime);
      }
      if (entry.entryType === "first-input") {
        console.log("FID:", (entry as any).processingStart - entry.startTime);
      }
      if (entry.entryType === "layout-shift") {
        console.log("CLS:", (entry as any).value);
      }
    }
  });
  
  observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] });
  return observer;
}

// Bundle analysis utilities
export function analyzeBundle() {
  const scripts = Array.from(document.scripts);
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  return {
    scriptCount: scripts.length,
    stylesheetCount: stylesheets.length,
    totalScriptSize: scripts.reduce((size, script) => {
      return size + (script.innerHTML?.length || 0);
    }, 0),
    externalScripts: scripts.filter(script => script.src).length,
    inlineScripts: scripts.filter(script => !script.src).length,
  };
} 