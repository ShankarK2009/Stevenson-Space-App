import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    isDark,
    colors: {
      // Stevenson brand colors
      stevensonGold: "#D4AF37",
      stevensonGreen: "#00693E",

      // Background colors with gradients
      background: isDark ? "#0A0A0A" : "#FFFFFF",
      surface: isDark ? "#1A1A1A" : "#FFFFFF",
      surfaceElevated: isDark ? "#252525" : "#F8F9FA",

      // Gradient colors
      gradientStart: isDark ? "#1A1A1A" : "#FFFFFF",
      gradientEnd: isDark ? "#00693E" : "#D4AF37",

      // Text colors
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      textSecondary: isDark ? "rgba(255, 255, 255, 0.7)" : "#6B7280",
      textTertiary: isDark ? "rgba(255, 255, 255, 0.5)" : "#9CA3AF",

      // Interactive colors
      primary: "#D4AF37",
      primaryDark: "#00693E",
      accent: isDark ? "#D4AF37" : "#00693E",

      // Border and separator colors
      border: isDark ? "#2A2A2A" : "#E5E7EB",
      borderLight: isDark ? "#222222" : "#F3F4F6",
      separator: isDark ? "#333333" : "#E5E7EB",

      // Input and field colors
      inputBackground: isDark ? "#2A2A2A" : "#F3F4F6",
      inputBackgroundFocused: isDark ? "#333333" : "#E5E7EB",
      placeholder: isDark ? "rgba(255, 255, 255, 0.4)" : "#9CA3AF",

      // Status bar
      statusBarStyle: isDark ? "light" : "dark",

      // Card and container colors
      cardBackground: isDark ? "#1E1E1E" : "#FFFFFF",
      cardBorder: isDark ? "#2A2A2A" : "#E5E7EB",

      // Button colors
      buttonSecondary: isDark ? "#2A2A2A" : "#F3F4F6",
      buttonSecondaryText: isDark ? "#D4AF37" : "#00693E",

      // Status colors
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
