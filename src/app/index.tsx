import { useFonts } from "expo-font";
import { BigShoulders_800ExtraBold } from "@expo-google-fonts/big-shoulders";
import SplashScreen from "@/components/SplashScreen/splashScreen";
import { Redirect } from "expo-router";
import { authRepository } from "@/services/auth";
import { useEffect, useState } from "react";

type Destino = "/rebanho" | "/login";

const Index = () => {
  const [fonstLoaded] = useFonts({
    BigShoulders_800ExtraBold,
  });
  const [destino, setDestino] = useState<Destino | null>(null);

  useEffect(() => {
    authRepository.getCurrentUser().then((usuario) => {
      setDestino(usuario ? "/rebanho" : "/login");
    });
  }, []);

  if (!fonstLoaded || !destino) {
    return <SplashScreen />;
  }
  return <Redirect href={destino} />;
};

export default Index;
