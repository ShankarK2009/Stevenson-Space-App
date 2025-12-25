import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Calendar, Info } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = React.useState(false);

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
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "700",
              color: theme.colors.text,
            }}
          >
            Settings
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.borderLight,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Bell size={22} color={theme.colors.stevensonGold} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "400",
                    color: theme.colors.text,
                    marginBottom: 2,
                  }}
                >
                  Period Notifications
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Get notified before periods end
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              ios_backgroundColor={theme.colors.inputBackground}
              trackColor={{
                false: theme.colors.inputBackground,
                true: theme.colors.stevensonGold,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Calendar size={22} color={theme.colors.stevensonGold} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "400",
                    color: theme.colors.text,
                    marginBottom: 2,
                  }}
                >
                  Calendar Sync
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Sync with Google/Apple Calendar
                </Text>
              </View>
            </View>
            <Switch
              value={calendarSyncEnabled}
              onValueChange={setCalendarSyncEnabled}
              ios_backgroundColor={theme.colors.inputBackground}
              trackColor={{
                false: theme.colors.inputBackground,
                true: theme.colors.stevensonGold,
              }}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Info size={22} color={theme.colors.stevensonGold} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "400",
                  color: theme.colors.text,
                }}
              >
                About
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.isDark
                ? "rgba(212, 175, 55, 0.2)"
                : "rgba(0, 105, 62, 0.1)",
              borderWidth: 2,
              borderColor: theme.colors.stevensonGold,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "600",
                color: theme.colors.stevensonGold,
              }}
            >
              SHS
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: theme.colors.text,
              marginBottom: 4,
            }}
          >
            Stevenson Agenda
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              color: theme.colors.textSecondary,
            }}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
