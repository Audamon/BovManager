import { Redirect, Slot } from "expo-router";

const Root = () => {
  const userLogado = false;

  if (!userLogado) {
    return <Redirect href="/login" />;
  }
  return <Slot />;
};
export default Root;
