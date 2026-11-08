import AppHeader from "@/components/AppHeader/AppHeader";
import ImageInput from "@/components/ImageInput/ImageInput";
import { db } from "@/db/client";
import { animals } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
const cadastroSchema = z.object({
  earRing: z.string().min(1, "Brinco é obrigatório"),
  breed: z.string().min(1, "Raça é obrigatória"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  weight: z.preprocess((valor) => {
    if (typeof valor !== "string") return valor;
    const texto = valor.trim();
    if (texto === "") return undefined;
    return Number(texto.replace(",", "."));
  }, z.number().min(0, "Peso inválido").optional()),
  sex: z.enum(["macho", "femea"], { error: "Selecione o sexo" }),
  location: z.string().optional(),
  photoUri: z.string().optional(),
});
type CadastroFormInput = z.input<typeof cadastroSchema>;
type CadastroFormOutput = z.output<typeof cadastroSchema>;

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

const salvarAnimal = (data: CadastroFormOutput) => {
  db.insert(animals)
    .values({
      earRing: data.earRing,
      breed: data.breed,
      birthDate: data.birthDate,
      weight: data.weight ?? null,
      sex: data.sex,
      location: data.location || null,
      photoUri: data.photoUri || null,
      createdAt: Date.now(),
    })
    .run();
};

const CadastroAnimal = () => {
  const theme = useTheme();
  const router = useRouter();
  const { earRing: earRingEscaneado } = useLocalSearchParams<{ earRing?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormInput, any, CadastroFormOutput>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      earRing: earRingEscaneado ?? "",
      breed: "",
      birthDate: "",
      weight: undefined,
      sex: "macho" as CadastroFormInput["sex"],
      location: "",
      photoUri: "",
    },
  });
  const onSubmit = (data: CadastroFormOutput) => {
    salvarAnimal(data);
    router.back();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader onBackPress={() => router.back()} title="NOVO ANIMAL" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={18}
      >
        <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[style.form, { backgroundColor: theme.backgroundElement }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          <View style={[style.brincoRow, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>BRINCO</Text>
            <Controller
              control={control}
              name="earRing"
              render={({ field: { value } }) => (
                <TextInput
                  mode="outlined"
                  disabled
                  activeOutlineColor={theme.primaryPressed}
                  outlineColor={theme.border}
                  textColor={theme.text}
                  outlineStyle={{ borderRadius: 11 }}
                  style={{ backgroundColor: theme.surface, height: 48 }}
                  value={value}
                />
              )}
            />
            <Text style={[style.helperText, { color: theme.textTherdiary }]}>
              Lido automaticamente no escaneamento — não dá pra editar aqui.
            </Text>
            {errors.earRing && (
              <Text style={{ color: theme.danger }}>{errors.earRing.message}</Text>
            )}
          </View>
          <View style={[style.singleRow, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>RAÇA</Text>
            <Controller
              control={control}
              name="breed"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  outlineColor={theme.border}
                  outlineStyle={{ borderRadius: 11 }}
                  style={{ backgroundColor: theme.surface, height: 48 }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.breed && <Text style={{ color: theme.danger }}>{errors.breed.message}</Text>}
          </View>
          <View style={[style.singleRow, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>SEXO</Text>
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
            {errors.sex && <Text style={{ color: theme.danger }}>{errors.sex.message}</Text>}
          </View>
          <View style={[style.singleRow, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>LOCALIZAÇÃO</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Ex: Pasto 4 — Invernada Norte"
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  outlineColor={theme.border}
                  outlineStyle={{ borderRadius: 11 }}
                  style={{ backgroundColor: theme.surface, height: 48 }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <View style={[style.doubleRow, { backgroundColor: theme.backgroundElement }]}>
            <View style={[style.singleRow, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>NASCIMENTO</Text>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    placeholder="DD/MM/AAAA"
                    activeOutlineColor={theme.primaryPressed}
                    textColor={theme.text}
                    outlineColor={theme.border}
                    outlineStyle={{ borderRadius: 11 }}
                    style={{ backgroundColor: theme.surface, height: 48 }}
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
            <View style={[style.singleRow, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>PESO</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    keyboardType="numeric"
                    placeholder="0,00"
                    right={<TextInput.Affix text="kg" />}
                    activeOutlineColor={theme.primaryPressed}
                    textColor={theme.text}
                    outlineColor={theme.border}
                    outlineStyle={{ borderRadius: 11 }}
                    style={{ backgroundColor: theme.surface, height: 48 }}
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
          <View style={[style.photoRow, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[style.fieldLabel, { color: theme.textTherdiary }]}>FOTO</Text>
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
            style={{ height: 48, justifyContent: "center", borderRadius: 11, marginTop: 12 }}
            onPress={() => handleSubmit(onSubmit)()}
          >
            Salvar animal
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
    paddingBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 11,
    marginTop: 4,
  },
  brincoRow: {
    minHeight: 68,
  },
  singleRow: {
    height: 68,
  },
  photoRow: {
    gap: 6,
  },
  doubleRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  inputs: {
    borderRadius: 11,
  },
});
export default CadastroAnimal;
