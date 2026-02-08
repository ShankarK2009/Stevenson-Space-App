import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { Calendar, MapPin } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

// Memoized EventCard component to prevent re-renders
const EventCard = React.memo(function EventCard({ event, formatEventTime, styles, theme }) {
    return (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventTime}>{formatEventTime(event)}</Text>

            {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
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
                        <View key={catIndex} style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
});

function EventList({ monthEvents, formatEventTime }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    // Transform monthEvents into SectionList format
    const sections = useMemo(() =>
        monthEvents.map(dayEvents => ({
            title: dayEvents.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            }),
            data: dayEvents.events,
        })),
        [monthEvents]
    );

    const renderSectionHeader = useCallback(({ section }) => (
        <View style={styles.dateHeader}>
            <Calendar size={16} color={theme.colors.stevensonGold} />
            <Text style={styles.dateText}>{section.title}</Text>
        </View>
    ), [styles, theme.colors.stevensonGold]);

    const renderItem = useCallback(({ item }) => (
        <EventCard
            event={item}
            formatEventTime={formatEventTime}
            styles={styles}
            theme={theme}
        />
    ), [formatEventTime, styles, theme]);

    const keyExtractor = useCallback((item, index) =>
        `${item.name}-${item.startTime || index}`,
        []
    );

    if (monthEvents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Calendar size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Events This Month</Text>
                <Text style={styles.emptySubtitle}>Check back later or browse other months</Text>
            </View>
        );
    }

    return (
        <SectionList
            sections={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
        />
    );
}

export default React.memo(EventList);

const createStyles = (theme) => StyleSheet.create({
    dayContainer: {
        marginBottom: 20,
    },
    dateHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    dateText: {
        fontSize: 17,
        fontWeight: "600",
        color: theme.colors.stevensonGold,
        marginLeft: 8,
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
    categoryTag: {
        backgroundColor: theme.isDark ? "rgba(212, 175, 55, 0.2)" : "rgba(0, 105, 62, 0.1)",
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
    emptyContainer: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: 16,
        padding: 40,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: theme.colors.text,
        marginTop: 16,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 15,
        fontWeight: "400",
        color: theme.colors.textSecondary,
        marginTop: 8,
        textAlign: "center",
    },
});

