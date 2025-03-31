import React, { useEffect } from "react";

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
    <View style={styles.loadingSpinnerOverlay}>
      <Animated.Image
        style={{ transform: [{ rotate: spin }] }}
        source={{ uri: "../../../../../../assets/images/loading.png" }}
      />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  loadingSpinnerOverlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});
