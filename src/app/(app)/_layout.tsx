import { Stack } from "expo-router";

const AppStack = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="animal/[id]" />
      <Stack.Screen name="transferir" />
      <Stack.Screen name="transferir-confirmar" />
      <Stack.Screen name="editar-animal" />
      <Stack.Screen name="vacina-nova" />
      <Stack.Screen name="trocar-senha" />
    </Stack>
  );
};

export default AppStack;
