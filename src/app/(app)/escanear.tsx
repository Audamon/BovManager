import { Text, View, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
const Escanear = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const theme = useTheme();
  if(!permission?.granted) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Permissão para acessar a câmera não concedida.</Text>
        <Text onPress={requestPermission} style={{color: "blue", marginTop: 10}}>Clique aqui para solicitar permissão.</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}} edges={["top", "left", "right"]}>
      
      {isFocused && (<CameraView style={{flex: 1}} facing="back" barcodeScannerSettings={{barcodeTypes: ["qr", ]}} />)}
      <View style={[style.body]} pointerEvents="none">
        <View style={style.maskRow} />
        <View style={style.maskCenter}>
          <View style={style.maskCol} />
          <View style={[style.viewfinder, { borderColor: theme.secondary }]} />
          <View style={style.maskCol} />
        </View>
        <View style={style.maskRow} />
      </View>
    </SafeAreaView>
  );
};
const FINDER_SIZE = 250;
const style = StyleSheet.create({
  body: {
    ...StyleSheet.absoluteFill,
    flex: 1,
   position: "absolute",
  
  },
  maskRow: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)" },
  maskCenter: { height: FINDER_SIZE, flexDirection: "row",  },
  maskCol: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)" },
  viewfinder: {
    width: FINDER_SIZE,
    height: FINDER_SIZE,
    borderWidth: 3,
    //borderRadius: 20,
    backgroundColor: "transparent",
  },
});
export default Escanear;
