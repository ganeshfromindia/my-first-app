import { AuthContext } from "@/store/auth-context";
import { Stack, Tabs } from "expo-router";
import React, { useContext } from "react";

export default function TabLayout() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />

      <Stack.Screen name="logout" options={{ headerShown: false, title: "" }} />

      <Stack.Screen
        name="categories"
        options={{
          headerShown: false,
          title: "Categories",
        }}
      />

      <Stack.Screen
        name="authScreen"
        options={{ headerShown: true, title: "Login", headerLeft: () => null }}
      />
    </Stack>
  );
}
