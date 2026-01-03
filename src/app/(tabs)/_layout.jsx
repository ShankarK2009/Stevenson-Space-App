import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <NativeTabs
            minimizeBehavior="onScrollDown"
            iconColor={{
                default: theme.colors.textSecondary,
                selected: theme.colors.stevensonGold
            }}
            labelStyle={{
                default: { color: theme.colors.textSecondary },
                selected: { color: theme.colors.stevensonGold }
            }}
            blurEffect={theme.isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"}
        >
            <NativeTabs.Trigger name="today">
                <Label>Today</Label>
                <Icon sf="house.fill" drawable="ic_home" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="events">
                <Label>Events</Label>
                <Icon sf="calendar" drawable="ic_calendar" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="resources">
                <Label>Resources</Label>
                <Icon sf="book.fill" drawable="ic_book" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="settings">
                <Label>Settings</Label>
                <Icon sf="gear" drawable="ic_settings" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
