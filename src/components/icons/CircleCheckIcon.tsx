import Svg, { Circle, Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const CircleCheckIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      width={width}
      height={height}
      strokeWidth="2"
    >
      <Circle cx="12" cy="12" r="9.5" />
      <Path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};
export default CircleCheckIcon;
