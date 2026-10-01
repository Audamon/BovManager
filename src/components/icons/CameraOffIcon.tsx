import Svg, { Circle, Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const CameraOffIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      style={{ width: width, height: height }}
    >
      <Path d="M3 7h3.2l1.4-2h4.8l1.4 2H21v12H3z" />
      <Circle cx="12" cy="13" r="3.2" />
      <Path d="M3 3l18 18" strokeLinecap="round" />
    </Svg>
  );
};
export default CameraOffIcon;
