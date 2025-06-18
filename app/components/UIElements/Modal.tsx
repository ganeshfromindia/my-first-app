import React from "react";
import ReactNativeModal from "react-native-modal";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import globalStyle from "@/assets/css/style";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
// Platform.OS === "ios"
//   ? Dimensions.get("window").height
//   : require("react-native-extra-dimensions-android").get(
//       "REAL_WINDOW_HEIGHT"
//     );

const ModalOverlay = (props: any) => {
  const datatable = useThemeColor(
    { light: "#ffffff", dark: "#121212" },
    "background"
  );
  const noDatatable = useThemeColor(
    { light: "#ffffff", dark: "#ffffff" },
    "background"
  );
  let content;
  if (props.show) {
    content = (
      <View
        style={[
          styles.modalContainer,
          props.datatable && { backgroundColor: datatable },
          !props.datatable && { backgroundColor: noDatatable },
        ]}
      >
        <View style={[styles.modalHeader]}>
          <Text style={[globalStyle.defaultFont, styles.modalHeaderh2]}>
            {props.header}
          </Text>
        </View>

        <View style={[styles.modalContent]}>
          <View>{props.children}</View>
        </View>
        <View style={[styles.modalFooter]}>
          <View style={{ flex: 1 }}>{props.footer}</View>
        </View>
      </View>
    );
  }

  return (
    <ReactNativeModal
      isVisible={props.show}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={props.onCancel}
      propagateSwipe={true}
    >
      <View>
        <SafeAreaView style={{ flex: 0 }}>
          <ScrollView
            contentContainerStyle={{
              height: "auto",
              justifyContent: "space-between",
              alignItems: "stretch",
              flexGrow: 1,
            }}
          >
            {content}
          </ScrollView>
        </SafeAreaView>
      </View>
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
    padding: 12,
  },

  modalContent: {
    paddingVertical: 12,
    paddingHorizontal: 3,
  },

  modalFooter: {
    padding: 12,
  },

  modalContainer: {
    height: "100%",
    overflow: "scroll",
  },
  test: {
    backgroundColor: "#ff0000",
  },
});
