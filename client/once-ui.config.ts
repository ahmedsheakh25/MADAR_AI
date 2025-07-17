import { type Config } from "./types/once-ui";

export const config: Config = {
  // CRITICAL: Preserve existing font families - DO NOT CHANGE
  typography: {
    fontFamily: {
      // Keep existing font families from the original theme
      primary: "var(--font-body-en)", // Inter for English body text
      secondary: "var(--font-arabic)", // IBM Plex Sans Arabic for Arabic text
      heading: "var(--font-heading-en)", // Funnel Display for English headings
    },
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Map existing colors to Once UI semantic system
  colors: {
    light: {
      primary: "hsl(264, 100%, 50%)",
      "primary-foreground": "hsl(210, 40%, 98%)",
      secondary: "hsl(217.2, 32.6%, 17.5%)",
      "secondary-foreground": "hsl(210, 40%, 98%)",
      accent: "hsl(264, 100%, 50%)",
      "accent-foreground": "hsl(210, 40%, 98%)",
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222.2, 84%, 4.9%)",
      card: "hsl(0, 0%, 100%)",
      "card-foreground": "hsl(222.2, 84%, 4.9%)",
      muted: "hsl(210, 40%, 96%)",
      "muted-foreground": "hsl(215.4, 16.3%, 46.9%)",
      border: "hsl(214.3, 31.8%, 91.4%)",
      input: "hsl(214.3, 31.8%, 91.4%)",
      ring: "hsl(264, 100%, 50%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
      "destructive-foreground": "hsl(210, 40%, 98%)",
    },
    dark: {
      primary: "hsl(264, 100%, 50%)",
      "primary-foreground": "hsl(210, 40%, 98%)",
      secondary: "hsl(217.2, 32.6%, 17.5%)",
      "secondary-foreground": "hsl(210, 40%, 98%)",
      accent: "hsl(264, 100%, 50%)",
      "accent-foreground": "hsl(210, 40%, 98%)",
      background: "hsl(0, 0%, 2%)",
      foreground: "hsl(210, 40%, 98%)",
      card: "hsl(0, 0%, 6%)",
      "card-foreground": "hsl(210, 40%, 98%)",
      muted: "hsl(217.2, 32.6%, 17.5%)",
      "muted-foreground": "hsl(215, 20.2%, 65.1%)",
      border: "hsl(217.2, 32.6%, 17.5%)",
      input: "hsl(217.2, 32.6%, 17.5%)",
      ring: "hsl(264, 100%, 50%)",
      destructive: "hsl(0, 84.2%, 60.2%)",
      "destructive-foreground": "hsl(210, 40%, 98%)",
    },
  },

  // Spacing scale matching Once UI conventions
  spacing: {
    none: "0",
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
    "5xl": "6rem", // 96px
  },

  // Border radius mapping
  radius: {
    none: "0",
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)", // 0.75rem (12px)
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  // Animation and motion settings
  motion: {
    // Disable motion for users who prefer reduced motion
    reduce: false,

    // Animation durations
    durations: {
      fast: 150,
      normal: 250,
      slow: 350,
    },

    // Easing functions
    ease: {
      default: [0.25, 1, 0.5, 1],
      linear: [0, 0, 1, 1],
      in: [0.42, 0, 1, 1],
      out: [0, 0, 0.58, 1],
      "in-out": [0.42, 0, 0.58, 1],
    },
  },

  // Component-specific configurations
  components: {
    button: {
      // Size variants
      sizes: {
        sm: { padding: "sm md", fontSize: "sm" },
        md: { padding: "md lg", fontSize: "base" },
        lg: { padding: "lg xl", fontSize: "lg" },
      },

      // Style variants
      variants: {
        primary: {
          background: "primary",
          color: "primary-foreground",
          hover: { scale: 1.02 },
        },
        secondary: {
          background: "secondary",
          color: "secondary-foreground",
          hover: { scale: 1.02 },
        },
        outline: {
          border: "1px solid",
          borderColor: "border",
          background: "transparent",
          color: "foreground",
          hover: { background: "accent", color: "accent-foreground" },
        },
        ghost: {
          background: "transparent",
          color: "foreground",
          hover: { background: "accent", color: "accent-foreground" },
        },
      },
    },

    card: {
      variants: {
        default: {
          background: "card",
          color: "card-foreground",
          border: "1px solid",
          borderColor: "border",
        },
        glass: {
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--glass-border)",
        },
        gradient: {
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            padding: "1px",
            background: "var(--gradient-primary)",
            borderRadius: "inherit",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          },
        },
      },
    },
  },

  // Theme switching configuration
  themes: {
    default: "dark", // Default theme for the app
    storage: "localStorage", // Where to store theme preference
  },

  // Responsive breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};
