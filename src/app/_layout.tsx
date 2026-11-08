import { Slot } from "expo-router";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { initDb } from "@/db/client";
import { ThemePreferenceProvider } from "@/hooks/theme-preference";

initDb();

const Root = () => {
  return (
    <ThemePreferenceProvider>
      <PaperProvider
        settings={{
          icon: (props) => (
            <View
              style={{
                width: props.size,
                height: props.size,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons {...props} />
            </View>
          ),
        }}
      >
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </PaperProvider>
    </ThemePreferenceProvider>
  );
};
export default Root;
