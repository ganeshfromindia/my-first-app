import React from "react";

import { Text } from "react-native";
import { StyleSheet } from "react-native";

const MainHeader = (props: any) => {
  return <Text className="main-header">{props.children}</Text>;
};

export default MainHeader;

const styles = StyleSheet.create({
  mainHeader: {
    width: "100%",
    height: 4,
    alignItems: "center",
    position: "relative",
    top: 0,
    left: 0,
    backgroundColor: "#0079c1",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.26)",
    paddingHorizontal: 1,
    zIndex: 5,
  },
});
