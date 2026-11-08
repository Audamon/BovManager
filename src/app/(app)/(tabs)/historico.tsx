import AppHeader from "@/components/AppHeader/AppHeader";
import TagOnIcon from "@/components/icons/TagOnIcon";
import { db } from "@/db/client";
import { animals, transfers } from "@/db/schema";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import ClockIcon from "@/components/icons/ClockIcon";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

type Evento = {
  id: string;
  animalId: number;
  texto: string;
  data: number;
  icone: "cadastro" | "transferencia";
};

const Historico = () => {
  const theme = useTheme();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  useFocusEffect(
    useCallback(() => {
      const cadastros = db.select().from(animals).all().map(
        (a): Evento => ({
          id: `cadastro-${a.id}`,
          animalId: a.id,
          texto: `${a.name || "Animal"} cadastrado — brinco ${a.earRing}`,
          data: a.createdAt,
          icone: "cadastro",
        }),
      );
      const transferencias = db.select().from(transfers).all().map(
        (t): Evento => ({
          id: `transfer-${t.id}`,
          animalId: t.animalId,
          texto: `Brinco ${t.oldEarRing} transferido para ${t.newEarRing}`,
          data: t.createdAt,
          icone: "transferencia",
        }),
      );
      setEventos([...cadastros, ...transferencias].sort((a, b) => b.data - a.data));
    }, []),
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader
        title="Histórico"
        leftIcon={
          <View style={[style.icon, { backgroundColor: theme.iconBadge }]}>
            <ClockIcon color={theme.textTherdiary} width={32} height={32} />
          </View>
        }
      />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        {eventos.length === 0 ? (
          <Text style={{ color: theme.textSecondary }}>Nenhum evento registrado ainda.</Text>
        ) : (
          <ScrollView contentContainerStyle={style.list}>
            {eventos.map((evento) => (
              <Pressable
                key={evento.id}
                onPress={() => router.push(`/animal/${evento.animalId}`)}
                style={[style.card, { backgroundColor: theme.surface }]}
              >
                {evento.icone === "transferencia" ? (
                  <Text style={{ fontSize: 16, color: theme.textSecondary }}>⇄</Text>
                ) : (
                  <TagOnIcon color={theme.textSecondary} width={17} height={17} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[style.eventText, { color: theme.text }]}>{evento.texto}</Text>
                  <Text style={[style.eventDate, { color: theme.textSecondary }]}>
                    {new Date(evento.data).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 14,
  },
  eventText: {
    fontSize: 13,
    fontWeight: "600",
  },
  eventDate: {
    fontSize: 11,
    marginTop: 2,
  },
});
export default Historico;
