import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, Calendar as CalendarIcon, Utensils } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getCurrentPeriodInfo,
  formatTime,
  getLunchDayNumber,
} from "../../utils/scheduleUtils";
import { lunchMenu } from "../../data/lunchMenu";

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [periodInfo, setPeriodInfo] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setPeriodInfo(getCurrentPeriodInfo(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const lunchDay = getLunchDayNumber(currentTime);
  const todaysLunchData = lunchMenu.find((menu) => menu.dayNumber === lunchDay);
  const todaysLunch = todaysLunchData
    ? `${todaysLunchData.comfortFood} • ${todaysLunchData.mindful}\nSides: ${todaysLunchData.sides}\nSoup: ${todaysLunchData.soup}`
    : "No lunch menu available";

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
              marginBottom: 4,
            }}
          >
            Today
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "400",
              color: theme.colors.textSecondary,
            }}
          >
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Current Period Card */}
        {periodInfo?.isSchoolDay ? (
          <View
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
            }}
          >
            {periodInfo.currentPeriod ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Clock size={20} color={theme.colors.stevensonGold} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                      color: theme.colors.stevensonGold,
                      marginLeft: 8,
                    }}
                  >
                    CURRENT PERIOD
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  {periodInfo.currentPeriod}
                </Text>
                {periodInfo.timeRemaining && (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {formatTimeRemaining(periodInfo.timeRemaining)} remaining
                  </Text>
                )}
              </>
            ) : periodInfo.nextPeriod ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Clock size={20} color={theme.colors.textSecondary} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                      color: theme.colors.textSecondary,
                      marginLeft: 8,
                    }}
                  >
                    BETWEEN PERIODS
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  Next: {periodInfo.nextPeriod}
                </Text>
                {periodInfo.timeUntilNext && (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Starts in {formatTimeRemaining(periodInfo.timeUntilNext)}
                  </Text>
                )}
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Clock size={20} color={theme.colors.textSecondary} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                      color: theme.colors.textSecondary,
                      marginLeft: 8,
                    }}
                  >
                    SCHOOL DAY
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: theme.colors.text,
                  }}
                >
                  School day ended
                </Text>
              </>
            )}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <CalendarIcon size={20} color={theme.colors.textSecondary} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  letterSpacing: 0.5,
                  color: theme.colors.textSecondary,
                  marginLeft: 8,
                }}
              >
                NO SCHOOL TODAY
              </Text>
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: theme.colors.text,
              }}
            >
              Enjoy your day off!
            </Text>
          </View>
        )}

        {/* Today's Schedule */}
        {periodInfo?.isSchoolDay && periodInfo?.allPeriods && (
          <View
            style={{
              backgroundColor: theme.colors.cardBackground,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: theme.colors.text,
                marginBottom: 16,
              }}
            >
              Today's Schedule
            </Text>

            {periodInfo.allPeriods.map((pd, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth:
                    index < periodInfo.allPeriods.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.borderLight,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color:
                      pd.period === periodInfo.currentPeriod
                        ? theme.colors.stevensonGold
                        : theme.colors.text,
                  }}
                >
                  {pd.period}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {pd.startTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {pd.endTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Lunch Menu */}
        <View
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Utensils size={20} color={theme.colors.stevensonGold} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: theme.colors.text,
                marginLeft: 8,
              }}
            >
              Today's Lunch
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              color: theme.colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Day {lunchDay}
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "400",
              color: theme.colors.text,
              lineHeight: 24,
            }}
          >
            {todaysLunch}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
