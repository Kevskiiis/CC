// Centralized theme colors used across the app
export const COLORS = {
  // App background
  background: '#D2C1B6',      // <- keep the value you actually use

  // Cards/forms/surfaces
  surface: '#fff5f0',

  // Primary UI (filled buttons, appbar)
  primary: '#1a1a1aff',

  // Text color that appears ON top of primary surfaces (button label color)
  onPrimary: '#DDAB53',       // <- alias for your beige/gold

  primaryTextDark: '#a0814bff',

  // Accent text you’ve been using on primary
  primaryText: '#DDAB53',

  // Regular text on light backgrounds
  text: '#1a1a1a',            // <- add this alias to match HomeScreen use

  // Plain text on dark backgrounds (if you need it elsewhere)
  textOnDark: '#ffffff',

  // Inputs / light surfaces
  inputBg: '#ecececff',

  // Borders / hairlines
  border: '#1a1a1aff',

  // Dimmed/placeholder text
  textDim: '#8a8a8a',
};
export type AppColors = typeof COLORS;