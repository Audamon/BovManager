import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";
interface StatusBadgeProps {
  text: string;
  color: string;
}
const StatusBadge = ({ text, color }: StatusBadgeProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        style.badge,
        { backgroundColor: color ? color : "transparent", paddingHorizontal: color ? 9 : 0 },
      ]}
    >
      <Text
        style={[
          style.text,
          {
            color: color ? theme.onDanger : theme.textSecondary,
            fontWeight: color ? "bold" : "normal",
            textTransform: color ? "uppercase" : "none",
            fontSize: color ? 10 : 12,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};
const style = StyleSheet.create({
  badge: {
    borderRadius: 8,
    height: 21,
    paddingVertical: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    lineHeight: 12,
  },
});
export default StatusBadge;
