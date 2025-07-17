export const config = {
  // Preserve original fonts - CRITICAL REQUIREMENT
  typography: {
    fontFamily: {
      // Keep your existing font families from global.css
      primary: "var(--font-body-en)", // Inter for English
      secondary: "var(--font-heading-en)", // Funnel Display for headings
      arabic: "var(--font-arabic)", // IBM Plex Sans Arabic
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Map existing colors to Once UI's semantic system
  colors: {
    // Primary gradient mapping (purple/magenta gradient)
    primary: {
      50: "hsl(264, 100%, 95%)",
      100: "hsl(264, 100%, 90%)",
      200: "hsl(264, 100%, 80%)",
      300: "hsl(264, 100%, 70%)",
      400: "hsl(264, 100%, 60%)",
      500: "hsl(264, 100%, 50%)", // Your primary color
      600: "hsl(264, 100%, 45%)",
      700: "hsl(264, 100%, 40%)",
      800: "hsl(264, 100%, 35%)",
      900: "hsl(264, 100%, 30%)",
    },

    // Secondary/accent colors
    secondary: {
      50: "hsl(217, 33%, 95%)",
      100: "hsl(217, 33%, 90%)",
      200: "hsl(217, 33%, 80%)",
      300: "hsl(217, 33%, 70%)",
      400: "hsl(217, 33%, 50%)",
      500: "hsl(217, 33%, 18%)", // Your secondary color
      600: "hsl(217, 33%, 15%)",
      700: "hsl(217, 33%, 12%)",
      800: "hsl(217, 33%, 10%)",
      900: "hsl(217, 33%, 8%)",
    },

    // Background colors (dark theme)
    background: {
      primary: "hsl(0, 0%, 2%)", // Your background
      secondary: "hsl(0, 0%, 6%)", // Your card background
      tertiary: "hsl(217, 33%, 18%)", // Your muted background
    },

    // Text colors
    text: {
      primary: "hsl(210, 40%, 98%)", // Your foreground
      secondary: "hsl(215, 20%, 65%)", // Your muted-foreground
      accent: "hsl(264, 100%, 50%)", // Your primary for accent text
    },

    // Border colors
    border: {
      primary: "hsl(217, 33%, 18%)", // Your border
      secondary: "rgba(255, 255, 255, 0.1)", // Your glass-border
    },

    // Status colors
    destructive: {
      500: "hsl(0, 84%, 60%)", // Your destructive color
    },
  },

  // Spacing system (map to your existing spacing)
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  // Border radius mapping
  radius: {
    none: "0",
    sm: "calc(var(--radius) - 4px)", // Your sm radius
    md: "calc(var(--radius) - 2px)", // Your md radius
    lg: "var(--radius)", // Your lg radius (0.75rem)
    xl: "1rem",
    full: "9999px",
  },

  // Preserve your gradient definitions
  gradients: {
    primary:
      "linear-gradient(135deg, hsl(264, 100%, 50%) 0%, hsl(302, 100%, 50%) 100%)",
  },

  // Glass morphism effects
  effects: {
    glass: {
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
  },

  // Animation settings
  animations: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // RTL support configuration
  direction: {
    default: "ltr",
    rtl: "rtl",
  },

  // Theme configuration
  theme: {
    default: "dark", // Since your app uses dark theme
    light: {
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(0, 0%, 10%)",
    },
    dark: {
      background: "hsl(0, 0%, 2%)",
      foreground: "hsl(210, 40%, 98%)",
    },
  },
};

export type Config = typeof config;
