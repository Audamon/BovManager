import { useFonts } from "expo-font";
import { BigShoulders_800ExtraBold } from "@expo-google-fonts/big-shoulders";
import SplashScreen from "@/components/SplashScreen/splashScreen";
import { Redirect } from "expo-router";
const Index = () => {
  const [fonstLoaded] = useFonts({
    BigShoulders_800ExtraBold,
  });

  if (!fonstLoaded) {
    return <SplashScreen />;
  }
  return <Redirect href={"/rebanho"} />;
};

export default Index;
