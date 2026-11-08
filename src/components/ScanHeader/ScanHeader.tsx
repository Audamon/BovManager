import { PALETTE } from "@/constants/colors";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Appbar } from "react-native-paper";
import ArrowBackIcon from "../icons/ArrowBackIcon";
import FlashIcon from "../icons/FlashIcon";
import { useRouter } from "expo-router";
interface ScanHeaderProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBackPress?: () => void;
  zIndex?: number;
  backgroundColor?: string;
  onFlashPress?: () => void;
  showFlashIcon?: boolean;
  title?: string;
  /** Overlay escuro da câmera ligada: o fundo é sempre quase preto, nos dois
   * temas, então o texto precisa ficar sempre na cor clara, não na que o
   * tema resolveria (que ficaria escura demais no tema claro). */
  overCamera?: boolean;
}
const ScanHeader = ({
  leftIcon,
  zIndex,
  backgroundColor,
  onFlashPress,
  showFlashIcon,
  title = "Escanear Brinco",
  overCamera,
}: ScanHeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const contentColor = overCamera ? PALETTE.neutral[300] : theme.textSecondary;
  return (
    <Appbar.Header
      statusBarHeight={0}
      style={{ backgroundColor: backgroundColor || theme.background, elevation: 0, zIndex }}
    >
      <Appbar.Action
        onPress={() => router.back()}
        color={contentColor}
        icon={({ size, color }) => <ArrowBackIcon color={color} width={size} height={size} />}
      />
      {leftIcon}
      <Appbar.Content title={title} color={contentColor} />
      {showFlashIcon && (
        <Appbar.Action
          onPress={onFlashPress}
          color={contentColor}
          icon={({ size, color }) => <FlashIcon color={color} width={size} height={size} />}
        />
      )}
    </Appbar.Header>
  );
};

export default ScanHeader;
