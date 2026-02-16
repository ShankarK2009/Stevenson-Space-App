import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

function ScheduleList({ periodInfo, handleModePress }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (!periodInfo?.isSchoolDay || !periodInfo?.allPeriods) return null;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Today's Schedule</Text>

                {/* Schedule Mode Toggle */}
                {periodInfo.schedule?.allModes?.length > 1 && (
                    <TouchableOpacity
                        onPress={handleModePress}
                        style={styles.modeToggle}
                        testID="schedule-mode-toggle"
                    >
                        <Text style={styles.modeText}>
                            {periodInfo.schedule.mode}
                        </Text>
                        <ChevronDown size={14} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {periodInfo.allPeriods.map((pd, index) => {
                const isCurrent = pd.period === periodInfo.currentPeriod;
                return (
                    <View
                        key={index}
                        style={[
                            styles.periodRow,
                            isCurrent && styles.currentPeriodRow,
                            index < periodInfo.allPeriods.length - 1 && !isCurrent && styles.periodBorder,
                        ]}
                    >
                        <Text
                            style={[
                                styles.periodName,
                                isCurrent && styles.currentPeriodName,
                            ]}
                        >
                            {pd.period}
                        </Text>
                        <Text
                            style={[
                                styles.periodTime,
                                isCurrent && styles.currentPeriodTime,
                            ]}
                        >
                            {pd.startTime.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {pd.endTime.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

export default React.memo(ScheduleList);

const createStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.colors.text,
    },
    modeToggle: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.inputBackground,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    modeText: {
        color: theme.colors.textSecondary,
        fontWeight: "500",
        fontSize: 13,
        marginRight: 4,
    },
    periodRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderRadius: 0,
        marginHorizontal: 0,
        borderWidth: 0,
        borderColor: "transparent",
    },
    currentPeriodRow: {
        paddingHorizontal: 12,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 12,
        marginHorizontal: -12,
        borderWidth: 1,
        borderColor: theme.colors.stevensonGold,
        shadowColor: theme.colors.stevensonGold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    periodBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    periodName: {
        fontSize: 17,
        fontWeight: "600",
        color: theme.colors.text,
    },
    currentPeriodName: {
        fontWeight: "700",
        color: theme.colors.stevensonGold,
    },
    periodTime: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.textSecondary,
    },
    currentPeriodTime: {
        fontWeight: "600",
        color: theme.colors.text,
    },
});
