/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { COLORS, PALETTE } from './colors';

/**
 * Tokens semânticos claro/escuro, derivados da PALETTE em `colors.ts`.
 * Nada aqui é um hex "solto" — cada linha aponta pro degrau da rampa de
 * onde veio, então dá pra rastrear qualquer cor até a família de origem.
 */
export const Colors = {
  light: {
    // superfícies
    background: COLORS.background, // fundo de tela
    backgroundElement: PALETTE.neutral[100], // item de lista alternado, input desabilitado
    backgroundSelected: PALETTE.neutral[200], // item de lista selecionado
    surface: COLORS.surface, // cards, modais, folha de bottom sheet
    border: PALETTE.neutral[200], // borda de input, divisor de lista

    // texto
    text: COLORS.textMain,
    textSecondary: COLORS.textMuted,
    textTherdiary: COLORS.surface,
    // marca
    primary: COLORS.primary, // header do app, botão primário, tab ativa
    primaryPressed: PALETTE.primary[600], // estado pressed/hover do botão primário
    onPrimary: PALETTE.neutral[0], // texto/ícone sobre fundo primary

    secondary: COLORS.secondary, // CTA "Escanear brinco" — único por tela
    secondaryPressed: PALETTE.secondary[600], // estado pressed/hover do CTA
    onSecondary: PALETTE.neutral[900], // texto/ícone escuro sobre fundo secondary (5.6:1 — branco ficaria em 2.9:1)

    // estados do rebanho (saúde, vacinação, transferência) — sempre selo com
    // fundo sólido, nunca fundo em tom pastel: um tom pastel quase some sob
    // sol forte (a diferença pro branco do card fica abaixo de 1.2:1)
    success: PALETTE.success[700], // fundo do selo "Saudável" / "Vacinado" — 6.7:1 com texto branco
    onSuccess: PALETTE.neutral[0],
    danger: PALETTE.danger[600], // fundo do selo "Doente" / erro de leitura — 7.4:1 com texto branco
    onDanger: PALETTE.neutral[0],
  },
  dark: {
    // superfícies
    background: PALETTE.neutral[900], // fundo de tela
    backgroundElement: PALETTE.neutral[700], // item de lista alternado, input desabilitado
    backgroundSelected: PALETTE.neutral[700], // item de lista selecionado
    surface: PALETTE.neutral[800], // cards, modais, folha de bottom sheet
    border: PALETTE.neutral[700], // borda de input, divisor de lista

    // texto
    text: PALETTE.neutral[50],
    textSecondary: PALETTE.neutral[300],
    textTherdiary: PALETTE.neutral[300],
    // marca — tons mais claros da rampa, pra manter contraste no fundo escuro
    primary: PALETTE.neutral[800],
    primaryPressed: PALETTE.primary[400],
    onPrimary: PALETTE.primary[900],

    secondary: PALETTE.secondary[300],
    secondaryPressed: PALETTE.secondary[400],
    onSecondary: PALETTE.neutral[900],

    // estados do rebanho — mesmo fundo sólido do modo claro: é uma cor de
    // status, não decoração de tela, então não precisa (e não deve) mudar
    // com o tema
    success: PALETTE.success[700],
    onSuccess: PALETTE.neutral[0],
    danger: PALETTE.danger[600],
    onDanger: PALETTE.neutral[0],
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
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
