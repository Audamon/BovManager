import AppHeader from "@/components/AppHeader/AppHeader";
import CowIcon from "@/components/icons/CowIcon";
import { db } from "@/db/client";
import { animals, transfers } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const MOTIVOS = ["Brinco danificado", "Brinco perdido", "Troca de rebanho", "Erro de cadastro"];

const confirmarTransferencia = (animalId: number, oldEarRing: string, newEarRing: string, reason: string) => {
  db.update(animals).set({ earRing: newEarRing }).where(eq(animals.id, animalId)).run();
  db.insert(transfers)
    .values({ animalId, oldEarRing, newEarRing, reason, createdAt: Date.now() })
    .run();
};

const TransferirConfirmar = () => {
  const theme = useTheme();
  const router = useRouter();
  const { animalId, novoBrinco } = useLocalSearchParams<{
    animalId: string;
    novoBrinco: string;
  }>();
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [menuVisible, setMenuVisible] = useState(false);

  const animal = db
    .select()
    .from(animals)
    .where(eq(animals.id, Number(animalId)))
    .get();
  if (!animal) return null;

  const onConfirmar = () => {
    confirmarTransferencia(Number(animalId), animal.earRing, novoBrinco, motivo);
    router.replace(`/animal/${animalId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader onBackPress={() => router.back()} title="Confirmar Transferência" />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        <View style={[style.card, style.row, { backgroundColor: theme.surface }]}>
          <View style={[style.avatar, { backgroundColor: theme.iconBadge }]}>
            <CowIcon width={24} height={24} color={theme.onIconBadge} />
          </View>
          <Text style={[style.cattleName, { color: theme.text }]}>
            {animal.name || `Brinco ${animal.earRing}`}
          </Text>
        </View>

        <View style={[style.card, style.row, { backgroundColor: theme.surface, gap: 12 }]}>
          <View style={[style.tagChip, { backgroundColor: theme.backgroundElement }]}>
            <Text style={{ color: theme.textSecondary, textDecorationLine: "line-through" }}>
              {animal.earRing}
            </Text>
          </View>
          <Text style={{ color: theme.primaryPressed, fontWeight: "bold" }}>→</Text>
          <View style={[style.tagChip, { borderColor: theme.primaryPressed, borderWidth: 1.5 }]}>
            <Text style={{ color: theme.primaryPressed, fontWeight: "bold" }}>{novoBrinco}</Text>
          </View>
        </View>

        <View>
          <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>MOTIVO DA TROCA</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            contentStyle={{ backgroundColor: theme.surface }}
            anchor={
              <Pressable
                onPress={() => setMenuVisible(true)}
                style={[style.field, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={{ color: theme.text }}>{motivo}</Text>
              </Pressable>
            }
          >
            {MOTIVOS.map((m) => (
              <Menu.Item
                key={m}
                title={m}
                titleStyle={{ color: theme.text }}
                onPress={() => {
                  setMotivo(m);
                  setMenuVisible(false);
                }}
              />
            ))}
          </Menu>
        </View>

        <Text style={{ color: theme.textSecondary, fontSize: 12.5 }}>
          Essa ação atualiza o histórico do animal permanentemente.
        </Text>

        <View style={{ flex: 1 }} />
        <Button
          mode="contained"
          buttonColor={theme.primaryPressed}
          textColor={theme.onPrimary}
          style={{ height: 50, justifyContent: "center", borderRadius: 12 }}
          onPress={onConfirmar}
        >
          Confirmar transferência
        </Button>
        <Button textColor={theme.textSecondary} onPress={() => router.back()}>
          Cancelar
        </Button>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    padding: 18,
    gap: 18,
  },
  card: {
    borderRadius: 14,
    padding: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  cattleName: {
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 15,
  },
  tagChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  field: {
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: 11,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
});
export default TransferirConfirmar;
