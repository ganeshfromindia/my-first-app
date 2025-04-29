import { StyleSheet, View, ImageBackground } from "react-native";

import AuthForm from "./AuthForm";
function AuthContent() {
  return (
    <>
      <ImageBackground
        source={require("../../../assets/images/bkg.jpeg")}
        resizeMode="cover"
        style={styles.imgContainer}
        imageStyle={styles.backgroundImage}
      >
        <AuthForm></AuthForm>
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
