import { Tabs } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.stevensonGold,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.cardBackground,
                    borderTopColor: theme.colors.border,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="today"
                options={{
                    title: "Today",
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                    tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="resources"
                options={{
                    title: "Resources",
                    tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
