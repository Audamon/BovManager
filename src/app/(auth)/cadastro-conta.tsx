import { authRepository } from "@/services/auth";
import { useTheme } from "@/hooks/use-theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const cadastroContaSchema = z
  .object({
    name: z.string().min(1, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    farm: z.string().min(1, "Informe o nome da fazenda"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Repita a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type CadastroContaForm = z.infer<typeof cadastroContaSchema>;

const CadastroConta = () => {
  const theme = useTheme();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroContaForm>({
    resolver: zodResolver(cadastroContaSchema),
    defaultValues: { name: "", email: "", farm: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: CadastroContaForm) => {
    await authRepository.createUser(data);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.authBackground }}>
      <View style={style.body}>
        <View>
          <Text style={[style.title, { color: theme.text }]}>Crie sua conta</Text>
          <Text style={[style.subtitle, { color: theme.textSecondary }]}>
            Comece a gerenciar seu rebanho
          </Text>
        </View>

        <View style={style.form}>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>NOME COMPLETO</Text>
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
                  placeholder="Ex: João Alfredo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.name && <Text style={{ color: theme.danger }}>{errors.name.message}</Text>}
          </View>
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
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && <Text style={{ color: theme.danger }}>{errors.email.message}</Text>}
          </View>
          <View>
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>FAZENDA</Text>
            <Controller
              control={control}
              name="farm"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  outlineColor={theme.border}
                  activeOutlineColor={theme.primaryPressed}
                  textColor={theme.text}
                  style={{ backgroundColor: theme.surface }}
                  placeholder="Ex: Fazenda Boa Vista"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.farm && <Text style={{ color: theme.danger }}>{errors.farm.message}</Text>}
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
            <Text style={[style.fieldLabel, { color: theme.textSecondary }]}>CONFIRMAR SENHA</Text>
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
                  placeholder="Repita a senha"
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
          Criar conta
        </Button>
        <Text
          style={{ textAlign: "center", color: theme.textSecondary, marginTop: 10 }}
          onPress={() => router.push("/login")}
        >
          Já tem uma conta? <Text style={{ color: theme.primaryPressed }}>Entrar</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
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
});
export default CadastroConta;
