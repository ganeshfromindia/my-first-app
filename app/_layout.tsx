import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { AuthContext } from "@/store/auth-context";
import useAuth from "@/hooks/auth-hook";
import { useContext, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
  //  AsyncStorage.removeItem("userData");
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
  SplashScreen.setOptions({
    duration: 4000,
    fade: true,
  });
  const auth = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Monteserrat: require("../assets/fonts/Monteserrat/static/Montserrat-Medium.ttf"),
  });

  if (error) {
    return <Text>Error loading fonts</Text>;
  }

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }
  if (loaded) {
    SplashScreen.hideAsync();
  }

  if (!loaded && !error) {
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
              name="(pages)"
              options={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, title: "" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PaperProvider>
      </AuthContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
