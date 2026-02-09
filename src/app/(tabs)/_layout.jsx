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
            <NativeTabs.Trigger name="today" disableTransparentOnScrollEdge>
                <Label>Today</Label>
                <Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="events" disableTransparentOnScrollEdge>
                <Label>Events</Label>
                <Icon sf="calendar" md="calendar_month" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="resources" disableTransparentOnScrollEdge>
                <Label>Resources</Label>
                <Icon sf="book.fill" md="menu_book" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="settings" disableTransparentOnScrollEdge>
                <Label>Settings</Label>
                <Icon sf="gear" md="settings" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
