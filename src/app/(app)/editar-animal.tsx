import AppHeader from "@/components/AppHeader/AppHeader";
import ImageInput from "@/components/ImageInput/ImageInput";
import { db } from "@/db/client";
import { animals } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const editarAnimalSchema = z.object({
  name: z.string().optional(),
  breed: z.string().min(1, "Raça é obrigatória"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  weight: z.preprocess((valor) => {
    if (typeof valor !== "string") return valor;
    const texto = valor.trim();
    if (texto === "") return undefined;
    return Number(texto.replace(",", "."));
  }, z.number().min(0, "Peso inválido").optional()),
  sex: z.enum(["macho", "femea"]),
  status: z.enum(["saudavel", "doente", "atencao", "semPendencias"]),
  location: z.string().optional(),
  photoUri: z.string().optional(),
});
type EditarAnimalFormInput = z.input<typeof editarAnimalSchema>;
type EditarAnimalFormOutput = z.output<typeof editarAnimalSchema>;

const formatBirthDate = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  const partes = [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)].filter(Boolean);
  return partes.join("/");
};

const formatWeight = (texto: string) => {
  const digitos = texto.replace(/\D/g, "").slice(-6);
  if (digitos === "") return "";
  return (Number(digitos) / 100).toFixed(2).replace(".", ",");
};

const STATUS_LABEL: Record<EditarAnimalFormOutput["status"], string> = {
  saudavel: "Saudável",
  doente: "Doente",
  atencao: "Atenção",
  semPendencias: "Sem pendências",
};

const EditarAnimal = () => {
  const theme = useTheme();
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const animal = db
    .select()
    .from(animals)
    .where(eq(animals.id, Number(animalId)))
    .get();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditarAnimalFormInput, any, EditarAnimalFormOutput>({
    resolver: zodResolver(editarAnimalSchema),
    defaultValues: {
      name: animal?.name ?? "",
      breed: animal?.breed ?? "",
      birthDate: animal?.birthDate ?? "",
      weight: animal?.weight != null ? animal.weight.toFixed(2).replace(".", ",") : undefined,
      sex: animal?.sex ?? "macho",
      status: animal?.status ?? "semPendencias",
      location: animal?.location ?? "",
      photoUri: animal?.photoUri ?? "",
    },
  });

  if (!animal) return null;

  const onSubmit = (data: EditarAnimalFormOutput) => {
    db.update(animals)
      .set({
        name: data.name || null,
        breed: data.breed,
        birthDate: data.birthDate,
        weight: data.weight ?? null,
        sex: data.sex,
        status: data.status,
        location: data.location || null,
        photoUri: data.photoUri || null,
      })
      .where(eq(animals.id, animal.id))
      .run();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader onBackPress={() => router.back()} title="EDITAR ANIMAL" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={18}
      >
        <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={style.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>BRINCO</Text>
            <TextInput
              mode="outlined"
              disabled
              activeOutlineColor={theme.primaryPressed}
              outlineColor={theme.border}
              textColor={theme.text}
              style={{ backgroundColor: theme.surface }}
              value={animal.earRing}
            />
            <Text style={[style.helperText, { color: theme.textSecondary }]}>
              Pra trocar o brinco, use “Transferir brinco” na tela do animal.
            </Text>
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>NOME</Text>
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
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>RAÇA</Text>
            <Controller
              control={control}
              name="breed"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.breed && <Text style={{ color: theme.danger }}>{errors.breed.message}</Text>}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>SEXO</Text>
            <Controller
              control={control}
              name="sex"
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
                      value: "macho",
                      label: "Macho",
                      checkedColor: theme.onPrimary,
                      uncheckedColor: theme.segmentedUnselected,
                    },
                    {
                      value: "femea",
                      label: "Fêmea",
                      checkedColor: theme.onPrimary,
                      uncheckedColor: theme.segmentedUnselected,
                    },
                  ]}
                />
              )}
            />
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>LOCALIZAÇÃO</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="Ex: Pasto 4 — Invernada Norte"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>STATUS</Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <>
                  {[
                    ["saudavel", "doente"],
                    ["atencao", "semPendencias"],
                  ].map((linha, i) => (
                    <SegmentedButtons
                      key={i}
                      value={value}
                      onValueChange={onChange}
                      theme={{
                        roundness: 11 / 5,
                        colors: {
                          outline: theme.segmentedUnselected,
                          secondaryContainer: theme.primaryPressed,
                        },
                      }}
                      style={{ height: 48, marginBottom: i === 0 ? 8 : 0 }}
                      buttons={(linha as EditarAnimalFormOutput["status"][]).map((s) => ({
                        value: s,
                        label: STATUS_LABEL[s],
                        checkedColor: theme.onPrimary,
                        uncheckedColor: theme.segmentedUnselected,
                      }))}
                    />
                  ))}
                </>
              )}
            />
          </View>
          <View style={style.doubleRow}>
            <View style={style.halfField}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>NASCIMENTO</Text>
              <Controller
                control={control}
                name="birthDate"
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
              {errors.birthDate && (
                <Text style={{ color: theme.danger }}>{errors.birthDate.message}</Text>
              )}
            </View>
            <View style={style.halfField}>
              <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>PESO</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    outlineColor={theme.border}
                    activeOutlineColor={theme.primaryPressed}
                    textColor={theme.text}
                    style={{ backgroundColor: theme.surface }}
                    keyboardType="numeric"
                    placeholder="0,00"
                    right={<TextInput.Affix text="kg" />}
                    value={value == null ? "" : String(value)}
                    onChangeText={(texto) => onChange(formatWeight(texto))}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.weight && (
                <Text style={{ color: theme.danger }}>{errors.weight.message}</Text>
              )}
            </View>
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>FOTO</Text>
            <Controller
              control={control}
              name="photoUri"
              render={({ field: { onChange, value } }) => (
                <ImageInput value={value} onChange={onChange} />
              )}
            />
          </View>
          </ScrollView>
          <Button
            mode="contained"
            buttonColor={theme.primaryPressed}
            textColor={theme.onPrimary}
            style={{ height: 48, justifyContent: "center", borderRadius: 11, marginTop: 16 }}
            onPress={() => handleSubmit(onSubmit)()}
          >
            Salvar alterações
          </Button>
        </View>
      </KeyboardAvoidingView>
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
  helperText: {
    fontSize: 11.5,
    marginTop: 4,
  },
  doubleRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
});
export default EditarAnimal;
