import "../../global.css";
import { useAuth } from "@/utils/auth/useAuth";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { ThemeProvider } from "../contexts/ThemeContext";
import { posthog } from "../config/posthog";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef(undefined);

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Notification Setup
  useEffect(() => {
    async function setupNotifications() {
      // 1. Request permissions
      const { registerForPushNotificationsAsync, scheduleClassNotifications } = await import("../utils/notificationUtils");
      await registerForPushNotificationsAsync();

      // 2. Schedule notifications (refreshes schedule for today/tomorrow)
      await scheduleClassNotifications();
    }

    setupNotifications();
  }, []);

  // Manual screen tracking for Expo Router
  // @see https://docs.expo.dev/router/reference/screen-tracking/
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false, // Manual tracking with Expo Router
          captureTouches: true,
          propsToCapture: ["testID"],
          maxElementsCaptured: 20,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}
