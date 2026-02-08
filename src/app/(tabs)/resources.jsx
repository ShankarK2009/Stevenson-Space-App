import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, ExternalLink } from "lucide-react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useTheme } from "../../contexts/ThemeContext";

import documentsData from "../../data/documents.json";

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState("links");

  const quickLinks = [
    {
      name: "Canvas",
      url: "https://d125.instructure.com/",
      image: require("../../../assets/logos/canvas.png")
    },
    { name: "IRC", url: "https://irc.d125.org/login", icon: "📊" },
    {
      name: "Infinite Campus",
      url: "https://infinitecampus.d125.org/campus/portal/aes.jsp",
      image: require("../../../assets/logos/campus.png"),
    },
    {
      name: "Naviance",
      url: "https://student.naviance.com/aeshs",
      image: require("../../../assets/logos/naviance.png")
    },
    { name: "SHS Maps", url: "https://shsmaps.com/", icon: "🗺️" },
    {
      name: "Peer Tutors",
      url: "https://sites.google.com/d125.org/peer-tutors/content-database",
      image: theme.isDark
        ? require("../../../assets/logos/peer_tutors_dark.png")
        : require("../../../assets/logos/peer_tutors_light.png"),
    },
    {
      name: "Patriot Dollars",
      url: "https://get.cbord.com/d125/full/login.php",
      image: require("../../../assets/logos/patriot_dollars.jpg"),
    },
  ];

  const handleLinkPress = async (url) => {
    if (!url || url === "#") {
      alert("This resource is coming soon!");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert(`Cannot open this URL: ${url}`);
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
      alert("An error occurred while trying to open the link.");
    }
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
          <Text style={styles.headerTitle}>Resources</Text>
        </View>

        {/* Native iOS Segmented Control */}
        <View style={styles.segmentContainer}>
          <SegmentedControl
            values={["Quick Links", "Documents"]}
            selectedIndex={selectedTab === "links" ? 0 : 1}
            onChange={(event) => {
              setSelectedTab(event.nativeEvent.selectedSegmentIndex === 0 ? "links" : "documents");
            }}
            fontStyle={{ color: theme.colors.text }}
            activeFontStyle={{ color: theme.colors.text }}
            style={styles.segmentControl}
            tintColor={theme.colors.cardBackground}
          />
        </View>

        {/* Quick Links Section */}
        {selectedTab === "links" && (
          <View>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleLinkPress(link.url)}
                activeOpacity={0.6}
                style={styles.linkCard}
              >
                <View style={styles.linkContent}>
                  {link.image ? (
                    <Image source={link.image} style={styles.linkImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.linkIcon}>{link.icon}</Text>
                  )}
                  <Text style={styles.linkName}>{link.name}</Text>
                </View>
                <ExternalLink size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Documents Section */}
        {selectedTab === "documents" && (
          <View>
            {Object.entries(documentsData).map(([className, items], sectionIndex) => (
              <View key={sectionIndex} style={styles.documentSection}>
                <Text style={styles.sectionTitle}>{className}</Text>

                {items.map((doc, docIndex) => (
                  <TouchableOpacity
                    key={docIndex}
                    onPress={() => handleLinkPress(doc.link)}
                    activeOpacity={0.6}
                    style={styles.documentCard}
                  >
                    <View style={styles.documentContent}>
                      <BookOpen size={18} color={theme.colors.textSecondary} />
                      <Text style={styles.documentTitle}>{doc.title}</Text>
                    </View>
                    <ExternalLink size={16} color={theme.colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: theme.colors.text,
  },
  segmentContainer: {
    marginBottom: 24,
  },
  segmentControl: {
    // Native look
  },
  linkCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  linkImage: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 8,
  },
  linkName: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
  },
  documentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.stevensonGold,
    marginBottom: 12,
  },
  documentCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  documentContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: theme.colors.text,
    marginLeft: 10,
  },
});

