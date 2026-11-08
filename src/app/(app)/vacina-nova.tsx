import AppHeader from "@/components/AppHeader/AppHeader";
import { db } from "@/db/client";
import { vaccines } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { getNotificationsEnabled, scheduleVaccineReminders } from "@/services/notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const vacinaSchema = z.object({
  name: z.string().min(1, "Nome da vacina é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  applied: z.enum(["sim", "nao"]),
});
type VacinaForm = z.infer<typeof vacinaSchema>;

const formatBirthDate = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  const partes = [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)].filter(Boolean);
  return partes.join("/");
};

const salvarVacina = (animalId: number, data: VacinaForm) => {
  db.insert(vaccines)
    .values({
      animalId,
      name: data.name,
      date: data.date,
      applied: data.applied === "sim",
      createdAt: Date.now(),
    })
    .run();
};

const VacinaNova = () => {
  const theme = useTheme();
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VacinaForm>({
    resolver: zodResolver(vacinaSchema),
    defaultValues: { name: "", date: "", applied: "sim" },
  });

  const onSubmit = async (data: VacinaForm) => {
    salvarVacina(Number(animalId), data);
    if (data.applied === "nao" && (await getNotificationsEnabled())) {
      await scheduleVaccineReminders();
    }
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader onBackPress={() => router.back()} title="NOVA VACINA" />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        <View style={style.form}>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>VACINA</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="Ex: Febre Aftosa"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.name && <Text style={{ color: theme.danger }}>{errors.name.message}</Text>}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>SITUAÇÃO</Text>
            <Controller
              control={control}
              name="applied"
              render={({ field: { onChange, value } }) => (
                <SegmentedButtons
                  value={value}
                  onValueChange={onChange}
                  theme={{
                    roundness: 11 / 5,
                    colors: {
                      outline: theme.segmentedUnselected,
                      secondaryContainer: theme.primaryPressed,
                    },
                  }}
                  style={{ height: 48 }}
                  buttons={[
                    {
                      value: "sim",
                      label: "Já aplicada",
                      checkedColor: theme.onPrimary,
                      uncheckedColor: theme.segmentedUnselected,
                    },
                    {
                      value: "nao",
                      label: "Prevista",
                      checkedColor: theme.onPrimary,
                      uncheckedColor: theme.segmentedUnselected,
                    },
                  ]}
                />
              )}
            />
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>DATA</Text>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="DD/MM/AAAA"
                  value={value}
                  onChangeText={(texto) => onChange(formatBirthDate(texto))}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.date && <Text style={{ color: theme.danger }}>{errors.date.message}</Text>}
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <Button
          mode="contained"
          buttonColor={theme.primaryPressed}
          textColor={theme.onPrimary}
          style={{ height: 48, justifyContent: "center", borderRadius: 11 }}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Salvar vacina
        </Button>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "bold",
  },
});
export default VacinaNova;
