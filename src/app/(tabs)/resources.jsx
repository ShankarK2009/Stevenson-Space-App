import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, ExternalLink } from "lucide-react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useTheme } from "../../contexts/ThemeContext";

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState("links");

  const quickLinks = [
    { name: "Canvas", url: "https://d125.instructure.com/", icon: "📚" },
    { name: "IRC", url: "https://irc.d125.org/login", icon: "📊" },
    {
      name: "Infinite Campus",
      url: "https://infinitecampus.d125.org/campus/portal/aes.jsp",
      icon: "📋",
    },
    { name: "Naviance", url: "https://student.naviance.com/aeshs", icon: "🎓" },
    { name: "SHS Maps", url: "https://shsmaps.com/", icon: "🗺️" },
    {
      name: "Peer Tutors",
      url: "https://sites.google.com/d125.org/peer-tutors/content-database",
      icon: "👥",
    },
    {
      name: "Patriot Dollars",
      url: "https://get.cbord.com/d125/full/login.php",
      icon: "💵",
    },
  ];

  const documents = [
    {
      class: "Mathematics",
      items: [
        { name: "Calculus Textbook", url: "#" },
        { name: "Algebra Reference Guide", url: "#" },
      ],
    },
    {
      class: "English",
      items: [
        { name: "Literature Anthology", url: "#" },
        { name: "Grammar Handbook", url: "#" },
      ],
    },
    {
      class: "Science",
      items: [
        { name: "Biology Textbook", url: "#" },
        { name: "Chemistry Lab Manual", url: "#" },
      ],
    },
    {
      class: "History",
      items: [
        { name: "US History Textbook", url: "#" },
        { name: "World History Reader", url: "#" },
      ],
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
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "700",
              color: theme.colors.text,
            }}
          >
            Resources
          </Text>
        </View>

        {/* Native iOS Segmented Control */}
        <View style={{ marginBottom: 24 }}>
          <SegmentedControl
            values={["Quick Links", "Documents"]}
            selectedIndex={selectedTab === "links" ? 0 : 1}
            onChange={(event) => {
              setSelectedTab(event.nativeEvent.selectedSegmentIndex === 0 ? "links" : "documents");
            }}
            fontStyle={{
              color: theme.colors.text
            }}
            activeFontStyle={{
              color: theme.colors.text
            }}
            style={{
              backgroundColor: theme.colors.inputBackground,
            }}
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
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.cardBorder,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 28, marginRight: 12 }}>
                    {link.icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "600",
                      color: theme.colors.text,
                    }}
                  >
                    {link.name}
                  </Text>
                </View>
                <ExternalLink size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Documents Section */}
        {selectedTab === "documents" && (
          <View>
            {documents.map((section, sectionIndex) => (
              <View key={sectionIndex} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: theme.colors.stevensonGold,
                    marginBottom: 12,
                  }}
                >
                  {section.class}
                </Text>

                {section.items.map((doc, docIndex) => (
                  <TouchableOpacity
                    key={docIndex}
                    onPress={() => handleLinkPress(doc.url)}
                    activeOpacity={0.6}
                    style={{
                      backgroundColor: theme.colors.cardBackground,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.cardBorder,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <BookOpen size={18} color={theme.colors.textSecondary} />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: theme.colors.text,
                          marginLeft: 10,
                        }}
                      >
                        {doc.name}
                      </Text>
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
