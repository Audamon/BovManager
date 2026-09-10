import Svg, { Path, Circle } from "react-native-svg";
import TabIconProps from "./TabIconTypes";
import { useTheme } from "@/hooks/use-theme";

const CowIconFilled = ({ width, height, color }: TabIconProps) => {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 24 24" style={{ width: width, height: height }}>
      {/* Chifres */}
      <Path
        d="M8.5 5.5c-.8-1-.6-2.3.4-2.8M15.5 5.5c.8-1 .6-2.3-.4-2.8"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Orelha Esquerda */}
      <Path
        d="M5.5 9c-2-1-3-.2-2.6 1.6.3 1.3 1.6 1.8 2.8 1.2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Orelha Direita */}
      <Path
        d="M18.5 9c2-1 3-.2 2.6 1.6-.3 1.3-1.6 1.8-2.8 1.2"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cabeça */}
      <Path d="M6.5 11a5.5 5.5 0 0 1 11 0v2.5a5.5 5.5 0 0 1-11 0V11Z" fill={color} />
      {/* Olhos */}
      <Circle cx="9.3" cy="12.2" r="0.6" fill={theme.surface} />
      <Circle cx="14.7" cy="12.2" r="0.6" fill={theme.surface} />

      {/* Focinho */}
      <Path
        d="M10.5 15h3a2.2 2.2 0 0 1 2.2 2.2v.2a2.2 2.2 0 0 1-2.2 2.2h-3a2.2 2.2 0 0 1-2.2-2.2v-.2a2.2 2.2 0 0 1 2.2-2.2Z"
        fill={color}
      />
      {/* Narinas */}
      <Circle cx="10.3" cy="17.3" r="0.55" fill={theme.surface} />
      <Circle cx="13.7" cy="17.3" r="0.55" fill={theme.surface} />
    </Svg>
  );
};

export default CowIconFilled;
