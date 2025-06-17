import axios from "axios";
import React from "react";

import {
  StyleSheet,
  Button,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const ButtonComp = (props: any) => {
  const borderColor = useThemeColor(
    { light: "#ffb131", dark: "#000000" },
    "borderColor"
  );
  if (props.href) {
    return (
      <Link
        replace
        href={props.href}
        style={[
          styles.button,
          props.inverse && styles.buttonInverse,
          props.danger && styles.buttonDanger,
          props.normal && styles.buttonNormal,
          props.maxwidth && styles.maxWidthFitCont,
          props.buttonfont && styles.buttonFont,
        ]}
      >
        <ThemedText style={styles.buttonText}>{props.children}</ThemedText>
      </Link>
    );
  }
  if (props.to) {
    return (
      <Link
        replace
        href={props.to}
        style={[
          styles.button,
          props.inverse && styles.buttonInverse,
          props.danger && styles.buttonDanger,
          props.normal && styles.buttonNormal,
          props.maxwidth && styles.maxWidthFitCont,
          props.buttonfont && styles.buttonFont,
        ]}
      >
        <ThemedText style={styles.buttonText}> {props.children} </ThemedText>
      </Link>
    );
  }
  return (
    <View style={[styles.buttonHolder, !props.mode && { borderColor }]}>
      <ThemedView
        style={[
          styles.button,
          props.currentTab && styles.currentTab,
          props.inverse && styles.buttonInverse,
          props.danger && styles.buttonDanger,
          props.normal && styles.buttonNormal,
          props.maxwidth && styles.maxWidthFitCont,
          props && props.style,
          props.top && styles.buttonTop,
          props.disabled && styles.buttonDisabled,
        ]}
      >
        <TouchableOpacity onPress={props.onClick} disabled={props.disabled}>
          <ThemedText
            style={[styles.buttonText, props.submit && styles.submitButtonText]}
          >
            {props.title}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  buttonHolder: {
    position: "relative",
    borderRadius: 5,
    margin: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  buttonText: {
    cursor: "pointer",
    textDecorationLine: "none",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
  submitButtonText: {
    color: "#212121",
    cursor: "pointer",
    textDecorationLine: "none",
    fontSize: 15,
    textAlign: "center",
  },

  buttonFocus: {
    flex: 1,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },

  buttonHover: {
    backgroundColor: "#a68753",
    borderColor: "#a68753",
    borderWidth: 1,
  },
  buttonActive: {
    backgroundColor: "#a68753",
    borderColor: "#a68753",
    borderWidth: 1,
  },

  buttonInverse: {
    color: "#ffb131",
  },

  buttonInverseHover: {
    color: "#ffffff",
    backgroundColor: "#a68753",
  },
  buttonInverseActive: {
    color: "#ffffff",
    backgroundColor: "#a68753",
  },
  buttonDanger: {
    backgroundColor: "#830000",
    borderColor: "#830000",
    borderWidth: 1,
  },
  buttonDangerhover: {
    backgroundColor: "#f34343",
    borderColor: "#f34343",
    borderWidth: 1,
  },
  buttonDangerActive: {
    backgroundColor: "#f34343",
    borderColor: "#f34343",
    borderWidth: 1,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  buttonDisabledHover: {
    backgroundColor: "#cccccc",
    color: "#979797",
    borderColor: "#cccccc",
    cursor: "not-allowed",
  },
  buttonDisabledActive: {
    backgroundColor: "#cccccc",
    color: "#979797",
    borderColor: "#cccccc",
    cursor: "not-allowed",
  },

  buttonSmall: {
    fontSize: 0.8,
  },

  buttonBig: {
    fontSize: 1.5,
  },
  buttonTop: {
    backgroundColor: "#ffb131",
  },
  buttonNormal: {
    padding: 7,
    borderRadius: 3,
    width: 75,
    minWidth: "auto",
  },
  buttonFont: {
    fontSize: 13,
  },
  maxWidthFitCont: {
    maxWidth: "auto",
  },
  currentTab: {
    backgroundColor: "#a67017",
  },
});
