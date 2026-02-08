import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Info } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [notificationSettings, setNotificationSettings] = React.useState({
    classStart: false,
    periodEnd: false,
  });

  React.useEffect(() => {
    // Load initial settings
    import("../../utils/notificationUtils").then(({ getNotificationSettings }) => {
      getNotificationSettings().then(setNotificationSettings);
    });
  }, []);

  const toggleSetting = async (key) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(newSettings);

    // Save and reschedule
    const { saveNotificationSettings } = await import("../../utils/notificationUtils");
    await saveNotificationSettings(newSettings);
  };

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
          {/* Class Start Notification */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.cardBorder,
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
                  Class Start
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Get notified when class begins
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.classStart}
              onValueChange={() => toggleSetting("classStart")}
              ios_backgroundColor={theme.colors.inputBackground}
              trackColor={{
                false: theme.colors.inputBackground,
                true: theme.colors.stevensonGold,
              }}
            />
          </View>

          {/* Period End Notification */}
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
                  Period End
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: theme.colors.textSecondary,
                  }}
                >
                  Get notified 5 mins before end
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.periodEnd}
              onValueChange={() => toggleSetting("periodEnd")}
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
