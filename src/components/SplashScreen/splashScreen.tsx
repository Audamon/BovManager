import { COLORS } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect } from "react-native-svg";
const SplashScreen = () => {
  return (
    <SafeAreaView style={style.splash}>
      <View style={style.container}>
        <View style={style.halfScreen}>
          <Svg
            testID="splash-logo"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.surface}
            stroke-width="1.7"
            style={style.svg}
          >
            <Path d="M8.5 5.5c-.8-1-.6-2.3.4-2.8M15.5 5.5c.8-1 .6-2.3-.4-2.8" strokeLinecap="round" />
            <Path
              d="M5.5 9c-2-1-3-.2-2.6 1.6.3 1.3 1.6 1.8 2.8 1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M18.5 9c2-1 3-.2 2.6 1.6-.3 1.3-1.6 1.8-2.8 1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path d="M6.5 11a5.5 5.5 0 0 1 11 0v2.5a5.5 5.5 0 0 1-11 0V11Z" strokeLinejoin="round" />
            <Rect x="8.3" y="15" width="7.4" height="4.6" rx="2.2" />
            <Circle cx="10.3" cy="17.3" r=".55" fill={COLORS.surface} stroke="none" />
            <Circle cx="13.7" cy="17.3" r=".55" fill={COLORS.surface} stroke="none" />
            <Circle cx="9.3" cy="12.2" r=".6" fill={COLORS.surface} stroke="none" />
            <Circle cx="14.7" cy="12.2" r=".6" fill={COLORS.surface} stroke="none" />
          </Svg>
          <Text style={style.appName}>BovManager</Text>
        </View>
        <View style={style.halfScreen}>
          <ActivityIndicator
            testID="spinner"
            size={"large"}
            color={COLORS.surface}
            aria-role="progressbar"
          />
          <Text style={style.verifictionText}>Verificando sessão...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  splash: {
    backgroundColor: COLORS.primary,
    flex: 1,
    padding: 64,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  halfScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  svg: {
    width: 64,
    height: 64,
  },
  appName: {
    color: COLORS.surface,
    fontSize: 30,
    fontFamily: "BigShoulders_800ExtraBold",
    fontStyle: "normal",
    textTransform: "uppercase",
  },
  verifictionText: {
    color: COLORS.surface,
    fontSize: 12.5,
  },
});

export default SplashScreen;
