import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { CalendarPlus } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import Analytics from "../../utils/analyticsUtils";
import staticEvents from "../../data/events.json";
import { getEvents, fetchAndCacheEvents } from "../../utils/eventsManager";
import EventCalendar from "../../components/EventCalendar";
import EventList from "../../components/EventList";
import CalendarSubscriptions from "../../components/CalendarSubscriptions";

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const posthog = usePostHog();
  const [eventsData, setEventsData] = useState(staticEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar");
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  useEffect(() => {
    // 1. Load from cache (fast)
    getEvents().then(({ data }) => {
      setEventsData(data);

      // 2. Fetch fresh data (background)
      fetchAndCacheEvents().then(freshData => {
        if (freshData) {
          setEventsData(freshData);
        }
      }).catch(err => console.log("Background fetch failed", err));
    });
  }, []);

  // Get events for selected month
  const getEventsForMonth = () => {
    const monthEvents = [];
    Object.keys(eventsData).forEach((dateKey) => {
      // Parse "M/D/YYYY" manually
      const [monthStr, dayStr, yearStr] = dateKey.split("/");
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);

      if (
        month === selectedDate.getMonth() + 1 &&
        year === selectedDate.getFullYear()
      ) {
        const eventDate = new Date(year, month - 1, day);
        monthEvents.push({
          date: eventDate,
          dateKey,
          events: eventsData[dateKey],
        });
      }
    });
    return monthEvents.sort((a, b) => a.date - b.date);
  };

  const monthEvents = getEventsForMonth();

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
    setCalendarSelectedDate(null);
  };

  const formatEventTime = (event) => {
    if (event.allDay) {
      return "All Day";
    }
    const start = new Date(event.start);
    const end = new Date(event.end);
    return `${start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  // Get calendar grid
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const hasEventsOnDate = (day) => {
    if (!day) return false;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const dateKey = `${month}/${day}/${year}`;
    return eventsData[dateKey] && eventsData[dateKey].length > 0;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const dateKey = `${month}/${day}/${year}`;
    return eventsData[dateKey] || [];
  };

  const handleDatePress = (day) => {
    if (!day) return;
    setCalendarSelectedDate(day);
  };

  const calendarDays = getCalendarDays();
  const selectedDayEvents = calendarSelectedDate
    ? getEventsForDate(calendarSelectedDate)
    : [];

  const styles = createStyles(theme);

  return (
    <View collapsable={false} style={styles.container}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === "android" ? insets.top + 20 : 20,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events</Text>
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={() => {
                Analytics.capture("calendar_subscriptions_opened");
                setShowSubscriptions(true);
              }}
              style={styles.subscribeButton}
              activeOpacity={0.6}
              testID="calendar-subscriptions-button"
            >
              <CalendarPlus size={22} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Native iOS Segmented Control */}
        <View style={styles.segmentedControlContainer}>
          <SegmentedControl
            values={["Calendar", "List"]}
            selectedIndex={viewMode === "calendar" ? 0 : 1}
            onChange={(event) => {
              const newMode = event.nativeEvent.selectedSegmentIndex === 0 ? "calendar" : "list";
              Analytics.capture("events_view_changed", {
                view_mode: newMode,
                previous_mode: viewMode,
                platform: Platform.OS,
              });
              setViewMode(newMode);
            }}
            fontStyle={{
              color: theme.colors.text
            }}
            activeFontStyle={{
              color: theme.colors.text
            }}
            style={{
              // Native look
            }}
            tintColor={theme.colors.cardBackground}
          />
        </View>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <EventCalendar
            selectedDate={selectedDate}
            calendarSelectedDate={calendarSelectedDate}
            changeMonth={changeMonth}
            calendarDays={calendarDays}
            handleDatePress={handleDatePress}
            hasEventsOnDate={hasEventsOnDate}
            selectedDayEvents={selectedDayEvents}
            formatEventTime={formatEventTime}
          />
        )}

        {/* List View */}
        {viewMode === "list" && (
          <EventList
            monthEvents={monthEvents}
            formatEventTime={formatEventTime}
          />
        )}
      </ScrollView>

      {/* Calendar Subscriptions Modal */}
      <CalendarSubscriptions
        visible={showSubscriptions}
        onClose={() => setShowSubscriptions(false)}
      />
    </View>
  );
}

const createStyles = (theme) => {
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 34,
      fontWeight: "700",
      color: theme.colors.text,
    },
    subscribeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    segmentedControlContainer: {
      marginBottom: 20,
    },
  };
};
