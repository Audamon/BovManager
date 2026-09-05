import TabIconProps from "./TabIconTypes";
import Svg, { Circle, Path } from "react-native-svg";
const UserIcon = ({ width, height, color }: TabIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="1.8"
      style={{ width: width, height: height }}
    >
      <Circle cx="12" cy="8" r="3.4" />
      <Path d="M5 20c1-3.8 4-5.6 7-5.6s6 1.8 7 5.6" />
    </Svg>
  );
};

export default UserIcon;
