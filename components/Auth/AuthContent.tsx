import { useState } from "react";
import { Alert, StyleSheet, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
function AuthContent() {
  return (
    <>
      <ImageBackground
        source={require("../../assets/images/bkg.jpeg")}
        resizeMode="cover"
        style={styles.imgContainer}
        imageStyle={styles.backgroundImage}
      >
        <View>
          <AuthForm></AuthForm>
        </View>
      </ImageBackground>
    </>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ff00ff",
    elevation: 2,
    // shadowColor: "black",
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4,
    boxShadow: "1px 1px,4px rgba(0, 0, 0, 0.35)",
  },
  buttons: {
    marginTop: 8,
  },
  imgContainer: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    opacity: 1,
  },
});
