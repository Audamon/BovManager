import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Appbar } from "react-native-paper";
import ArrowBackIcon from "../icons/ArrowBackIcon";
interface ScanHeaderProps {
  leftIcon?: React.ReactNode;
  onBackPress?: () => void;
}
const ScanHeader = ({ leftIcon, onBackPress }: ScanHeaderProps) => {
  const theme = useTheme();
  return (
    <Appbar.Header statusBarHeight={0} style={{ backgroundColor: theme.background, elevation: 0 }}>
      <Appbar.Action
        onPress={onBackPress}
        color={theme.textSecondary}
        icon={({ size, color }) => <ArrowBackIcon color={color} width={size} height={size} />}
      />
      {leftIcon}
      <Appbar.Content title="Escanear Brinco" color={theme.textSecondary} />
    </Appbar.Header>
  );
};

export default ScanHeader;
