import CameraOffIcon from "@/components/icons/CameraOffIcon";
import ScanHeader from "@/components/ScanHeader/ScanHeader";
import { useTheme } from "@/hooks/use-theme";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
const AskPermission = ({ requestPermission }: any) => {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScanHeader onBackPress={() => {}} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <CameraOffIcon color={theme.textSecondary} width={100} height={100} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Permissão de camera necessária</Text>
        <Text
          style={{
            color: theme.textSecondary,
            marginTop: 10,
            textAlign: "center",
            maxWidth: "70%",
          }}
        >
          Pra ler o brinco, o BovManager precisa acessar a câmera do aparelho.
        </Text>
        <Text onPress={requestPermission} style={{ color: "blue", marginTop: 10 }}>
          Clique aqui para solicitar permissão.
        </Text>
        <Button
          onPress={requestPermission}
          style={{
            marginTop: 20,
            backgroundColor: theme.primaryPressed,
            paddingHorizontal: 20,
            height: 48,
            //width: 187,
          }}
          labelStyle={{ fontSize: 14, fontWeight: "600" }}
          textColor={theme.background}
          mode="elevated"
        >
          Abrir Configurações
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AskPermission;
