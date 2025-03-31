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

const ButtonComp = (props: any) => {
  if (props.href) {
    return (
      <Link
        replace
        href={props.href}
        style={[
          styles.button,
          props.inverse && styles.buttonInverse,
          props.danger && styles.buttonDanger,
          props.normal && styles.buttonNormalButton,
          props.maxwidth && styles.maxWidthFitCont,
          props.buttonfont && styles.buttonFont,
        ]}
      >
        <Text style={styles.buttonText}>{props.children}</Text>
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
          props.normal && styles.buttonNormalButton,
          props.maxwidth && styles.maxWidthFitCont,
          props.buttonfont && styles.buttonFont,
        ]}
      >
        <Text style={styles.buttonText}> {props.children} </Text>
      </Link>
    );
  }
  return (
    <View style={[styles.buttonHolder, props.top && styles.top]}>
      <View
        style={[
          styles.button,
          props.inverse && styles.buttonInverse,
          props.danger && styles.buttonDanger,
          props.normal && styles.buttonNormalButton,
          props.maxwidth && styles.maxWidthFitCont,
          props && props.style,
          props.top && styles.buttonTop,
        ]}
      >
        <TouchableOpacity onPress={props.onClick} disabled={props.disabled}>
          <Text
            style={[styles.buttonText, props.submit && styles.submitButtonText]}
          >
            {props.title}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ffb131",
    borderRadius: 4,
    backgroundColor: "#ffb131",
    marginRight: 1,
  },
  buttonText: {
    color: "#ffffff",
    cursor: "pointer",
    textDecorationLine: "none",
    fontSize: 15,
  },
  submitButtonText: {
    color: "#212121ks",
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
    backgroundColor: "#cccccc",
    color: "#979797",
    borderColor: "#cccccc",
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
  top: {
    position: "absolute",
    top: "-5%",
    left: "30%",
    width: "auto",
  },
  buttonNormalButton: {
    backgroundColor: "#ffb131",
    color: "#ffffff",
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
});
