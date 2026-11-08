import CowIcon from "@/components/icons/CowIcon";
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
import appJson from "../../../app.json";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o usuário"),
  password: z.string().min(1, "Informe a senha"),
});
type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const theme = useTheme();
  const router = useRouter();
  const [erroCredenciais, setErroCredenciais] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    const user = await authRepository.authenticate(data.email, data.password);
    if (!user) {
      setErroCredenciais(true);
      return;
    }
    setErroCredenciais(false);
    router.replace("/rebanho");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.authBackground }}>
      <View style={style.body}>
        <View style={style.header}>
          <CowIcon width={76} height={76} color={theme.primaryPressed} />
          <Text style={[style.title, { color: theme.text }]}>BovManager</Text>
          <Text style={[style.subtitle, { color: theme.textSecondary }]}>
            Gestão do seu rebanho
          </Text>
        </View>

        <View style={style.form}>
          {erroCredenciais && (
            <View style={[style.errorBanner, { backgroundColor: theme.danger }]}>
              <Text style={{ color: theme.onDanger, fontWeight: "bold" }}>
                Usuário ou senha incorretos.
              </Text>
            </View>
          )}
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>USUÁRIO</Text>
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
                  placeholder="Usuário"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && <Text style={{ color: theme.danger }}>{errors.email.message}</Text>}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>SENHA</Text>
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
                  placeholder="Senha"
                  secureTextEntry={!senhaVisivel}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  right={
                    <TextInput.Icon
                      icon={senhaVisivel ? "eye-off" : "eye"}
                      onPress={() => setSenhaVisivel((v) => !v)}
                    />
                  }
                />
              )}
            />
            {errors.password && (
              <Text style={{ color: theme.danger }}>{errors.password.message}</Text>
            )}
          </View>
          <Button
            mode="contained"
            buttonColor={theme.primaryPressed}
            textColor={theme.onPrimary}
            style={{ height: 50, justifyContent: "center", borderRadius: 12, marginTop: 8 }}
            onPress={() => handleSubmit(onSubmit)()}
          >
            Entrar
          </Button>
          <Text
            style={{ textAlign: "center", color: theme.textSecondary, marginTop: 2 }}
            onPress={() => router.push("/recuperar-senha")}
          >
            Esqueci minha senha
          </Text>
          <Text
            style={{ textAlign: "center", color: theme.textSecondary, marginTop: 10 }}
            onPress={() => router.push("/cadastro-conta")}
          >
            Não tem conta? <Text style={{ color: theme.primaryPressed }}>Criar conta</Text>
          </Text>
        </View>

        <View style={{ flex: 1 }} />
        <Text style={[style.footer, { color: theme.textSecondary }]}>
          v{appJson.expo.version}
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
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    gap: 14,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "bold",
  },
  title: {
    fontFamily: "monospace",
    fontWeight: "800",
    fontSize: 26,
    textAlign: "center",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 13.5,
    textAlign: "center",
  },
  form: {
    gap: 14,
    marginTop: 44,
  },
  errorBanner: {
    borderRadius: 11,
    padding: 12,
  },
  footer: {
    textAlign: "center",
    fontSize: 10.5,
    fontFamily: "monospace",
  },
});
export default Login;
