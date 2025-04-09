import { PaperProvider } from "react-native-paper";
import { Stack, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

import AuthContext from "../../store/auth-context";

import useAuth from "@/hooks/auth-hook";

export default function TabLayout() {
  const {
    token,
    login,
    logout,
    userId,
    userName,
    email,
    mobileNo,
    role,
    image,
  } = useAuth();
  const colorScheme = useColorScheme();
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        email: email,
        mobileNo: mobileNo,
        login: login,
        logout: logout,
        role: role,
        image: image,
      }}
    >
      <PaperProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Screen name="authScreen" />
          <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Screen
            name="(products)"
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Screen
            name="(traders)"
            options={{ headerShown: false, title: "" }}
          />
        </Stack>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
