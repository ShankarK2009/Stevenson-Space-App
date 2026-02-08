import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, Alert, Platform, ActionSheetIOS, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getCurrentPeriodInfo,
  getNextSchoolDayInfo,
  formatTimeRemaining,
} from "../../utils/scheduleUtils";
import lunchMenu from "../../data/lunchMenu.json";
import CurrentPeriodCard from "../../components/CurrentPeriodCard";
import ScheduleList from "../../components/ScheduleList";
import LunchCard from "../../components/LunchCard";
import PWCCard from "../../components/PWCCard";

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [periodInfo, setPeriodInfo] = useState(null);
  const [scheduleMode, setScheduleMode] = useState(null); // null = auto/default
  const [nextSchoolDay, setNextSchoolDay] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setPeriodInfo(getCurrentPeriodInfo(now, scheduleMode)); // Pass preferred mode
      setNextSchoolDay(getNextSchoolDayInfo(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [scheduleMode]);

  // Handle schedule mode change
  const handleModePress = useCallback(() => {
    if (!periodInfo?.schedule?.allModes || periodInfo.schedule.allModes.length <= 1) {
      Alert.alert("No alternate schedules", "This day only has one schedule mode.");
      return;
    }

    const modes = periodInfo.schedule.allModes;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...modes, 'Cancel'],
          cancelButtonIndex: modes.length,
          title: "Select Schedule Mode"
        },
        (buttonIndex) => {
          if (buttonIndex < modes.length) {
            setScheduleMode(modes[buttonIndex]);
          }
        }
      );
    } else {
      // Android Alert
      Alert.alert(
        "Select Schedule Mode",
        "Choose a schedule for today",
        modes.map(mode => ({
          text: mode,
          onPress: () => setScheduleMode(mode)
        })).concat({ text: "Cancel", style: "cancel" })
      );
    }
  }, [periodInfo?.schedule?.allModes]);

  // Memoize date string and lunch lookup to avoid recalculating every second
  const dateString = useMemo(() =>
    `${currentTime.getMonth() + 1}/${currentTime.getDate()}/${currentTime.getFullYear()}`,
    [currentTime.getMonth(), currentTime.getDate(), currentTime.getFullYear()]
  );
  const todaysLunchData = useMemo(() =>
    lunchMenu.find((menu) => menu.date === dateString),
    [dateString]
  );

  return (
    <View style={styles.container}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Today </Text>
          <Text style={styles.headerSubtitle}>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Current Period Card */}
        <CurrentPeriodCard
          periodInfo={periodInfo}
          nextSchoolDay={nextSchoolDay}
        />

        {/* Today's Schedule */}
        <ScheduleList
          periodInfo={periodInfo}
          handleModePress={handleModePress}
        />

        {/* PWC Schedule */}
        <PWCCard date={currentTime} />

        {/* Lunch Menu */}
        {todaysLunchData && periodInfo?.isSchoolDay && (
          <LunchCard
            todaysLunch={`Comfort: ${todaysLunchData.comfortFood}\nMindful: ${todaysLunchData.mindful}\nSides: ${todaysLunchData.sides}\nSoup: ${todaysLunchData.soup}`}
          />
        )}
      </ScrollView >
    </View >
  );
}

const createStyles = (theme) => {
  // We need to use a function or careful structure if we want to use `StyleSheet.create` with dynamic values.
  // Ideally, useTheme returns themes that we can directly use. 
  // Since useTheme hook is inside the component, we can use useMemo or just create the object. 
  // However, StyleSheet.create is best for static styles. Dynamic styles are often inline or memoized objects.
  // Because the theme can change, we should probably just return a plain object or use a memoized style creator if performance is critical.
  // For simplicity and readability matching the previous pattern found in other files (like EventCalendar.jsx):
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 34,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 17,
      fontWeight: "400",
      color: theme.colors.textSecondary,
    },
  };
};
