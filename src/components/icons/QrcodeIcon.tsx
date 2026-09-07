import Svg, { Rect } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

const QrcodeIcon = ({ color, width, height }: TabIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" fill={color} style={{ width, height }}>
      <Rect x="3" y="3" width="7" height="7" rx="1" />
      <Rect x="14" y="3" width="7" height="7" rx="1" />
      <Rect x="3" y="14" width="7" height="7" rx="1" />
      <Rect x="14" y="14" width="3" height="3" rx=".5" />
      <Rect x="18" y="14" width="3" height="3" rx=".5" />
      <Rect x="14" y="18" width="3" height="3" rx=".5" />
      <Rect x="18" y="18" width="3" height="3" rx=".5" />
    </Svg>
  );
};

export default QrcodeIcon;
