export interface ColorPalette {
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  accent: string;
  "accent-foreground": string;
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  muted: string;
  "muted-foreground": string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  "destructive-foreground": string;
}

export interface Typography {
  fontFamily: {
    primary: string;
    secondary: string;
    heading: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
  };
  weights: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface Spacing {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
}

export interface Radius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
}

export interface Motion {
  reduce: boolean;
  durations: {
    fast: number;
    normal: number;
    slow: number;
  };
  ease: {
    default: number[];
    linear: number[];
    in: number[];
    out: number[];
    "in-out": number[];
  };
}

export interface ComponentConfig {
  button: {
    sizes: Record<string, { padding: string; fontSize: string }>;
    variants: Record<string, any>;
  };
  card: {
    variants: Record<string, any>;
  };
}

export interface Config {
  typography: Typography;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  spacing: Spacing;
  radius: Radius;
  motion: Motion;
  components: ComponentConfig;
  themes: {
    default: "light" | "dark";
    storage: "localStorage" | "sessionStorage";
  };
  breakpoints: Record<string, string>;
}

export type Theme = "light" | "dark";

export interface OnceUIContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  config: Config;
}
