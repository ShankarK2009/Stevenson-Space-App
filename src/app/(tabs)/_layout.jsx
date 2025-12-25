import { Tabs } from "expo-router";
import { Home, Calendar, BookOpen, Settings } from "lucide-react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: "transparent",
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={80}
                        tint={Platform.OS === "ios" ? "systemChromeMaterial" : theme.isDark ? "dark" : "light"}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: "hidden",
                            // Remove manual background color to let the native blur shine through (liquid glass effect)
                        }}
                    />
                ),
                tabBarActiveTintColor: theme.colors.stevensonGold,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
            <Tabs.Screen
                name="today"
                options={{
                    title: "Today",
                    tabBarIcon: ({ color }) => (
                        <Home color={color} size={26} strokeWidth={2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                    tabBarIcon: ({ color }) => (
                        <Calendar color={color} size={26} strokeWidth={2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="resources"
                options={{
                    title: "Resources",
                    tabBarIcon: ({ color }) => (
                        <BookOpen color={color} size={26} strokeWidth={2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Settings color={color} size={26} strokeWidth={2} />
                    ),
                }}
            />
        </Tabs>
    );
}
