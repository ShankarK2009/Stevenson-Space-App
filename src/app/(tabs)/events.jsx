import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  List,
} from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { events } from "../../data/events";

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar");
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);

  // Get events for selected month
  const getEventsForMonth = () => {
    const monthEvents = [];
    Object.keys(events).forEach((dateKey) => {
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
          events: events[dateKey],
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
    return events[dateKey] && events[dateKey].length > 0;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const dateKey = `${month}/${day}/${year}`;
    return events[dateKey] || [];
  };

  const handleDatePress = (day) => {
    if (!day) return;
    setCalendarSelectedDate(day);
  };

  const calendarDays = getCalendarDays();
  const selectedDayEvents = calendarSelectedDate
    ? getEventsForDate(calendarSelectedDate)
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.colors.statusBarStyle} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "700",
              color: theme.colors.text,
            }}
          >
            Events
          </Text>
        </View>

        {/* Native iOS Segmented Control */}
        <View
          style={{
            backgroundColor: theme.colors.inputBackground,
            borderRadius: 9,
            padding: 2,
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setViewMode("calendar")}
            activeOpacity={0.6}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 7,
              backgroundColor:
                viewMode === "calendar"
                  ? theme.colors.cardBackground
                  : "transparent",
              shadowColor: viewMode === "calendar" ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: viewMode === "calendar" ? 0.15 : 0,
              shadowRadius: 1,
              elevation: viewMode === "calendar" ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color:
                  viewMode === "calendar"
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            activeOpacity={0.6}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 7,
              backgroundColor:
                viewMode === "list"
                  ? theme.colors.cardBackground
                  : "transparent",
              shadowColor: viewMode === "list" ? "#000" : "transparent",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: viewMode === "list" ? 0.15 : 0,
              shadowRadius: 1,
              elevation: viewMode === "list" ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color:
                  viewMode === "list"
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Month Selector */}
        <View
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.inputBackground,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronLeft
              size={24}
              color={theme.colors.text}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: theme.colors.text,
              }}
            >
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => changeMonth(1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.inputBackground,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronRight
              size={24}
              color={theme.colors.text}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <View>
            {/* Calendar Grid */}
            <View
              style={{
                backgroundColor: theme.colors.cardBackground,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
              }}
            >
              {/* Day Headers */}
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {calendarDays.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDatePress(day)}
                    disabled={!day}
                    activeOpacity={0.6}
                    style={{
                      width: `${100 / 7}%`,
                      aspectRatio: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    {day && (
                      <View style={{ alignItems: "center" }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor:
                              calendarSelectedDate === day
                                ? theme.colors.stevensonGold
                                : "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight:
                                calendarSelectedDate === day ? "600" : "400",
                              color:
                                calendarSelectedDate === day
                                  ? "#000"
                                  : theme.colors.text,
                            }}
                          >
                            {day}
                          </Text>
                        </View>
                        {hasEventsOnDate(day) && (
                          <View
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor:
                                calendarSelectedDate === day
                                  ? "#000"
                                  : theme.colors.stevensonGold,
                              marginTop: 2,
                            }}
                          />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Selected Date Events */}
            {calendarSelectedDate && (
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: theme.colors.stevensonGold,
                    marginBottom: 12,
                  }}
                >
                  {new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    calendarSelectedDate,
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>

                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: theme.colors.cardBackground,
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: theme.colors.cardBorder,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: theme.colors.text,
                          marginBottom: 8,
                        }}
                      >
                        {event.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: theme.colors.textSecondary,
                          marginBottom: 8,
                        }}
                      >
                        {formatEventTime(event)}
                      </Text>

                      {event.description && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "400",
                            color: theme.colors.text,
                            marginBottom: 8,
                          }}
                        >
                          {event.description}
                        </Text>
                      )}

                      {event.location && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <MapPin
                            size={14}
                            color={theme.colors.textSecondary}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "400",
                              color: theme.colors.textSecondary,
                              marginLeft: 6,
                            }}
                          >
                            {event.location}
                          </Text>
                        </View>
                      )}

                      {event.categories && event.categories.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 12,
                          }}
                        >
                          {event.categories.map((category, catIndex) => (
                            <View
                              key={catIndex}
                              style={{
                                backgroundColor: theme.isDark
                                  ? "rgba(212, 175, 55, 0.2)"
                                  : "rgba(0, 105, 62, 0.1)",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                                marginRight: 8,
                                marginTop: 4,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "600",
                                  color: theme.colors.stevensonGold,
                                }}
                              >
                                {category}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      backgroundColor: theme.colors.cardBackground,
                      borderRadius: 16,
                      padding: 30,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: theme.colors.cardBorder,
                    }}
                  >
                    <Calendar size={32} color={theme.colors.textSecondary} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: theme.colors.textSecondary,
                        marginTop: 12,
                        textAlign: "center",
                      }}
                    >
                      No events on this day
                    </Text>
                  </View>
                )}
              </View>
            )}

            {!calendarSelectedDate && (
              <View
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderRadius: 16,
                  padding: 30,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <Calendar size={32} color={theme.colors.textSecondary} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: theme.colors.textSecondary,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  Select a date to view events
                </Text>
              </View>
            )}
          </View>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <View>
            {monthEvents.length > 0 ? (
              monthEvents.map((dayEvents, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  {/* Date Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Calendar size={16} color={theme.colors.stevensonGold} />
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "600",
                        color: theme.colors.stevensonGold,
                        marginLeft: 8,
                      }}
                    >
                      {dayEvents.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>

                  {/* Event Cards */}
                  {dayEvents.events.map((event, eventIndex) => (
                    <View
                      key={eventIndex}
                      style={{
                        backgroundColor: theme.colors.cardBackground,
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: theme.colors.cardBorder,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: theme.colors.text,
                          marginBottom: 8,
                        }}
                      >
                        {event.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: theme.colors.textSecondary,
                          marginBottom: 8,
                        }}
                      >
                        {formatEventTime(event)}
                      </Text>

                      {event.description && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "400",
                            color: theme.colors.text,
                            marginBottom: 8,
                          }}
                        >
                          {event.description}
                        </Text>
                      )}

                      {event.location && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <MapPin
                            size={14}
                            color={theme.colors.textSecondary}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "400",
                              color: theme.colors.textSecondary,
                              marginLeft: 6,
                            }}
                          >
                            {event.location}
                          </Text>
                        </View>
                      )}

                      {event.categories && event.categories.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 12,
                          }}
                        >
                          {event.categories.map((category, catIndex) => (
                            <View
                              key={catIndex}
                              style={{
                                backgroundColor: theme.isDark
                                  ? "rgba(212, 175, 55, 0.2)"
                                  : "rgba(0, 105, 62, 0.1)",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                                marginRight: 8,
                                marginTop: 4,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "600",
                                  color: theme.colors.stevensonGold,
                                }}
                              >
                                {category}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <Calendar size={48} color={theme.colors.textSecondary} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: theme.colors.text,
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  No Events This Month
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Check back later or browse other months
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
