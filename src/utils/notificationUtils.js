import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getCurrentPeriodInfo, getScheduleForDate } from "./scheduleUtils";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

// Default settings
const DEFAULT_SETTINGS = {
    classStart: false,
    periodEnd: false,
};

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification!");
            return;
        }
    } else {
        // console.log("Must use physical device for Push Notifications");
    }
}

export async function getNotificationSettings() {
    try {
        const jsonValue = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
    } catch (e) {
        console.error("Error reading notification settings", e);
        return DEFAULT_SETTINGS;
    }
}

export async function saveNotificationSettings(settings) {
    try {
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, jsonValue);
        // Reschedule whenever settings change
        await scheduleClassNotifications(settings);
    } catch (e) {
        console.error("Error saving notification settings", e);
    }
}

export async function scheduleClassNotifications(settings = null) {
    // If settings not provided, fetch them
    if (!settings) {
        settings = await getNotificationSettings();
    }

    // Cancel all existing notifications first to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // If both settings are off, just return after cancelling
    if (!settings.classStart && !settings.periodEnd) {
        console.log("Notifications disabled, cleared all schedules.");
        return;
    }

    // Schedule for Today and Tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let scheduledCount = 0;

    for (const date of [today, tomorrow]) {
        const scheduleInfo = getCurrentPeriodInfo(date);

        // Skip if no school or no periods (e.g. weekends/holidays)
        if (!scheduleInfo.isSchoolDay || !scheduleInfo.allPeriods) {
            continue;
        }

        const { allPeriods } = scheduleInfo;

        for (const period of allPeriods) {
            // Skip special periods if needed, or non-numeric if desired?
            // For now, schedule for all periods returned by scheduleUtils

            // 1. Class Start Notification
            if (settings.classStart) {
                // Schedule exactly at start time
                // console.log("Debug: Scheduling start notification for", period.startTime);
                if (period.startTime > new Date()) { // Only schedule future events
                    /*
                    console.log("Debug: Triggering scheduleNotificationAsync with:", {
                        date: period.startTime,
                        type: typeof period.startTime,
                        isDate: period.startTime instanceof Date
                    });
                    */

                    // Workaround: Calculate seconds until start and use seconds trigger if Date is failing?
                    // But first let's see why Date fails. 
                    // Actually, let's try just passing the timestamp? No, trigger needs Date or object.

                    // Let's try passing seconds to be safe, as it's often more reliable across versions if Date is buggy
                    const secondsUntil = Math.floor((period.startTime.getTime() - new Date().getTime()) / 1000);

                    if (secondsUntil > 0) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Period ${period.period} Starting`,
                                body: `Class is starting now.`,
                            },
                            trigger: {
                                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                                seconds: secondsUntil,
                                repeats: false
                            },
                        });
                        scheduledCount++;
                    }
                }
            }

            // 2. Period End Notification (5 minutes before)
            if (settings.periodEnd) {
                const fiveMinutesBeforeEnd = new Date(period.endTime.getTime() - 5 * 60 * 1000);

                // Only schedule if the trigger time is in the future AND the class actually started
                // (Avoid notifications for classes that haven't started yet if the "end warning" is somehow before "now" - unlikely but safe)
                if (fiveMinutesBeforeEnd > new Date() && fiveMinutesBeforeEnd > period.startTime) {
                    const secondsUntilEnd = Math.floor((fiveMinutesBeforeEnd.getTime() - new Date().getTime()) / 1000);

                    if (secondsUntilEnd > 0) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Period ${period.period} Ending Soon`,
                                body: `Class ends in 5 minutes.`,
                            },
                            trigger: {
                                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                                seconds: secondsUntilEnd,
                                repeats: false
                            },
                        });
                        scheduledCount++;
                    }
                }
            }
        }
    }

    console.log(`Scheduled ${scheduledCount} notifications for the next 2 days.`);
}
