import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Utensils } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function LunchCard({ lunchDay, todaysLunch }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Utensils size={20} color={theme.colors.stevensonGold} />
                <Text style={styles.title}>Today's Lunch</Text>
            </View>
            <Text style={styles.dayText}>Day {lunchDay}</Text>
            <Text style={styles.menuText}>{todaysLunch}</Text>
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.colors.text,
        marginLeft: 8,
    },
    dayText: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    menuText: {
        fontSize: 17,
        fontWeight: "400",
        color: theme.colors.text,
        lineHeight: 24,
    },
});
