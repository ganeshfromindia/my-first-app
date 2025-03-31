/*
import { Tabs } from "expo-router";
import React from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="authScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="welcomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

*/

import { Stack, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  //   return (
  //     <Tabs
  //       screenOptions={{
  //         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
  //         headerShown: false,
  //         tabBarButton: HapticTab,
  //         tabBarBackground: TabBarBackground,
  //         tabBarStyle: Platform.select({
  //           ios: {
  //             // Use a transparent background on iOS to show the blur effect
  //             position: "absolute",
  //           },
  //           default: {},
  //         }),
  //       }}
  //     >
  //       <Tabs.Screen
  //         name="index"
  //         options={{
  //           title: "Home",
  //           tabBarIcon: ({ color }) => (
  //             <IconSymbol size={28} name="house.fill" color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="authScreen"
  //         options={{
  //           title: "Home",
  //           tabBarIcon: ({ color }) => (
  //             <IconSymbol size={28} name="house.fill" color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="welcomeScreen"
  //         options={{
  //           title: "Home",
  //           tabBarIcon: ({ color }) => (
  //             <IconSymbol size={28} name="house.fill" color={color} />
  //           ),
  //         }}
  //       />
  //     </Tabs>
  //   );

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="authScreen" />
      <Stack.Screen name="welcomeScreen" />
    </Stack>
  );
}
