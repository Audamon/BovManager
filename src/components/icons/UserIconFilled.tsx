import Svg, { Circle, Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

// Versão sólida do UserIcon, pra estado ativo da tab bar. Mesma silhueta
// do outline, só que preenchida em vez de contornada.
const UserIconFilled = ({ width, height, color }: TabIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: width, height: height }}>
      <Circle cx="12" cy="8" r="3.4" fill={color} />
      <Path d="M5 20c1-3.8 4-5.6 7-5.6s6 1.8 7 5.6Z" fill={color} />
    </Svg>
  );
};

export default UserIconFilled;
