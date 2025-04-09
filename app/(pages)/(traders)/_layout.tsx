import { Stack, Tabs } from "expo-router";
import React from "react";

export default function StackTraderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen name="list/TradersList" />
      <Stack.Screen name="item/Trader" />
    </Stack>
  );
}
