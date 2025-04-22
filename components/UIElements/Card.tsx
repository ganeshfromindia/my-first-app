import React from "react";

import { StyleSheet, View } from "react-native";

const Card = (props: any) => {
  return (
    <View
      style={[
        styles.card,
        props.cardProduct && styles.cardProduct,
        props.center && styles.center,
        props && props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardProduct: {
    backgroundColor: "transparent",
    paddingTop: 30,
  },
  card: {
    position: "relative",
    margin: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
    borderRadius: 6,
    padding: 1,
    overflow: "scroll",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
