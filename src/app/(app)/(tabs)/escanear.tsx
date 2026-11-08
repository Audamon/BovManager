import AskPermission from "@/components/ScanComponents/AskPermission";
import ScanResultSheet from "@/components/ScanComponents/ScanResultSheet";
import ScanHeader from "@/components/ScanHeader/ScanHeader";
import { db } from "@/db/client";
import { animals, Animal } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { eq } from "drizzle-orm";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useIsFocused, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
export type { Animal };
export type ScanResult =
  | { status: "idle" }
  | { status: "found"; animal: Animal }
  | { status: "notFound"; earRing: string };
const Escanear = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = React.useState<ScanResult>({ status: "idle" });
  const scanLock = useRef(false);
  const isFocused = useIsFocused();
  const router = useRouter();
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const theme = useTheme();
  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (scanLock.current) return;
    scanLock.current = true;
    const animal = buscarAnimalPorBrinco(data);
    setScanResult(animal ? { status: "found", animal } : { status: "notFound", earRing: data });
  };
  const buscarAnimalPorBrinco = (brinco: string): Animal | null => {
    const found = db.select().from(animals).where(eq(animals.earRing, brinco)).get();
    return found ?? null;
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
        setTorchOn(false);
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
        onBackPress={() => router.back()}
        zIndex={10}
        backgroundColor={"rgba(0,0,0,0.85)"}
        overCamera
        onFlashPress={() => setTorchOn((on) => !on)}
        showFlashIcon={true}
      />
      {isFocused && (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          enableTorch={torchOn}
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
      <ScanResultSheet
        result={scanResult}
        onRegisterNow={(earRing) => router.push(`/cadastro?earRing=${earRing}`)}
        onRetry={resetScan}
        onViewAnimal={(animal) => router.push(`/animal/${animal.id}`)}
      />
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
    //backgroundColor: "#fff", // ou "#fff" para testar
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 14,
    height: 250,
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
    bottom: 150,
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
