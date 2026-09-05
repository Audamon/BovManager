import React from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const Login = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={style.container}>
          <TextInput placeholder="Login" />
          <TextInput placeholder="Senha" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  },
});

export default Login;
