import Svg, { Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const FlashIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" fill={color} width={width} height={height}>
      <Path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </Svg>
  );
};
export default FlashIcon;
