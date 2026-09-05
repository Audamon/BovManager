import { Tabs } from "expo-router";
import CowIcon from "@/components/icons/CowIcon";
import { COLORS } from "@/constants/colors";
import QrcodeIcon from "@/components/icons/QrcodeIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import UserIcon from "@/components/icons/UserIcon";
import CowIconFilled from "@/components/icons/CowIconFilled";
import ClockIconFilled from "@/components/icons/ClockIconFilled";
import UserIconFilled from "@/components/icons/UserIconFilled";
const AppTabs = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="rebanho"
        options={{
          title: "Rebanho",
          tabBarIcon: ({ size, color, focused }) =>
            focused ? (
              <CowIconFilled width={size} height={size} color={color} />
            ) : (
              <CowIcon width={size} height={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="escanear"
        options={{
          title: "Escanear",
          tabBarIcon: ({ size, color }) => <QrcodeIcon width={size} height={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ size, color, focused }) =>
            focused ? (
              <ClockIconFilled width={size} height={size} color={color} />
            ) : (
              <ClockIcon width={size} height={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ size, color, focused }) =>
            focused ? (
              <UserIconFilled width={size} height={size} color={color} />
            ) : (
              <UserIcon width={size} height={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default AppTabs;
