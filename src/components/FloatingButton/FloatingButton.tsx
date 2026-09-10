import {  FAB } from "react-native-paper";
import QrcodeIcon from "../icons/QrcodeIcon";
import { useTheme } from "@/hooks/use-theme";
const FloatingButton = () => {
    const theme = useTheme();
    return (
        <FAB
        label="Escanear"
        color={theme.text}
            icon={({size, color}) =><QrcodeIcon width={size} height={size} color={color} />}
            style={{
                position: 'absolute',
                margin: 16,
                right: 16,
                bottom: 16,
                backgroundColor: theme.secondary,
            }}
        />
    );
}
export default FloatingButton;