import AppHeader from "@/components/AppHeader/AppHeader";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import CowIcon from "@/components/icons/CowIcon";
import EmptyState from "@/components/RebanhoComponents/EmptyState";
import LoadedState from "@/components/RebanhoComponents/LoadedState";
import { db } from "@/db/client";
import { Animal, animals } from "@/db/schema";
import { useTheme } from "@/hooks/use-theme";
import { authRepository, AuthUser } from "@/services/auth";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Menu, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Rebanho = () => {
  const [busca, setBusca] = useState("");
  const [rebanho, setRebanho] = useState<Animal[]>([]);
  const [filtroRaca, setFiltroRaca] = useState<string | null>(null);
  const [filtroCurral, setFiltroCurral] = useState<string | null>(null);
  const [menuRacaAberto, setMenuRacaAberto] = useState(false);
  const [menuCurralAberto, setMenuCurralAberto] = useState(false);
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const theme = useTheme();
  useFocusEffect(
    useCallback(() => {
      setRebanho(db.select().from(animals).all());
      authRepository.getCurrentUser().then(setUsuario);
    }, []),
  );
  const racasDisponiveis = Array.from(new Set(rebanho.map((a) => a.breed))).sort();
  const curraisDisponiveis = Array.from(
    new Set(rebanho.map((a) => a.location).filter((l): l is string => !!l)),
  ).sort();

  const buscaNormalizada = busca.trim().toLowerCase();
  const rebanhoFiltrado = rebanho
    .filter(
      (animal) =>
        !buscaNormalizada ||
        animal.name?.toLowerCase().includes(buscaNormalizada) ||
        animal.earRing.toLowerCase().includes(buscaNormalizada),
    )
    .filter((animal) => !filtroRaca || animal.breed === filtroRaca)
    .filter((animal) => !filtroCurral || animal.location === filtroCurral);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
      <AppHeader
        title="Rebanho"
        leftIcon={
          <View style={[style.icon, { backgroundColor: theme.iconBadge }]}>
            <CowIcon color={theme.textTherdiary} width={32} height={32} />
          </View>
        }
        subtitle={usuario?.farm}
      />
      <View style={[style.body, { backgroundColor: theme.backgroundElement }]}>
        <Searchbar
          placeholder="Buscar por nome ou nº do brinco"
          placeholderTextColor={theme.textSecondary}
          value={busca}
          onChangeText={setBusca}
          mode="bar"
          elevation={0}
          inputStyle={style.searchInput}
          style={[
            style.searchbar,
            { borderColor: theme.backgroundSelected, backgroundColor: theme.surface },
          ]}
        />
        <View style={style.filterRow}>
          <Menu
            visible={menuRacaAberto}
            onDismiss={() => setMenuRacaAberto(false)}
            contentStyle={{ backgroundColor: theme.surface }}
            anchor={
              <Pressable
                onPress={() => setMenuRacaAberto(true)}
                style={[
                  style.filterChip,
                  {
                    backgroundColor: filtroRaca ? theme.primaryPressed : theme.surface,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
              >
                <Text style={{ color: filtroRaca ? theme.onPrimary : theme.textSecondary }}>
                  {filtroRaca ?? "Raça"}
                </Text>
              </Pressable>
            }
          >
            <Menu.Item
              title="Todas as raças"
              titleStyle={{ color: theme.text }}
              onPress={() => {
                setFiltroRaca(null);
                setMenuRacaAberto(false);
              }}
            />
            {racasDisponiveis.map((raca) => (
              <Menu.Item
                key={raca}
                title={raca}
                titleStyle={{ color: theme.text }}
                onPress={() => {
                  setFiltroRaca(raca);
                  setMenuRacaAberto(false);
                }}
              />
            ))}
          </Menu>
          <Menu
            visible={menuCurralAberto}
            onDismiss={() => setMenuCurralAberto(false)}
            contentStyle={{ backgroundColor: theme.surface }}
            anchor={
              <Pressable
                onPress={() => setMenuCurralAberto(true)}
                style={[
                  style.filterChip,
                  {
                    backgroundColor: filtroCurral ? theme.primaryPressed : theme.surface,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
              >
                <Text style={{ color: filtroCurral ? theme.onPrimary : theme.textSecondary }}>
                  {filtroCurral ?? "Curral / pasto"}
                </Text>
              </Pressable>
            }
          >
            <Menu.Item
              title="Todos os currais"
              titleStyle={{ color: theme.text }}
              onPress={() => {
                setFiltroCurral(null);
                setMenuCurralAberto(false);
              }}
            />
            {curraisDisponiveis.map((curral) => (
              <Menu.Item
                key={curral}
                title={curral}
                titleStyle={{ color: theme.text }}
                onPress={() => {
                  setFiltroCurral(curral);
                  setMenuCurralAberto(false);
                }}
              />
            ))}
          </Menu>
        </View>
        {rebanhoFiltrado.length === 0 ? (
          <EmptyState />
        ) : (
          <LoadedState animais={rebanhoFiltrado} />
        )}
      </View>
      {rebanho.length > 0 && <FloatingButton />}
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
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    padding: 16,
  },
  searchbar: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 11,
    height: 46,
  },
  searchInput: {
    minHeight: 0,
    alignSelf: "center",
    paddingVertical: 0,
  },
});
export default Rebanho;
