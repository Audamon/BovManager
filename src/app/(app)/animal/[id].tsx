import AppHeader from "@/components/AppHeader/AppHeader";
import CowIcon from "@/components/icons/CowIcon";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { db } from "@/db/client";
import { Animal, animals, Transfer, transfers, Vaccine, vaccines } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { eq, desc } from "drizzle-orm";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const getStatusColor = (status: Animal["status"], theme: ReturnType<typeof useTheme>) => {
  switch (status) {
    case "saudavel":
      return theme.success;
    case "doente":
      return theme.danger;
    default:
      return "";
  }
};
const getStatusText = (status: Animal["status"]) => {
  switch (status) {
    case "saudavel":
      return "Saudável";
    case "doente":
      return "Doente";
    case "atencao":
      return "Atenção";
    case "semPendencias":
      return "Sem pendências";
  }
};

const DetalheAnimal = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [historico, setHistorico] = useState<Transfer[]>([]);
  const [vacinas, setVacinas] = useState<Vaccine[]>([]);
  useFocusEffect(
    useCallback(() => {
      const found = db
        .select()
        .from(animals)
        .where(eq(animals.id, Number(id)))
        .get();
      setAnimal(found ?? null);
      setHistorico(
        db
          .select()
          .from(transfers)
          .where(eq(transfers.animalId, Number(id)))
          .orderBy(desc(transfers.createdAt))
          .all(),
      );
      setVacinas(
        db.select().from(vaccines).where(eq(vaccines.animalId, Number(id))).orderBy(desc(vaccines.date)).all(),
      );
    }, [id]),
  );
  if (!animal) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader
        onBackPress={() => router.back()}
        title={animal.name || animal.earRing}
        subtitle={`brinco ${animal.earRing}`}
      />
      <ScrollView
        style={[style.body, { backgroundColor: theme.backgroundElement }]}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[style.photo, { backgroundColor: theme.iconBadge }]}>
          {animal.photoUri ? (
            <Image source={{ uri: animal.photoUri }} style={style.photoImage} />
          ) : (
            <CowIcon width={56} height={56} color={theme.onIconBadge} />
          )}
        </View>
        <View style={[style.card, { backgroundColor: theme.surface }]}>
          <View style={style.gridRow}>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>BRINCO</Text>
              <Text style={[style.fieldValue, { color: theme.text }]}>{animal.earRing}</Text>
            </View>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>STATUS</Text>
              <StatusBadge
                text={getStatusText(animal.status)}
                color={getStatusColor(animal.status, theme)}
              />
            </View>
          </View>
          <View style={style.gridRow}>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>RAÇA</Text>
              <Text style={[style.fieldValue, { color: theme.text }]}>{animal.breed}</Text>
            </View>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>SEXO</Text>
              <Text style={[style.fieldValue, { color: theme.text }]}>
                {animal.sex === "macho" ? "Macho" : "Fêmea"}
              </Text>
            </View>
          </View>
          <View style={style.gridRow}>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>NASCIMENTO</Text>
              <Text style={[style.fieldValue, { color: theme.text }]}>
                {animal.birthDate || "—"}
              </Text>
            </View>
            <View style={style.gridItem}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>PESO</Text>
              <Text style={[style.fieldValue, { color: theme.text }]}>
                {animal.weight ? `${animal.weight} kg` : "—"}
              </Text>
            </View>
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>LOCALIZAÇÃO</Text>
            <Text style={[style.fieldValue, { color: theme.text, fontFamily: undefined }]}>
              {animal.location || "—"}
            </Text>
          </View>
        </View>
        <View>
          <Text style={[style.sectionTitle, { color: theme.text }]}>Histórico do brinco</Text>
          <View style={[style.card, { backgroundColor: theme.surface, gap: 10 }]}>
            {historico.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>Nenhuma transferência ainda.</Text>
            ) : (
              historico.map((t) => (
                <View key={t.id}>
                  <Text style={[style.fieldValue, { color: theme.text }]}>
                    {t.oldEarRing} → {t.newEarRing}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11.5 }}>{t.reason}</Text>
                </View>
              ))
            )}
          </View>
        </View>
        <View>
          <View style={style.sectionTitleRow}>
            <Text style={[style.sectionTitle, { color: theme.text }]}>Vacinas</Text>
            <Pressable onPress={() => router.push(`/vacina-nova?animalId=${animal.id}`)}>
              <Text style={{ color: theme.primaryPressed, fontWeight: "bold" }}>+ Adicionar</Text>
            </Pressable>
          </View>
          <View style={[style.card, { backgroundColor: theme.surface, gap: 10 }]}>
            {vacinas.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>Nenhuma vacina registrada.</Text>
            ) : (
              vacinas.map((v) => (
                <View key={v.id} style={style.vaccineRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[style.fieldValue, { color: theme.text, fontFamily: undefined }]}>
                      {v.name}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 11.5 }}>
                      {v.applied ? `Aplicada em ${v.date}` : `Prevista para ${v.date}`}
                    </Text>
                  </View>
                  {v.applied && <StatusBadge text="aplicada" color={theme.success} />}
                </View>
              ))
            )}
          </View>
        </View>
        <View style={style.buttonRow}>
          <Button
            mode="outlined"
            textColor={theme.primaryPressed}
            style={{
              flex: 1,
              height: 48,
              justifyContent: "center",
              borderRadius: 11,
              borderColor: theme.primaryPressed,
            }}
            onPress={() => router.push(`/transferir?animalId=${animal.id}`)}
          >
            Transferir brinco
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.primaryPressed}
            textColor={theme.onPrimary}
            style={{ flex: 1, height: 48, justifyContent: "center", borderRadius: 11 }}
            onPress={() => router.push(`/editar-animal?animalId=${animal.id}`)}
          >
            Editar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    padding: 16,
  },
  photo: {
    height: 160,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  gridRow: {
    flexDirection: "row",
    gap: 14,
  },
  gridItem: {
    flex: 1,
    gap: 2,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vaccineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
});
export default DetalheAnimal;
