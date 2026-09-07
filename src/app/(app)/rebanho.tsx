import AppHeader from "@/components/AppHeader/AppHeader";
import CowIcon from "@/components/icons/CowIcon";
import EmptyState from "@/components/RebanhoComponents/EmptyState";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Rebanho = () => {
  const [busca, setBusca] = useState("");
  const [status /*, setStatus*/] = useState<"loading" | "empty" | "loaded">("empty");
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Rebanho"
        leftIcon={
          <View style={style.icon}>
            <CowIcon color={theme.surface} width={32} height={32} />
          </View>
        }
        subtitle="teste"
      />
      <View style={style.body}>
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
        {status === "empty" && <EmptyState />}
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: `rgba(255, 255, 255, 0.16)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
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
