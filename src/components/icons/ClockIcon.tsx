import Svg, { Circle, Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const ClockIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="1.8"
      style={{ width: width, height: height }}
    >
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 7.5V12l3 2" />
    </Svg>
  );
};
export default ClockIcon;
