import Svg, { Path, Circle, Rect } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const CowIcon = ({ width, height, color }: TabIconProps) => {
  return (
    <Svg
      testID="splash-logo"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="1.7"
      style={{ width: width, height: height }}
    >
      <Path d="M8.5 5.5c-.8-1-.6-2.3.4-2.8M15.5 5.5c.8-1 .6-2.3-.4-2.8" strokeLinecap="round" />
      <Path
        d="M5.5 9c-2-1-3-.2-2.6 1.6.3 1.3 1.6 1.8 2.8 1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 9c2-1 3-.2 2.6 1.6-.3 1.3-1.6 1.8-2.8 1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M6.5 11a5.5 5.5 0 0 1 11 0v2.5a5.5 5.5 0 0 1-11 0V11Z" strokeLinejoin="round" />
      <Rect x="8.3" y="15" width="7.4" height="4.6" rx="2.2" />
      <Circle cx="10.3" cy="17.3" r=".55" fill={color} stroke="none" />
      <Circle cx="13.7" cy="17.3" r=".55" fill={color} stroke="none" />
      <Circle cx="9.3" cy="12.2" r=".6" fill={color} stroke="none" />
      <Circle cx="14.7" cy="12.2" r=".6" fill={color} stroke="none" />
    </Svg>
  );
};

export default CowIcon;
