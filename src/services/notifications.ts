import { db } from "@/db/client";
import { vaccines } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

const PREFERENCE_KEY = "bovmanager_notifications_enabled";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const parseDataBr = (data: string): Date | null => {
  const [dia, mes, ano] = data.split("/").map(Number);
  if (!dia || !mes || !ano) return null;
  const date = new Date(ano, mes - 1, dia, 9, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getNotificationsEnabled = async () => {
  const value = await SecureStore.getItemAsync(PREFERENCE_KEY);
  return value !== "false";
};

export const scheduleVaccineReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const previstas = db.select().from(vaccines).where(eq(vaccines.applied, false)).all();
  const agora = Date.now();
  for (const vacina of previstas) {
    const data = parseDataBr(vacina.date);
    if (!data || data.getTime() <= agora) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Vacina prevista",
        body: `${vacina.name} está prevista para ${vacina.date}.`,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: data },
    });
  }
};

export const setNotificationsEnabled = async (enabled: boolean) => {
  await SecureStore.setItemAsync(PREFERENCE_KEY, enabled ? "true" : "false");
  if (enabled) {
    await scheduleVaccineReminders();
  } else {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
