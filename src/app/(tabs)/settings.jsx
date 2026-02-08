import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, Linking, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Info, X, Github, ExternalLink, Code } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [aboutVisible, setAboutVisible] = React.useState(false);
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
            onPress={() => setAboutVisible(true)}
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
            Stevenson Space
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

      {/* About Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={aboutVisible}
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={() => setAboutVisible(false)}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </TouchableWithoutFeedback>

          <View style={{
            width: '85%',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: theme.colors.cardBorder,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>About</Text>
              <TouchableOpacity onPress={() => setAboutVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 16, lineHeight: 24, color: theme.colors.text, marginBottom: 16 }}>
                <Text style={{ fontWeight: '700', color: theme.colors.stevensonGold }}>Stevenson Space</Text> is an open-source initiative designed to improve the student experience at Stevenson High School.
              </Text>

              <Text style={{ fontSize: 16, lineHeight: 24, color: theme.colors.text, marginBottom: 24 }}>
                Built by students, for students, this app aims to provide a modern, centralized platform for accessing school resources, schedules, and events.
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 105, 62, 0.08)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 100
                }}>
                  <Code size={14} color={theme.colors.stevensonGold} style={{ marginRight: 6 }} />
                  <Text style={{ color: theme.colors.stevensonGold, fontWeight: '600', fontSize: 13 }}>Open Source</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.isDark ? 'rgba(64, 156, 255, 0.15)' : 'rgba(0, 85, 255, 0.08)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 100
                }}>
                  <Github size={14} color={theme.isDark ? '#409CFF' : '#0055FF'} style={{ marginRight: 6 }} />
                  <Text style={{ color: theme.isDark ? '#409CFF' : '#0055FF', fontWeight: '600', fontSize: 13 }}>Student Developed</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://github.com/ShankarK2009/Stevenson-Space-App')}
                activeOpacity={0.7}
                style={{
                  backgroundColor: theme.colors.background,
                  borderWidth: 1,
                  borderColor: theme.colors.cardBorder,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Github size={20} color={theme.colors.text} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>View on GitHub</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Contribute or view source code</Text>
                  </View>
                </View>
                <ExternalLink size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </ScrollView>

            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>
                Made with ❤️ by the Stevenson App Team
              </Text>
            </View>
          </View>
        </View>
      </Modal >
    </View >
  );
}
