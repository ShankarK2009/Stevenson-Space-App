import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function EventCalendar({
    selectedDate,
    calendarSelectedDate,
    changeMonth,
    calendarDays,
    handleDatePress,
    hasEventsOnDate,
    selectedDayEvents,
    formatEventTime,
}) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            {/* Month Selector */}
            <View style={styles.monthSelector}>
                <TouchableOpacity
                    onPress={() => changeMonth(-1)}
                    style={styles.chevronButton}
                >
                    <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2.5} />
                </TouchableOpacity>

                <View style={styles.monthTitleContainer}>
                    <Text style={styles.monthTitle}>
                        {selectedDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => changeMonth(1)}
                    style={styles.chevronButton}
                >
                    <ChevronRight size={24} color={theme.colors.text} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
                {/* Day Headers */}
                <View style={styles.dayHeadersRow}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <View key={index} style={styles.dayHeader}>
                            <Text style={styles.dayHeaderText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar Days */}
                <View style={styles.calendarDaysContainer}>
                    {calendarDays.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleDatePress(day)}
                            disabled={!day}
                            activeOpacity={0.6}
                            style={styles.calendarDayButton}
                        >
                            {day && (
                                <View style={styles.dayContent}>
                                    <View
                                        style={[
                                            styles.dayCircle,
                                            calendarSelectedDate === day && styles.dayCircleSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                calendarSelectedDate === day && styles.dayTextSelected,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                    {hasEventsOnDate(day) && (
                                        <View
                                            style={[
                                                styles.eventDot,
                                                calendarSelectedDate === day && styles.eventDotSelected,
                                            ]}
                                        />
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Selected Date Events */}
            {calendarSelectedDate ? (
                <View>
                    <Text style={styles.selectedDateTitle}>
                        {new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            calendarSelectedDate,
                        ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>

                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map((event, index) => (
                            <View key={index} style={styles.eventCard}>
                                <Text style={styles.eventTitle}>{event.name}</Text>

                                <Text style={styles.eventTime}>
                                    {formatEventTime(event)}
                                </Text>

                                {event.description && (
                                    <Text style={styles.eventDescription}>
                                        {event.description}
                                    </Text>
                                )}

                                {event.location && (
                                    <View style={styles.locationContainer}>
                                        <MapPin size={14} color={theme.colors.textSecondary} />
                                        <Text style={styles.locationText}>{event.location}</Text>
                                    </View>
                                )}

                                {event.categories && event.categories.length > 0 && (
                                    <View style={styles.categoriesContainer}>
                                        {event.categories.map((category, catIndex) => (
                                            <View
                                                key={catIndex}
                                                style={styles.categoryBadge}
                                            >
                                                <Text style={styles.categoryText}>{category}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <Calendar size={32} color={theme.colors.textSecondary} />
                            <Text style={styles.emptyStateText}>No events on this day</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.emptyStateContainer}>
                    <Calendar size={32} color={theme.colors.textSecondary} />
                    <Text style={styles.emptyStateText}>Select a date to view events</Text>
                </View>
            )}
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    monthSelector: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chevronButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.inputBackground,
        justifyContent: "center",
        alignItems: "center",
    },
    monthTitleContainer: {
        alignItems: "center",
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.colors.text,
    },
    calendarGrid: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    dayHeadersRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    dayHeader: {
        flex: 1,
        alignItems: "center",
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.textSecondary,
    },
    calendarDaysContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    calendarDayButton: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    dayContent: {
        alignItems: "center",
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Fixes square highlight on Android
    },
    dayCircleSelected: {
        backgroundColor: theme.colors.stevensonGold,
    },
    dayText: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.text,
    },
    dayTextSelected: {
        fontWeight: "600",
        color: "#000",
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.stevensonGold,
        marginTop: 2,
    },
    eventDotSelected: {
        backgroundColor: "#000",
    },
    selectedDateTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: theme.colors.stevensonGold,
        marginBottom: 12,
    },
    eventCard: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: 8,
    },
    eventTime: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    eventDescription: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.text,
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    locationText: {
        fontSize: 13,
        fontWeight: "400",
        color: theme.colors.textSecondary,
        marginLeft: 6,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 12,
    },
    categoryBadge: {
        backgroundColor: theme.isDark
            ? "rgba(212, 175, 55, 0.2)"
            : "rgba(0, 105, 62, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        marginTop: 4,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.stevensonGold,
    },
    emptyStateContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.colors.textSecondary,
        marginTop: 12,
        textAlign: "center",
    },
});
