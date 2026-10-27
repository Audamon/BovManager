import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Appbar } from "react-native-paper";
import ArrowBackIcon from "../icons/ArrowBackIcon";
import FlashIcon from "../icons/FlashIcon";
interface ScanHeaderProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBackPress?: () => void;
  zIndex?: number;
  backgroundColor?: string;
  onFlashPress?: () => void;
  showFlashIcon?: boolean;
}
const ScanHeader = ({
  leftIcon,
  onBackPress,
  zIndex,
  backgroundColor,
  onFlashPress,
  showFlashIcon,
}: ScanHeaderProps) => {
  const theme = useTheme();
  return (
    <Appbar.Header
      statusBarHeight={0}
      style={{ backgroundColor: backgroundColor || theme.background, elevation: 0, zIndex }}
    >
      <Appbar.Action
        onPress={onBackPress}
        color={theme.textSecondary}
        icon={({ size, color }) => <ArrowBackIcon color={color} width={size} height={size} />}
      />
      {leftIcon}
      <Appbar.Content title="Escanear Brinco" color={theme.textSecondary} />
      {showFlashIcon && (
        <Appbar.Action
          onPress={onFlashPress}
          color={theme.textSecondary}
          icon={({ size, color }) => <FlashIcon color={color} width={size} height={size} />}
        />
      )}
    </Appbar.Header>
  );
};

export default ScanHeader;
