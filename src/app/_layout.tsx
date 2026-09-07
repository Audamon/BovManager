import { Slot } from "expo-router";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const Root = () => {
  return (
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
  );
};
export default Root;
