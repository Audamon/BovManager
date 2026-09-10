import AppHeader from "@/components/AppHeader/AppHeader";
import UserIcon from "@/components/icons/UserIcon";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
const Perfil = () => {
  const theme = useTheme();
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundElement }}>
         <AppHeader title="Perfil"
         leftIcon={
           <View style={style.icon}>
             <UserIcon color={theme.textTherdiary} width={32} height={32} />
           </View>
         }
         />
         <View  style={[style.body, { backgroundColor: theme.backgroundElement }]}>
           <Text>Conteúdo do perfil</Text>
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
});
export default Perfil;
