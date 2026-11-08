import { authRepository } from "@/services/auth";
import { useTheme } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const recuperarSenhaSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Repita a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type RecuperarSenhaForm = z.infer<typeof recuperarSenhaSchema>;

const RecuperarSenha = () => {
  const theme = useTheme();
  const router = useRouter();
  const [emailNaoEncontrado, setEmailNaoEncontrado] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarSenhaForm>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RecuperarSenhaForm) => {
    const ok = await authRepository.resetPassword(data.email, data.password);
    if (!ok) {
      setEmailNaoEncontrado(true);
      return;
    }
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.authBackground }}>
      <View style={style.body}>
        <View>
          <Text style={[style.title, { color: theme.text }]}>Recuperar senha</Text>
          <Text style={[style.subtitle, { color: theme.textSecondary }]}>
            Informe seu e-mail e escolha uma nova senha
          </Text>
        </View>

        <View style={style.form}>
          {emailNaoEncontrado && (
            <View style={[style.errorBanner, { backgroundColor: theme.danger }]}>
              <Text style={{ color: theme.onDanger, fontWeight: "bold" }}>
                Nenhuma conta encontrada com esse e-mail.
              </Text>
            </View>
          )}
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>E-MAIL</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="voce@fazenda.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={(texto) => {
                    setEmailNaoEncontrado(false);
                    onChange(texto);
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && <Text style={{ color: theme.danger }}>{errors.email.message}</Text>}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>NOVA SENHA</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && (
              <Text style={{ color: theme.danger }}>{errors.password.message}</Text>
            )}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>
              CONFIRMAR NOVA SENHA
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="Repita a nova senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={{ color: theme.danger }}>{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <Button
          mode="contained"
          buttonColor={theme.primaryPressed}
          textColor={theme.onPrimary}
          style={{ height: 50, justifyContent: "center", borderRadius: 12 }}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Atualizar senha
        </Button>
        <Text
          style={{ textAlign: "center", color: theme.textSecondary, marginTop: 10 }}
          onPress={() => router.push("/login")}
        >
          Voltar ao login
        </Text>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 28,
    gap: 22,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "bold",
  },
  title: {
    fontFamily: "monospace",
    fontWeight: "800",
    fontSize: 24,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 13.5,
    marginTop: 2,
  },
  form: {
    gap: 14,
  },
  errorBanner: {
    borderRadius: 11,
    padding: 12,
  },
});
export default RecuperarSenha;
