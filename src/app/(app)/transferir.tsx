import ScanHeader from "@/components/ScanHeader/ScanHeader";
import { db } from "@/db/client";
import { animals } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { eq } from "drizzle-orm";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Transferir = () => {
  const [permission] = useCameraPermissions();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const router = useRouter();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const scanLock = useRef(false);
  const [erro, setErro] = useState<string | null>(null);

  const animal = db
    .select()
    .from(animals)
    .where(eq(animals.id, Number(animalId)))
    .get();

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (scanLock.current || !animal) return;
    scanLock.current = true;
    if (data === animal.earRing) {
      setErro("Esse já é o brinco atual do animal. Escaneie o brinco novo.");
      scanLock.current = false;
      return;
    }
    const conflito = db.select().from(animals).where(eq(animals.earRing, data)).get();
    if (conflito) {
      setErro("Esse brinco já está em uso por outro animal.");
      scanLock.current = false;
      return;
    }
    router.replace({
      pathname: "/transferir-confirmar",
      params: { animalId: animal.id, novoBrinco: data },
    });
  };

  if (!animal) return null;
  if (!permission?.granted) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScanHeader
        title="Transferir Brinco"
        zIndex={10}
        backgroundColor={"rgba(0,0,0,0.85)"}
        overCamera
      />
      {isFocused && (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScan}
        />
      )}
      <View style={style.body} pointerEvents="none">
        <View style={style.maskRow} />
        <View style={style.maskCenter}>
          <View style={style.maskCol} />
          <View style={[style.viewfinder, { borderColor: theme.secondary }]} />
          <View style={style.maskCol} />
        </View>
        <View style={style.maskRow} />
      </View>
      <View style={style.hintContainer}>
        <Text style={style.hintText}>
          Origem {animal.earRing} — agora escaneie o NOVO brinco
        </Text>
      </View>
      {erro && (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>{erro}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};
const FINDER_SIZE = 230;
const style = StyleSheet.create({
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
    backgroundColor: "transparent",
  },
  hintContainer: {
    position: "absolute",
    bottom: 150,
    left: "5%",
    right: "5%",
    alignItems: "center",
    backgroundColor: "#000000cc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  hintText: {
    color: "white",
    textAlign: "center",
  },
  errorContainer: {
    position: "absolute",
    bottom: 90,
    left: "5%",
    right: "5%",
    alignItems: "center",
    backgroundColor: "#9C2E22cc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
export default Transferir;
