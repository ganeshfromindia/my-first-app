// import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  DarkTheme,
  DefaultTheme,
  NavigationIndependentTree,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/styles";
// import AppMain from "./(pages)/_layout";
import { Stack, Navigator } from "expo-router";

// const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(pages)"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
