import React from "react";
import { View, Text } from "react-native";
import { Calendar, MapPin } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function EventList({ monthEvents, formatEventTime }) {
    const theme = useTheme();

    return (
        <View>
            {monthEvents.length > 0 ? (
                monthEvents.map((dayEvents, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                        {/* Date Header */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 12,
                            }}
                        >
                            <Calendar size={16} color={theme.colors.stevensonGold} />
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: "600",
                                    color: theme.colors.stevensonGold,
                                    marginLeft: 8,
                                }}
                            >
                                {dayEvents.date.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </Text>
                        </View>

                        {/* Event Cards */}
                        {dayEvents.events.map((event, eventIndex) => (
                            <View
                                key={eventIndex}
                                style={{
                                    backgroundColor: theme.colors.cardBackground,
                                    borderRadius: 16,
                                    padding: 20,
                                    marginBottom: 12,
                                    borderWidth: 1,
                                    borderColor: theme.colors.cardBorder,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600",
                                        color: theme.colors.text,
                                        marginBottom: 8,
                                    }}
                                >
                                    {event.name}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "400",
                                        color: theme.colors.textSecondary,
                                        marginBottom: 8,
                                    }}
                                >
                                    {formatEventTime(event)}
                                </Text>

                                {event.description && (
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: "400",
                                            color: theme.colors.text,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {event.description}
                                    </Text>
                                )}

                                {event.location && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 4,
                                        }}
                                    >
                                        <MapPin
                                            size={14}
                                            color={theme.colors.textSecondary}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: "400",
                                                color: theme.colors.textSecondary,
                                                marginLeft: 6,
                                            }}
                                        >
                                            {event.location}
                                        </Text>
                                    </View>
                                )}

                                {event.categories && event.categories.length > 0 && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            marginTop: 12,
                                        }}
                                    >
                                        {event.categories.map((category, catIndex) => (
                                            <View
                                                key={catIndex}
                                                style={{
                                                    backgroundColor: theme.isDark
                                                        ? "rgba(212, 175, 55, 0.2)"
                                                        : "rgba(0, 105, 62, 0.1)",
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 8,
                                                    marginRight: 8,
                                                    marginTop: 4,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: "600",
                                                        color: theme.colors.stevensonGold,
                                                    }}
                                                >
                                                    {category}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                ))
            ) : (
                <View
                    style={{
                        backgroundColor: theme.colors.cardBackground,
                        borderRadius: 16,
                        padding: 40,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: theme.colors.cardBorder,
                    }}
                >
                    <Calendar size={48} color={theme.colors.textSecondary} />
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "600",
                            color: theme.colors.text,
                            marginTop: 16,
                            textAlign: "center",
                        }}
                    >
                        No Events This Month
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "400",
                            color: theme.colors.textSecondary,
                            marginTop: 8,
                            textAlign: "center",
                        }}
                    >
                        Check back later or browse other months
                    </Text>
                </View>
            )}
        </View>
    );
}
