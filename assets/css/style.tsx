import { StyleSheet, Platform } from "react-native";

const globalStyle = StyleSheet.create({
  formControl: {
    marginHorizontal: 0,
    marginVertical: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 0.5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 0.25,
    paddingVertical: 0.15,
  },
  textarea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 0.25,
    paddingVertical: 0.15,
  },
  InputFocus: {
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    backgroundColor: "#ebebeb",
    borderColor: "#510077",
    borderWidth: 1,
  },
  textareaFocus: {
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    backgroundColor: "#ebebeb",
    borderColor: "#510077",
    borderWidth: 1,
  },
  formControlInvalidLabel: {
    color: "#ff0000",
  },
  formControlInvalidP: {
    color: "#ff0000",
  },

  formControlInvalidInput: {
    borderColor: "#ff0000",
    backgroundColor: "#ffd1d1",
  },
  formControlInvalidTextarea: {
    borderColor: "#ff0000",
    backgroundColor: "#ffd1d1",
  },
  navLink: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  navLinkli: {
    margin: 1,
  },

  navLinka: {
    borderColor: "transparent",
    color: "#292929",
    textDecorationLine: "none",
    padding: 0.5,
  },

  navLinkAHover: {
    backgroundColor: "#ffb131",
    borderColor: "transparent",
    color: "#292929",
  },
  navLinkAActive: {
    backgroundColor: "#ffb131",
    borderColor: "transparent",
    color: "#292929",
  },

  navLinkbutton: {
    cursor: "pointer",
    borderColor: "#a68753",
    borderWidth: 1,
    backgroundColor: "transparent",
    color: "#ffb131",
    padding: 0.5,
  },

  navLinkbuttonFocus: {
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    flex: 1,
  },

  navLinkbuttonHover: {
    backgroundColor: "#ffb131",
    color: "#ffffff",
  },
  navLinkbuttonActive: {
    backgroundColor: "#ffb131",
  },
  center: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  placeForm: {
    position: "relative",
    marginHorizontal: "auto",
    marginVertical: 0,
    padding: 1,
    width: "90%",
    // maxWidth: 40,
    maxWidth: "100%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
  height25: {
    height: 25,
  },
  authenticationLabel: {
    marginTop: 30,
    fontSize: 16,
  },
  authenticationInput: {
    height: 40,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginTop: 8,
    fontSize: 14,
    fontWeight: 300,
  },
  authenticationGeneral: {
    color: "#ffffff",
    letterSpacing: 0.5,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  authenticationFormControlInvalidInput: {
    backgroundColor: "rgba(255, 0, 0, 0.50)",
  },
  authenticationFormControlValidInput: {
    backgroundColor: "rgba(255, 255, 0, 0.50)",
  },
  authenticationFormControlnput: {
    // backgroundColor: "rgba(255, 255, 255, 0.07)",
    backgroundColor: "rgba(230, 218, 218, 0.50)",
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  authenticationFormControlInputFocus: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  authenticationFormControlInputIsWebkitAutofill: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  authenticationFormControlInputIsAutofill: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  tabContainer: {
    justifyContent: "center",
  },
  tabContainerButton: {
    minWidth: 160,
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
  },
  autoFlex: {
    flex: 1,
  },
  cross: {
    color: "#ff0000",
  },
  check: {
    color: "#00ff00",
  },
  defaultFont: {
    fontFamily: "Work Sans",
    fontWeight: 400,
    fontStyle: "normal",
  },
});

export default globalStyle;
