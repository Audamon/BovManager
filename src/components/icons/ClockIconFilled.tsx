import Svg, { Path } from "react-native-svg";
import TabIconProps from "./TabIconTypes";

// Versão sólida do ClockIcon, pra estado ativo da tab bar. Os dois
// ponteiros viram recortes transparentes dentro do disco preenchido
// (fillRule evenodd) — sem isso, um ponteiro da mesma cor do disco
// ficaria invisível. Os dois recortes não se tocam de propósito: se
// se sobrepusessem, o evenodd contaria a sobreposição duas vezes e
// "descortaria" ela de volta.
const ClockIconFilled = ({ width, height, color }: TabIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: width, height: height }}>
      <Path
        d="M12 3.5A8.5 8.5 0 0 1 12 20.5A8.5 8.5 0 0 1 12 3.5Z M11.35 7.5h1.3v4h-1.3Z M11.875 12.705L14.675 14.505L15.325 13.495L12.525 11.695Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
};

export default ClockIconFilled;
