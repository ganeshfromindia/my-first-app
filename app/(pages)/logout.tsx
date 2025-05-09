import React, { useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import ButtonComp from "../components/FormElements/Button";
import { AuthContext } from "@/store/auth-context";

const LogoutButton = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      auth.login(null, null, null, null, null, null, null, true, new Date());
      router.replace("/authScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
      console.error(error);
    }
  };

  return (
    <ButtonComp
      title="Logout"
      onClick={() =>
        Alert.alert(
          "Confirm Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Logout",
              onPress: handleLogout,
            },
          ],
          { cancelable: false }
        )
      }
    />
  );
};

export default LogoutButton;
