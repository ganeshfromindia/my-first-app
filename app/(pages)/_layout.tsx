import { PaperProvider } from "react-native-paper";
import { Stack, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

import AuthContext from "../../store/auth-context";

import useAuth from "@/hooks/auth-hook";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="authScreen" />
      {/* <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false, title: "" }}
          /> */}
      {/* <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "" }}
          /> */}
      {/* <Stack.Screen
            name="(traders)"
            options={{ headerShown: false, title: "" }}
          /> */}
    </Stack>
  );
}
