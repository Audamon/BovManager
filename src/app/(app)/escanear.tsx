import AskPermission from "@/components/ScanComponents/AskPermission";
import ScanHeader from "@/components/ScanHeader/ScanHeader";
import { useTheme } from "@/hooks/use-theme";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useIsFocused } from "expo-router";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Animal = {
  id: string;
  brinco: string;
};
type ScanResult =
  { status: "idle" } | { status: "found"; animal: Animal } | { status: "notFound"; brinco: string };
const Escanear = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = React.useState<ScanResult>({ status: "idle" });
  const scanLock = useRef(false);
  const isFocused = useIsFocused();

  const theme = useTheme();
  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (scanLock.current) return;
    scanLock.current = true;
    const animal = buscarAnimalPorBrinco(data);
    setScanResult(animal ? { status: "found", animal } : { status: "notFound", brinco: data });
  };
  const buscarAnimalPorBrinco = (brinco: string): Animal | null => {
    // Simulação de busca em um banco de dados
    const animais: Animal[] = [{ id: "1", brinco: "0321-BR" }];
    return animais.find((a) => a.brinco === brinco) || null;
  };
  const resetScan = () => {
    scanLock.current = false;
    setScanResult({ status: "idle" });
  };
  useFocusEffect(
    useCallback(() => {
      return () => {
        scanLock.current = false;
        setScanResult({ status: "idle" });
      };
    }, []),
  );
  if (!permission?.granted) {
    return <AskPermission requestPermission={requestPermission} />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
      edges={["top", "left", "right"]}
    >
      <ScanHeader
        onBackPress={() => {}}
        zIndex={10}
        backgroundColor={"rgba(0,0,0,0.85)"}
        onFlashPress={() => {}}
        showFlashIcon={true}
      />
      {isFocused && (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanResult.status === "idle" ? handleScan : undefined}
        />
      )}
      <View style={[style.body]} pointerEvents="none">
        <View style={style.maskRow} />
        <View style={style.maskCenter}>
          <View style={style.maskCol} />
          <View style={[style.viewfinder, { borderColor: theme.secondary }]} />
          <View style={style.maskCol} />
        </View>
        <View style={style.maskRow} />
      </View>
      <View style={style.scannerTextContainer}>
        <Text style={style.scannerText}>Aponte a câmera para o QR code do brinco</Text>
      </View>
      {scanResult.status === "found" && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={style.sheet}>
          <Text style={style.foundText}>Animal encontrado!</Text>
        </Animated.View>
      )}
      {scanResult.status === "notFound" && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={style.sheet}>
          <Text style={style.notFoundText}>Animal não encontrado!</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
const FINDER_SIZE = 250;
const style = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#fff", // ou "#fff" para testar
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 14,
  },
  foundText: {
    color: "black",
    fontSize: 20,
  },
  notFoundText: {
    color: "black",
    fontSize: 20,
  },
  body: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    position: "absolute",
  },
  maskRow: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  maskCenter: { height: FINDER_SIZE, flexDirection: "row" },
  maskCol: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  viewfinder: {
    width: FINDER_SIZE,
    height: FINDER_SIZE,
    borderWidth: 3,
    //borderRadius: 20,
    backgroundColor: "transparent",
  },
  scannerText: {
    color: "white",
    //textAlign: "center",
  },
  scannerTextContainer: {
    position: "absolute",
    bottom: 100,
    left: "5%",
    right: "5%",
    alignItems: "center",
    backgroundColor: "#000000cc",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
});
export default Escanear;
