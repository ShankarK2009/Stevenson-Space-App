import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock, Calendar as CalendarIcon } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { formatTimeRemaining } from "../utils/scheduleUtils";

function CurrentPeriodCard({ periodInfo, nextSchoolDay }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (!periodInfo?.isSchoolDay) {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <CalendarIcon size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.headerText}>NO SCHOOL TODAY</Text>
                </View>
                <Text style={styles.mainText}>
                    {nextSchoolDay?.message || "Enjoy your day off!"}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            {periodInfo.currentPeriod ? (
                <>
                    <View style={styles.periodHeader}>
                        <Clock size={20} color={theme.colors.stevensonGold} />
                        <Text style={styles.periodHeaderText}>
                            {periodInfo.currentPeriod}
                        </Text>
                    </View>

                    {periodInfo.timeRemaining && (
                        <Text style={styles.timerText}>
                            {formatTimeRemaining(periodInfo.timeRemaining)}
                        </Text>
                    )}
                    <Text style={styles.subText}>remaining</Text>
                </>
            ) : periodInfo.nextPeriod ? (
                <>
                    <View style={styles.header}>
                        <Clock size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.headerText}>
                            {periodInfo.allPeriods && periodInfo.allPeriods[0].period === periodInfo.nextPeriod
                                ? "SCHOOL STARTS IN"
                                : "BETWEEN PERIODS"}
                        </Text>
                    </View>
                    <Text style={styles.mainTextSmall}>
                        {periodInfo.allPeriods && periodInfo.allPeriods[0].period === periodInfo.nextPeriod
                            ? "School Starts"
                            : `Next: ${periodInfo.nextPeriod}`}
                    </Text>
                    {periodInfo.timeUntilNext && (
                        <Text style={styles.secondaryTimerText}>
                            {formatTimeRemaining(periodInfo.timeUntilNext)}
                        </Text>
                    )}
                </>
            ) : (
                <>
                    <View style={styles.header}>
                        <Clock size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.headerText}>SCHOOL DAY ENDED</Text>
                    </View>
                    <Text style={styles.mainText}>
                        {nextSchoolDay?.message || "School day ended"}
                    </Text>
                </>
            )}
        </View>
    );
}

export default React.memo(CurrentPeriodCard);

const createStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    headerText: {
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
        color: theme.colors.textSecondary,
        marginLeft: 8,
    },
    periodHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    periodHeaderText: {
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.5,
        color: theme.colors.stevensonGold,
        marginLeft: 8,
        textTransform: "uppercase",
    },
    mainText: {
        fontSize: 28,
        fontWeight: "700",
        color: theme.colors.text,
    },
    mainTextSmall: {
        fontSize: 28,
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: 8,
    },
    timerText: {
        fontSize: 42,
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: 0,
    },
    subText: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    secondaryTimerText: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.colors.textSecondary,
    },
});
