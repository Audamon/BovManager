import React from "react";
import { View } from "react-native";

interface IconBadgeProps {
  icon?: React.ReactNode;
  size?: number;
  backgroundColor: string;
}
const IconBadge = ({ icon, size = 40, backgroundColor }: IconBadgeProps) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {icon}
    </View>
  );
};
export default IconBadge;
