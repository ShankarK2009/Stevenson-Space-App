import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, Linking, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Info, X, Github, ExternalLink, Code } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.card}>
          {/* Class Start Notification */}
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingContent}>
              <Bell size={22} color={theme.colors.stevensonGold} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Class Start</Text>
                <Text style={styles.settingDescription}>Get notified when class begins</Text>
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
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Bell size={22} color={theme.colors.stevensonGold} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Period End</Text>
                <Text style={styles.settingDescription}>Get notified 5 mins before end</Text>
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

        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setAboutVisible(true)}
            style={styles.aboutButton}
          >
            <Info size={22} color={theme.colors.stevensonGold} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>About</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SHS</Text>
          </View>
          <Text style={styles.appName}>Stevenson Space</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={aboutVisible}
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setAboutVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About</Text>
              <TouchableOpacity onPress={() => setAboutVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalHighlight}>Stevenson Space</Text> is an open-source initiative designed to improve the student experience at Stevenson High School.
              </Text>

              <Text style={styles.modalBodyText}>
                Built by students, for students, this app aims to provide a modern, centralized platform for accessing school resources, schedules, and events.
              </Text>

              <View style={styles.badgeContainer}>
                <View style={[styles.badge, styles.badgeGold]}>
                  <Code size={14} color={theme.colors.stevensonGold} style={styles.badgeIcon} />
                  <Text style={styles.badgeTextGold}>Open Source</Text>
                </View>
                <View style={[styles.badge, styles.badgeBlue]}>
                  <Github size={14} color={theme.isDark ? '#409CFF' : '#0055FF'} style={styles.badgeIcon} />
                  <Text style={[styles.badgeTextBlue, { color: theme.isDark ? '#409CFF' : '#0055FF' }]}>Student Developed</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://github.com/ShankarK2009/Stevenson-Space-App')}
                activeOpacity={0.7}
                style={styles.githubButton}
              >
                <View style={styles.githubButtonContent}>
                  <Github size={20} color={theme.colors.text} />
                  <View style={styles.githubButtonText}>
                    <Text style={styles.githubButtonTitle}>View on GitHub</Text>
                    <Text style={styles.githubButtonSubtitle}>Contribute or view source code</Text>
                  </View>
                </View>
                <ExternalLink size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>Made with ❤️ by the Stevenson App Team</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
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
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: "400",
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: theme.colors.textSecondary,
  },
  aboutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.isDark ? "rgba(212, 175, 55, 0.2)" : "rgba(0, 105, 62, 0.1)",
    borderWidth: 2,
    borderColor: theme.colors.stevensonGold,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "600",
    color: theme.colors.stevensonGold,
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 15,
    fontWeight: "400",
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "85%",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalBodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 16,
  },
  modalHighlight: {
    fontWeight: "700",
    color: theme.colors.stevensonGold,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeGold: {
    backgroundColor: theme.isDark ? "rgba(212, 175, 55, 0.15)" : "rgba(0, 105, 62, 0.08)",
  },
  badgeBlue: {
    backgroundColor: theme.isDark ? "rgba(64, 156, 255, 0.15)" : "rgba(0, 85, 255, 0.08)",
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeTextGold: {
    color: theme.colors.stevensonGold,
    fontWeight: "600",
    fontSize: 13,
  },
  badgeTextBlue: {
    fontWeight: "600",
    fontSize: 13,
  },
  githubButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  githubButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  githubButtonText: {
    marginLeft: 12,
  },
  githubButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  githubButtonSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  modalFooter: {
    marginTop: 24,
    alignItems: "center",
  },
  modalFooterText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
});

