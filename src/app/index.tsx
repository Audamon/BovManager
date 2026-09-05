import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { BigShoulders_800ExtraBold } from "@expo-google-fonts/big-shoulders";
import { COLORS } from "@/constants/colors";
import SplashScreen from "@/components/SplashScreen/splashScreen";
import { Redirect } from "expo-router";
//import { useEffect, useState } from "react";
// Tela raiz — por enquanto em branco. É aqui que entra o Meu Rebanho.
const Index = () => {
  const [fonstLoaded] = useFonts({
    BigShoulders_800ExtraBold,
  });
  // const [showSplash, setShowSplash] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowSplash(false), 5000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);
  //if (showSplash) {
  if (!fonstLoaded) {
    return (
      <SafeAreaProvider>
        <SplashScreen />
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider>
      <Redirect href={"/rebanho"} />
    </SafeAreaProvider>
  );
};

export default Index;
