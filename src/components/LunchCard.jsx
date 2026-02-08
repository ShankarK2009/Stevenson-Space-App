import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Utensils } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

function LunchCard({ todaysLunch }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Utensils size={20} color={theme.colors.stevensonGold} />
                <Text style={styles.title}>Today's Lunch</Text>
            </View>
            <Text style={styles.menuText}>{todaysLunch}</Text>
        </View>
    );
}

export default React.memo(LunchCard);

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
    menuText: {
        fontSize: 17,
        fontWeight: "400",
        color: theme.colors.text,
        lineHeight: 24,
    },
});
