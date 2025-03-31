import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";

function WelcomeScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>

      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/success.png")}
        />
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageContainer: {
    color: Colors.primary800,
    height: 300,
    width: 300,
    borderRadius: 150,
    borderWidth: 3,
    overflow: "hidden",
    margin: 36,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
