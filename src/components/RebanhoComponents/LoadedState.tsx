import { Pressable, View, StyleSheet } from "react-native";
import RebanhoCard from "../RebanhoCard/RebanhoCard";
import { Animal } from "@/db/schema";
import { useRouter } from "expo-router";

const calcularIdade = (birthDate: string | null): number | undefined => {
  if (!birthDate) return undefined;
  const [dia, mes, ano] = birthDate.split("/").map(Number);
  if (!dia || !mes || !ano) return undefined;
  const nascimento = new Date(ano, mes - 1, dia);
  const diffMs = Date.now() - nascimento.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365)));
};

interface LoadedStateProps {
  animais?: Animal[];
}
const LoadedState = ({ animais = [] }: LoadedStateProps) => {
  const router = useRouter();
  return (
    <View style={style.body}>
      {animais.map((animal) => (
        <Pressable key={animal.id} onPress={() => router.push(`/animal/${animal.id}`)}>
          <RebanhoCard
            animal={{
              name: animal.name ?? undefined,
              earRing: animal.earRing,
              breed: animal.breed,
              age: calcularIdade(animal.birthDate),
              status: animal.status,
            }}
          />
        </Pressable>
      ))}
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
