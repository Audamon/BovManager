import "@/global.css";

import { Platform } from "react-native";

import { COLORS, PALETTE } from "./colors";

export const Colors = {
  light: {
    background: COLORS.background,
    backgroundElement: PALETTE.neutral[100],
    backgroundSelected: PALETTE.neutral[200],
    surface: COLORS.surface,
    border: PALETTE.neutral[200],
    iconBadge: PALETTE.neutral[500],
    onIconBadge: PALETTE.neutral[0],
    authBackground: PALETTE.primary[100],

    text: COLORS.textMain,
    textSecondary: COLORS.textMuted,
    textTherdiary: COLORS.surface,
    segmentedUnselected: PALETTE.primary[400],
    primary: COLORS.primary,
    primaryPressed: PALETTE.primary[600],
    onPrimary: PALETTE.neutral[0],

    secondary: COLORS.secondary,
    secondaryPressed: PALETTE.secondary[600],
    onSecondary: PALETTE.neutral[900],

    success: PALETTE.success[700],
    onSuccess: PALETTE.neutral[0],
    danger: PALETTE.danger[600],
    onDanger: PALETTE.neutral[0],
  },
  dark: {
    background: PALETTE.neutral[900],
    backgroundElement: PALETTE.neutral[700],
    backgroundSelected: PALETTE.neutral[700],
    surface: PALETTE.neutral[800],
    border: PALETTE.neutral[700],
    iconBadge: PALETTE.neutral[500],
    onIconBadge: PALETTE.neutral[0],
    authBackground: PALETTE.neutral[900],

    text: PALETTE.neutral[50],
    textSecondary: PALETTE.neutral[300],
    textTherdiary: PALETTE.neutral[300],
    segmentedUnselected: PALETTE.neutral[300],
    primary: PALETTE.neutral[800],
    primaryPressed: PALETTE.primary[300],
    onPrimary: PALETTE.primary[900],

    secondary: PALETTE.secondary[300],
    secondaryPressed: PALETTE.secondary[400],
    onSecondary: PALETTE.neutral[900],

    success: PALETTE.success[700],
    onSuccess: PALETTE.neutral[0],
    danger: PALETTE.danger[600],
    onDanger: PALETTE.neutral[0],
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
