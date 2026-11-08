import { ColorValue } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
interface TagOnIconProps {
  color: ColorValue;
  width: number;
  height: number;
}
const TagOffIcon = ({ color, width, height }: TagOnIconProps) => {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      width={width}
      height={height}
      stroke-width="1.8"
    >
      <Path d="M12.6 3.4l7 7a2 2 0 0 1 0 2.8l-6.4 6.4a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 11.2V5.4A2 2 0 0 1 5 3.4h7.6z" />
      <Circle cx="8" cy="8.4" r="1.1" fill="currentColor" stroke="none" />
      <Path d="M3 3l18 18" strokeLinecap="round" />
    </Svg>
  );
};

export default TagOffIcon;
