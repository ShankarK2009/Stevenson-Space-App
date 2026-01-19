import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dumbbell } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getPWCStatus } from "../utils/pwcUtils";

export default function PWCCard({ date = new Date() }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { isOpen, hours, isSpecial } = getPWCStatus(date);

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    <Dumbbell size={20} color={theme.colors.stevensonGold} />
                    <Text style={styles.title}>PATRIOT WELLNESS CENTER</Text>
                </View>
                {isSpecial && isOpen && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>SPECIAL HOURS</Text>
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <Text style={[
                    styles.hoursText,
                    !isOpen && styles.closedText
                ]}>
                    {hours}
                </Text>
                <Text style={styles.subtext}>
                    {isOpen ? "Open today" : "Closed today"}
                </Text>
            </View>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: theme.colors.stevensonGold,
        letterSpacing: 0.5,
    },
    badge: {
        backgroundColor: theme.colors.stevensonGold,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: theme.isDark ? "#000" : "#FFF",
    },
    contentContainer: {
        marginTop: 4,
    },
    hoursText: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: 4,
    },
    closedText: {
        color: theme.colors.textSecondary,
    },
    subtext: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.colors.textSecondary,
    },
});
