import { Animal, ScanResult } from "@/app/(app)/(tabs)/escanear";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";
import { COLORS } from "@/constants/colors";
import CircleCheckIcon from "../icons/CircleCheckIcon";
import IconBadge from "@/components/icons/IconBadge";
import CowIcon from "@/components/icons/CowIcon";
import StatusBadge from "../StatusBadge/StatusBadge";
import { Animalstatus } from "../RebanhoCard/RebanhoCard";
import { Button } from "react-native-paper";
import TagOffIcon from "../icons/TagOnffcon";
interface ScanResultSheetProps {
  result: ScanResult;
  onViewAnimal: (animal: Animal) => void;
  onRegisterNow: (earRing: string) => void;
  onRetry: () => void;
}
const ScanResultSheet = ({
  result,
  onRegisterNow,
  onRetry,
  onViewAnimal,
}: ScanResultSheetProps) => {
  const theme = useTheme();
  if (result.status === "idle") return null;
  const getStatusColor = (status: Animalstatus) => {
    switch (status.toLocaleLowerCase()) {
      case "saudavel":
        return theme.success;
      case "doente":
        return theme.danger;
      default:
        return "";
    }
  };
  const getStatusText = (status: Animalstatus) => {
    switch (status) {
      case "saudavel":
        return "Saudável";
      case "doente":
        return "Doente";
      case "atencao":
        return "Atenção";
      case "semPendencias":
        return "Sem pendências";
    }
  };
  return (
    <SafeAreaView>
      {result.status === "found" && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[style.sheet, { backgroundColor: theme.surface }]}
        >
          <View style={style.firstRow}>
            <CircleCheckIcon color={COLORS.primary} height={20} width={20} />
            <Text
              style={[
                style.foundText,
                { color: result.status === "found" ? COLORS.primary : COLORS.secondary },
              ]}
            >
              Brinco reconhecido
            </Text>
          </View>
          <View style={[style.box, { backgroundColor: theme.surface }]}>
            <IconBadge
              size={46}
              backgroundColor={theme.iconBadge}
              icon={<CowIcon width={24} height={24} color={theme.onIconBadge} />}
            />
            <View style={style.capsuleRow}>
              <Text style={style.earRingInfo}>{result.animal.earRing}</Text>
              <Text style={[style.animalInfo, { color: theme.textSecondary }]}>
                {result.animal.breed}
              </Text>
            </View>
            <View style={style.badgeRow}>
              <StatusBadge
                text={getStatusText(result.animal.status)}
                color={getStatusColor(result.animal.status)}
              />
            </View>
          </View>
          <Button
            onPress={() => onViewAnimal(result.animal)}
            style={{
              backgroundColor: theme.primaryPressed,
              paddingHorizontal: 20,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
            labelStyle={{ fontSize: 14, fontWeight: "600" }}
            textColor={theme.background}
            mode="elevated"
          >
            Ver animal
          </Button>
        </Animated.View>
      )}
      {result.status === "notFound" && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[style.sheet, { backgroundColor: theme.surface, gap: 12 }]}
        >
          <View style={style.firstRow}>
            <TagOffIcon color={COLORS.secondary} height={20} width={20} />
            <Text style={[style.foundText, { color: COLORS.secondary }]}>
              Brinco não encontrado
            </Text>
          </View>
          <Text style={[style.animalInfo, { color: theme.textSecondary }]}>
            Nenhum animal cadastrado com o brinco {result.earRing}.
          </Text>
          <Button
            onPress={() => onRegisterNow(result.earRing)}
            style={{
              backgroundColor: theme.secondary,
              paddingHorizontal: 20,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
            labelStyle={{ fontSize: 14, fontWeight: "600" }}
            textColor={theme.background}
            mode="elevated"
          >
            Cadastrar novo animal
          </Button>
          <Button onPress={onRetry} textColor={theme.textSecondary}>
            Tentar novamente
          </Button>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  seeAnimalButton: {
    height: 50,
  },
  box: {
    height: 76,
    borderRadius: 10,
    paddingVertical: 12,

    gap: 12,
    flexDirection: "row",
  },
  foundText: {
    fontSize: 20,
    display: "flex",
    alignItems: "center",
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: 250,
  },
  capsuleRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 2,
  },
  longCapsule: {
    borderRadius: 8,
    width: "53%",
  },
  shortCapsule: {
    borderRadius: 8,
  },

  animalInfo: {
    fontSize: 11.5,
    fontWeight: "normal",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "center",
  },
  earRingInfo: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ScanResultSheet;
