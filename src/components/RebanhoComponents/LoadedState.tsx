import { View, StyleSheet } from "react-native";
import RebanhoCard from "../RebanhoCard/RebanhoCard";

const LoadedState = () => {
  return (
    <View style={style.body}>
      <RebanhoCard
        animal={{ name: "Mimosa", age: 3, breed: "Nelore", earRing: "0321-BR", status: "saudavel" }}
      />
      <RebanhoCard
        animal={{ name: "Mimosa", age: 3, breed: "Nelore", earRing: "0321-BR", status: "doente" }}
      />
      <RebanhoCard
        animal={{
          name: "Mimosa",
          age: 3,
          breed: "Nelore",
          earRing: "0321-BR",
          status: "semPendencias",
        }}
      />
    </View>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 16,
    gap: 10,
  },
});
export default LoadedState;
