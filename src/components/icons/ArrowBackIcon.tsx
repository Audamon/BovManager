import Svg, { Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const ArrowBackIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      style={{ width: width, height: height }}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M15 19l-7-7 7-7" />
    </Svg>
  );
};
export default ArrowBackIcon;
