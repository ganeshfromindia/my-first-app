import React from "react";
import ReactNativeModal from "react-native-modal";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
// Platform.OS === "ios"
//   ? Dimensions.get("window").height
//   : require("react-native-extra-dimensions-android").get(
//       "REAL_WINDOW_HEIGHT"
//     );

const ModalOverlay = (props: any) => {
  const content = (
    <View style={styles.modalContainer}>
      <View style={[styles.modalHeader, props.headerClass]}>
        <Text style={styles.modalHeaderh2}>{props.header}</Text>
      </View>

      <View style={[styles.modalContent, props.contentClass]}>
        <Text>{props.children}</Text>
      </View>
      <View style={[styles.modalFooter, props.footerClass]}>
        <Text>{props.footer}</Text>
      </View>
    </View>
  );
  return (
    <ReactNativeModal
      isVisible={props.show}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={() => props.onCancel}
    >
      {content}
    </ReactNativeModal>
  );
};

const Modal = (props: any) => {
  return (
    <React.Fragment>
      <ModalOverlay {...props} />
    </React.Fragment>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalHeader: {
    width: "100%",
    paddingHorizontal: 0.5,
    paddingVertical: 1,
    backgroundColor: "#0079c1",
    color: "#ffffff",
  },
  modalHeaderh2: {
    margin: 0.5,
  },

  modalContent: {
    paddingHorizontal: 0.5,
    paddingVertical: 1,
  },

  modalFooter: {
    paddingHorizontal: 2.5,
    paddingVertical: 1,
  },

  modalContainer: {
    height: "80%",
    overflow: "scroll",
  },
});
