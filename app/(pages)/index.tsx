import { startTransition, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import { Colors } from "../../constants/styles";
import AuthContext from "../../store/auth-context";

// const Stack = createNativeStackNavigator();

import { Redirect, Stack, Tabs, useRouter } from "expo-router";
import useAuth from "@/hooks/auth-hook";

function AuthStack() {
  return <Redirect href="/authScreen" />;
}

function AuthenticatedStack() {
  return <Redirect href="/welcomeScreen" />;
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return !authCtx.isLoggedIn ? <AuthStack /> : <AuthenticatedStack />;
}

function Root(): any {
  SplashScreen.preventAutoHideAsync();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = authCtx.token;

      if (storedToken) {
        authCtx.isLoggedIn = true;
      }
    }

    fetchToken();
  }, []);

  if (authCtx.isLoggedIn) {
    return startTransition(() => {
      SplashScreen.hideAsync();
    });
  }

  return <Navigation />;
}

export default function PagesLayout() {
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
      <Root />
    </AuthContext.Provider>
  );
}

/*
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";

export default function PagesTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="authScreen" options={{ headerShown: false }} />
      <Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
    </Stack>
    
  );
}
const styles = StyleSheet.create({
  textH: {
    color: "#ff0000",
  },
});
*/
