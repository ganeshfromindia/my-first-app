import React, { useEffect } from "react";

const image = require("../../../assets/images/loading.png");

import {
  Animated,
  StyleSheet,
  Text,
  View,
  useAnimatedValue,
} from "react-native";

const LoadingSpinner = (props: any) => {
  const rotateAnimation = useAnimatedValue(0);
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: false,
      })
    ).start();
  }, [rotateAnimation]);

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={styles.loadingSpinnerOverlay}>
        <Animated.Image
          style={{ transform: [{ rotate: spin }], width: 125, height: 125 }}
          source={image}
        />
      </View>
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  loadingSpinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});
