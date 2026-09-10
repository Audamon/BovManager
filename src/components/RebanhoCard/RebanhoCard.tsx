import { View, Text, StyleSheet } from "react-native";
import IconBadge from "@/components/icons/IconBadge";
import CowIcon from "@/components/icons/CowIcon";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useTheme } from "@/hooks/use-theme";
interface RebanhoCardProps {
  animal: {
    name: string;
    status: Animalstatus;
    age: number;
    earRing: string;
    breed: string;
  };
}
type Animalstatus = "doente" | "saudavel" | "atencao" | "semPendencias";

const RebanhoCard = ({ animal }: RebanhoCardProps) => {
  const theme = useTheme();
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
    <View style={[style.box, { backgroundColor: theme.surface }]}>
      <IconBadge
        backgroundColor={theme.backgroundElement}
        icon={<CowIcon width={24} height={24} color={theme.textSecondary} />}
      />
      <View style={style.capsuleRow}>
        <View style={style.longCapsule}>
          <Text style={[style.animalName, { color: theme.text }]}>{animal.name}</Text>
        </View>
        <View style={style.shortCapsule}>
          <Text style={[style.animalInfo, { color: theme.textSecondary }]}>
            brinco {animal.earRing} · {animal.breed} · {animal.age} anos
          </Text>
        </View>
      </View>
      <View style={style.badgeRow}>
        <StatusBadge text={getStatusText(animal.status)} color={getStatusColor(animal.status)} />
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  box: {
    height: 76,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    flexDirection: "row",
  },
  fakeIcon: {
    height: 40,
    width: 40,
    borderRadius: 10,
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
  animalName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  animalInfo: {
    fontSize: 11.5,
    fontWeight: "normal",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "center",
  },
});
export default RebanhoCard;
