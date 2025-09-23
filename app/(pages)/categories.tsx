import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DataTable, Modal as Nmodal } from "react-native-paper";

import useHttpClient from "@/hooks/http-hook";
import { AuthContext } from "@/store/auth-context";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import globalStyle from "@/assets/css/style";
import { ThemedText } from "../components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { Link, Stack, useNavigation } from "expo-router";

const Index = () => {
  const navigation = useNavigation();
  const hardwareBackPressCustom = useCallback(() => {
    BackHandler.exitApp();
    return true;
  }, []);
  useFocusEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", hardwareBackPressCustom);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        hardwareBackPressCustom
      );
    };
  });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
      <View style={styles.mainContainer}>
        {auth.role == "Manufacturer" && (
          <Link
            href={{
              pathname:
                "/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen",
              params: { category: "api" },
            }}
            style={styles.link}
          >
            <ThemedText type="link" style={{ textAlign: "center" }}>
              APIs
            </ThemedText>
          </Link>
        )}
        {auth.role == "Trader" && (
          <Link
            href={{
              pathname: "/(tabs)/(dashboard)/trader/dashboardTraderScreen",
              params: { category: "api" },
            }}
            style={styles.link}
          >
            <ThemedText type="link" style={{ textAlign: "center" }}>
              APIs
            </ThemedText>
          </Link>
        )}
        {auth.role == "Manufacturer" && (
          <Link
            href={{
              pathname:
                "/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen",
              params: { category: "pigments" },
            }}
            style={styles.link}
          >
            <ThemedText type="link" style={{ textAlign: "center" }}>
              Pigments
            </ThemedText>
          </Link>
        )}
        {auth.role == "Trader" && (
          <Link
            href={{
              pathname: "/(tabs)/(dashboard)/trader/dashboardTraderScreen",
              params: { category: "pigments" },
            }}
            style={styles.link}
          >
            <ThemedText type="link" style={{ textAlign: "center" }}>
              Pigments
            </ThemedText>
          </Link>
        )}
      </View>
    </React.Fragment>
  );
};

export default Index;

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
});
