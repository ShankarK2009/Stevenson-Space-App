import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    Platform,
} from "react-native";
import { Calendar, Star, X, ChevronRight } from "lucide-react-native";
import * as Linking from "expo-linking";
import { useTheme } from "../contexts/ThemeContext";
import calendarFeeds from "../data/calendarFeeds.json";

export default function CalendarSubscriptions({ visible, onClose }) {
    const theme = useTheme();

    // Sort: recommended first, then alphabetically
    const sortedFeeds = [...calendarFeeds].sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.name.localeCompare(b.name);
    });

    const handleSubscribe = (feed) => {
        const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feed.googleUrl)}`;

        const buttons = [];

        if (Platform.OS === "ios") {
            buttons.push({
                text: "Subscribe",
                onPress: async () => {
                    try {
                        await Linking.openURL(feed.webcalUrl);
                    } catch (error) {
                        Alert.alert("Error", "Could not open calendar app");
                    }
                },
            });
        } else {
            buttons.push({
                text: "Add to Google Calendar",
                onPress: async () => {
                    try {
                        await Linking.openURL(googleCalendarUrl);
                    } catch (error) {
                        Alert.alert("Error", "Could not open Google Calendar");
                    }
                },
            });
        }

        buttons.push({ text: "Cancel", style: "cancel" });

        Alert.alert(
            feed.name,
            Platform.OS === "ios" ? "Add this calendar to your device?" : "Add to Google Calendar?",
            buttons
        );
    };

    const styles = createStyles(theme);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <X size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Subscribe to Calendars</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Calendar size={20} color={theme.colors.stevensonGold} />
                        <Text style={styles.infoText}>
                            Subscribe to D125 calendars to see events in your preferred calendar app.
                        </Text>
                    </View>

                    {/* Recommended Section */}
                    <Text style={styles.sectionTitle}>Recommended</Text>
                    <View style={styles.cardContainer}>
                        {sortedFeeds
                            .filter((feed) => feed.recommended)
                            .map((feed, index, arr) => (
                                <TouchableOpacity
                                    key={feed.id}
                                    onPress={() => handleSubscribe(feed)}
                                    activeOpacity={0.6}
                                    style={[
                                        styles.feedRow,
                                        index < arr.length - 1 && styles.feedRowBorder,
                                    ]}
                                >
                                    <View style={styles.feedRowContent}>
                                        <Star
                                            size={18}
                                            color={theme.colors.stevensonGold}
                                            fill={theme.colors.stevensonGold}
                                        />
                                        <Text style={styles.feedName}>{feed.name}</Text>
                                    </View>
                                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                    </View>

                    {/* Other Calendars Section */}
                    <Text style={styles.sectionTitle}>Other Calendars</Text>
                    <View style={styles.cardContainer}>
                        {sortedFeeds
                            .filter((feed) => !feed.recommended)
                            .map((feed, index, arr) => (
                                <TouchableOpacity
                                    key={feed.id}
                                    onPress={() => handleSubscribe(feed)}
                                    activeOpacity={0.6}
                                    style={[
                                        styles.feedRow,
                                        index < arr.length - 1 && styles.feedRowBorder,
                                    ]}
                                >
                                    <View style={styles.feedRowContent}>
                                        <Calendar size={18} color={theme.colors.textSecondary} />
                                        <Text style={styles.feedName}>{feed.name}</Text>
                                    </View>
                                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const createStyles = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: theme.colors.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.isDark
            ? "rgba(212, 175, 55, 0.15)"
            : "rgba(0, 105, 62, 0.08)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "400",
        color: theme.colors.text,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    cardContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        marginBottom: 24,
        overflow: "hidden",
    },
    feedRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    feedRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    feedRowContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    feedName: {
        fontSize: 16,
        fontWeight: "400",
        color: theme.colors.text,
    },
});
