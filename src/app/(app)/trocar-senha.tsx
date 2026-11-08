import AppHeader from "@/components/AppHeader/AppHeader";
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

const trocarSenhaSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Repita a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type TrocarSenhaForm = z.infer<typeof trocarSenhaSchema>;

const TrocarSenha = () => {
  const theme = useTheme();
  const router = useRouter();
  const [senhaAtualErrada, setSenhaAtualErrada] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TrocarSenhaForm>({
    resolver: zodResolver(trocarSenhaSchema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: TrocarSenhaForm) => {
    const usuario = await authRepository.getCurrentUser();
    if (!usuario) {
      router.replace("/login");
      return;
    }
    const ok = await authRepository.changePassword(
      usuario.email,
      data.currentPassword,
      data.password,
    );
    if (!ok) {
      setSenhaAtualErrada(true);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader onBackPress={() => router.back()} title="TROCAR SENHA" />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        <View style={style.form}>
          {senhaAtualErrada && (
            <View style={[style.errorBanner, { backgroundColor: theme.danger }]}>
              <Text style={{ color: theme.onDanger, fontWeight: "bold" }}>
                Senha atual incorreta.
              </Text>
            </View>
          )}
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>SENHA ATUAL</Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  secureTextEntry
                  value={value}
                  onChangeText={(texto) => {
                    setSenhaAtualErrada(false);
                    onChange(texto);
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.currentPassword && (
              <Text style={{ color: theme.danger }}>{errors.currentPassword.message}</Text>
            )}
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
          style={{ height: 48, justifyContent: "center", borderRadius: 11 }}
          onPress={() => handleSubmit(onSubmit)()}
        >
          Atualizar senha
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
  errorBanner: {
    borderRadius: 11,
    padding: 12,
  },
});
export default TrocarSenha;
