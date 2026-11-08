import AppHeader from "@/components/AppHeader/AppHeader";
import UserIcon from "@/components/icons/UserIcon";
import { Text, View, StyleSheet, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useThemePreference } from "@/hooks/theme-preference";
import { authRepository, AuthUser } from "@/services/auth";
import { getNotificationsEnabled, setNotificationsEnabled } from "@/services/notifications";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import appJson from "../../../../app.json";

const iniciais = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");

const Perfil = () => {
  const theme = useTheme();
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();
  const [notificacoes, setNotificacoes] = useState(true);
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  useFocusEffect(
    useCallback(() => {
      authRepository.getCurrentUser().then(setUsuario);
      getNotificationsEnabled().then(setNotificacoes);
    }, []),
  );

  const onSair = async () => {
    await authRepository.logout();
    router.replace("/login");
  };

  const onNotificacoesChange = async (ligado: boolean) => {
    setNotificacoes(ligado);
    await setNotificationsEnabled(ligado);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader
        title="Perfil"
        leftIcon={
          <View style={[style.icon, { backgroundColor: theme.iconBadge }]}>
            <UserIcon color={theme.textTherdiary} width={32} height={32} />
          </View>
        }
      />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        {usuario ? (
          <View style={[style.card, style.userRow, { backgroundColor: theme.surface }]}>
            <View style={[style.avatar, { backgroundColor: theme.iconBadge }]}>
              <Text style={[style.avatarText, { color: theme.onIconBadge }]}>
                {iniciais(usuario.name)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[style.userName, { color: theme.text }]}>{usuario.name}</Text>
              <Text style={[style.userEmail, { color: theme.textSecondary }]}>
                {usuario.email}
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            style={[style.card, style.userRow, { backgroundColor: theme.surface }]}
            onPress={() => router.push("/login")}
          >
            <View style={{ flex: 1 }}>
              <Text style={[style.userName, { color: theme.text }]}>Nenhum usuário logado</Text>
              <Text style={[style.userEmail, { color: theme.textSecondary }]}>
                Toque para entrar
              </Text>
            </View>
          </Pressable>
        )}

        <View style={[style.card, { backgroundColor: theme.surface }]}>
          <View style={style.row}>
            <Text style={[style.rowLabel, { color: theme.text }]}>Fazenda</Text>
            <Text style={{ color: theme.textSecondary }}>{usuario?.farm ?? "—"}</Text>
          </View>
          <View style={[style.divider, { backgroundColor: theme.border }]} />
          <View style={style.row}>
            <Text style={[style.rowLabel, { color: theme.text }]}>Notificações</Text>
            <Switch
              value={notificacoes}
              onValueChange={onNotificacoesChange}
              trackColor={{ false: theme.border, true: theme.primaryPressed }}
              thumbColor={theme.surface}
              ios_backgroundColor={theme.border}
            />
          </View>
          <View style={[style.divider, { backgroundColor: theme.border }]} />
          <View style={style.row}>
            <Text style={[style.rowLabel, { color: theme.text }]}>Modo escuro</Text>
            <Switch
              value={preference === "dark"}
              onValueChange={(ligado) => setPreference(ligado ? "dark" : "light")}
              trackColor={{ false: theme.border, true: theme.primaryPressed }}
              thumbColor={theme.surface}
              ios_backgroundColor={theme.border}
            />
          </View>
          <View style={[style.divider, { backgroundColor: theme.border }]} />
          <View style={style.row}>
            <Text style={[style.rowLabel, { color: theme.text }]}>Sobre o {appJson.expo.name}</Text>
            <Text style={{ color: theme.textSecondary }}>v{appJson.expo.version}</Text>
          </View>
        </View>

        {usuario && (
          <Pressable
            style={[style.card, style.row, { backgroundColor: theme.surface }]}
            onPress={() => router.push("/trocar-senha")}
          >
            <Text style={[style.rowLabel, { color: theme.text }]}>Trocar senha</Text>
          </Pressable>
        )}

        {usuario && (
          <Pressable style={[style.card, style.row]} onPress={onSair}>
            <Text style={[style.rowLabel, { color: theme.danger }]}>Sair</Text>
          </Pressable>
        )}

        <Text style={[style.footerInfo, { color: theme.textSecondary }]}>
          Todos os dados ficam só no aparelho nessa versão.
        </Text>
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
    gap: 14,
  },
  card: {
    borderRadius: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15.5,
  },
  userEmail: {
    fontSize: 12.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  rowLabel: {
    fontSize: 14.5,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  footerInfo: {
    fontSize: 12,
  },
});
export default Perfil;
