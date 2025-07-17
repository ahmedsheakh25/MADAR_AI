/**
 * Accessibility utilities for keyboard navigation and ARIA support
 */

import { useEffect, useRef, useCallback } from "react";

// Keyboard navigation utilities
export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;

// Focus management utilities
export class FocusManager {
  private static trapStack: HTMLElement[] = [];

  static trapFocus(element: HTMLElement) {
    this.trapStack.push(element);
    this.setTrapFocus(element);
  }

  static releaseFocus() {
    if (this.trapStack.length > 0) {
      this.trapStack.pop();
      const previousTrap = this.trapStack[this.trapStack.length - 1];
      if (previousTrap) {
        this.setTrapFocus(previousTrap);
      }
    }
  }

  private static setTrapFocus(element: HTMLElement) {
    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstFocusable.focus();

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== KEYBOARD_KEYS.TAB) return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    
    // Store cleanup function
    (element as any)._focusTrapCleanup = () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  }

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(",");

    return Array.from(container.querySelectorAll(focusableSelectors));
  }

  static saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  }

  static restoreFocus(element: HTMLElement | null) {
    if (element && element.focus) {
      element.focus();
    }
  }
}

// Custom hooks for accessibility
export function useFocusTrap(active: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    FocusManager.trapFocus(container);

    return () => {
      FocusManager.releaseFocus();
      if ((container as any)._focusTrapCleanup) {
        (container as any)._focusTrapCleanup();
      }
    };
  }, [active]);

  return containerRef;
}

export function useKeyboardNavigation(
  onKeyDown?: (event: KeyboardEvent) => void,
  dependencies: any[] = []
) {
  const elementRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    onKeyDown?.(event);
  }, dependencies);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return elementRef;
}

export function useArrowKeyNavigation(
  items: HTMLElement[],
  orientation: "horizontal" | "vertical" | "both" = "vertical",
  loop: boolean = true
) {
  const currentIndex = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndex.current;

      switch (key) {
        case KEYBOARD_KEYS.ARROW_UP:
          if (orientation === "vertical" || orientation === "both") {
            event.preventDefault();
            newIndex = loop 
              ? (currentIndex.current - 1 + items.length) % items.length
              : Math.max(0, currentIndex.current - 1);
          }
          break;

        case KEYBOARD_KEYS.ARROW_DOWN:
          if (orientation === "vertical" || orientation === "both") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndex.current + 1) % items.length
              : Math.min(items.length - 1, currentIndex.current + 1);
          }
          break;

        case KEYBOARD_KEYS.ARROW_LEFT:
          if (orientation === "horizontal" || orientation === "both") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndex.current - 1 + items.length) % items.length
              : Math.max(0, currentIndex.current - 1);
          }
          break;

        case KEYBOARD_KEYS.ARROW_RIGHT:
          if (orientation === "horizontal" || orientation === "both") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndex.current + 1) % items.length
              : Math.min(items.length - 1, currentIndex.current + 1);
          }
          break;

        case KEYBOARD_KEYS.HOME:
          event.preventDefault();
          newIndex = 0;
          break;

        case KEYBOARD_KEYS.END:
          event.preventDefault();
          newIndex = items.length - 1;
          break;
      }

      if (newIndex !== currentIndex.current && items[newIndex]) {
        currentIndex.current = newIndex;
        items[newIndex].focus();
      }
    },
    [items, orientation, loop]
  );

  return { currentIndex: currentIndex.current, handleKeyDown };
}

// ARIA utilities
export function generateId(prefix: string = "ui"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.style.width = "1px";
  announcement.style.height = "1px";
  announcement.style.overflow = "hidden";

  document.body.appendChild(announcement);
  announcement.textContent = message;

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Skip link utilities
export function createSkipLink(targetId: string, text: string = "Skip to main content") {
  const skipLink = document.createElement("a");
  skipLink.href = `#${targetId}`;
  skipLink.className = "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md";
  skipLink.textContent = text;
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  return skipLink;
}

// Keyboard shortcut manager
export class KeyboardShortcutManager {
  private static shortcuts = new Map<string, () => void>();

  static register(combination: string, callback: () => void) {
    this.shortcuts.set(combination.toLowerCase(), callback);
  }

  static unregister(combination: string) {
    this.shortcuts.delete(combination.toLowerCase());
  }

  static init() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private static handleKeyDown(event: KeyboardEvent) {
    const combination = this.getCombination(event);
    const callback = this.shortcuts.get(combination);
    
    if (callback) {
      event.preventDefault();
      callback();
    }
  }

  private static getCombination(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push("ctrl");
    if (event.altKey) parts.push("alt");
    if (event.shiftKey) parts.push("shift");
    if (event.metaKey) parts.push("meta");
    
    parts.push(event.key.toLowerCase());
    
    return parts.join("+");
  }
}

// Color contrast utilities
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // Simplified contrast calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - you'd want proper color parsing
    return 0.5; // Placeholder
  };

  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
               (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
}

// Initialize keyboard shortcuts on module load
if (typeof window !== "undefined") {
  KeyboardShortcutManager.init();
} 