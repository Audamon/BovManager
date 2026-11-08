/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemePreference } from '@/hooks/theme-preference';

export function useTheme() {
  const scheme = useColorScheme();
  const { preference } = useThemePreference();
  const theme = preference === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : preference;

  return Colors[theme];
}
