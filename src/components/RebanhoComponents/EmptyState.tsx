import { StyleSheet, View, Text } from "react-native";
import TagOnIcon from "../icons/TagOnIcon";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "react-native-paper";
import QrcodeIcon from "../icons/QrcodeIcon";

const EmptyState = () => {
  const theme = useTheme();
  return (
    <View style={style.body}>
      <TagOnIcon color={theme.textSecondary} width={56} height={56} />
      <Text style={[style.mainText, { color: theme.text }]}>Nenhum animal cadastrado ainda</Text>
      <Text style={[style.textSecondary, { color: theme.textSecondary }]}>
        Escaneie o brinco do seu primeiro animal pra começar.
      </Text>
      <Button
        testID="button-scan"
        mode="contained"
        buttonColor={theme.secondary}
        textColor={theme.onSecondary}
        style={style.button}
        icon={({ size, color }) => <QrcodeIcon width={size} height={size} color={color} />}
      >
        Escanear brinco
      </Button>
    </View>
  );
};
const style = StyleSheet.create({
  button: {
    borderRadius: 12,
    height: 46,
    width: 178,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  mainText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  textSecondary: {
    fontSize: 12,
    textAlign: "center",
    maxWidth: "70%",
  },
});

export default EmptyState;
