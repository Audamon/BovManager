import { COLORS } from "@/constants/colors";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onBackPress?: () => void;
}
const AppHeader = ({ title, subtitle, icon, leftIcon, rightIcon, onBackPress }: AppHeaderProps) => {
  const theme = useTheme();
  return (
    <Appbar.Header style={[style.header, { backgroundColor: theme.primary }]} statusBarHeight={0}>
      {onBackPress && <Appbar.BackAction onPress={onBackPress} color={COLORS.surface} />}
      {leftIcon}
      <Appbar.Content
        title={
          <View>
            <Text style={{ color: theme.textTherdiary, fontWeight: 700 }}>{title}</Text>
            {subtitle && (
              <Text style={{ color: theme.textTherdiary, opacity: 0.85, fontSize: 12 }}>
                {subtitle}
              </Text>
            )}
          </View>
        }
      />
      {rightIcon}
    </Appbar.Header>
  );
};
const style = StyleSheet.create({
  header: {
    height: 74,
    //display: "flex",
    //justifyContent: "center",
    backgroundColor: COLORS.primary,
    //alignItems: "center",
  },
});

export default AppHeader;
