import React, { useRef, useState, useEffect, memo } from "react";

import { StyleSheet, View, Image, Text, Alert, Platform } from "react-native";

import globalStyle from "@/assets/css/style";
import ButtonComp from "./Button";

import * as DocumentPicker from "expo-document-picker";

import * as mime from "react-native-mime-types";

const ImageUpload: any = memo((props: any) => {
  const [previewUrl, setPreviewUrl] = useState<any>();
  const [isValid, setIsValid] = useState<any>(false);

  useEffect(() => {
    if (props && props.data) {
      setPreviewUrl(
        `${process.env.EXPO_PUBLIC_API_URL}/` +
          props.data +
          `?${new Date().getTime()}`
        // "http://api.infoportal.co.in/" + props.data + `?${new Date().getTime()}`
      );
      props.onInput(props.id, props.data, true, true);
    }
  }, []);

  const pickDocHandler: any = async () => {
    // let fileIsValid = isValid;
    let fileIsValid;
    fileIsValid = false;
    setIsValid(false);
    setPreviewUrl(null);

    let result = await DocumentPicker.getDocumentAsync({
      // type: "*/*", // all files
      type: ["image/*", "application/*"],
      // type: "image/*", // all images files
      // type: "audio/*" // all audio files
      // type: "application/*", // for pdf, doc and docx
      // type: "application/pdf" // .pdf
      // type: "application/msword" // .doc
      // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
      // type: "vnd.ms-excel" // .xls
      // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
      // type: "text/csv" // .csv
      copyToCacheDirectory: false,
    }).then((response: any) => {
      if (!response.cancelled) {
        let { name, size, uri } = response.assets[0];
        // if (Platform.OS === "android" && uri === "/") {
        //   uri = `file://${uri}`;
        //   uri = uri.replace(/%/g, "%25");
        // }
        if (size > 1 * 1024 * 1024) {
          fileIsValid = false;
          setIsValid(false);
          Alert.alert("File Too Large", "Max file size 5MB", [
            {
              text: "OK",
              onPress: () => {
                return;
              },
            },
          ]);
          return;
        }

        let fileUpload = {
          name: name,
          size: size,
          uri: uri,
          type: mime.lookup(name),
        };
        setIsValid(true);
        setPreviewUrl(fileUpload.uri);
        fileIsValid = true;
        props.onInput(props.id, fileUpload, fileIsValid, true);
      } else {
        Alert.alert("Something went wrong", "Please try again", [
          {
            text: "OK",
            onPress: () => {
              return false;
            },
          },
        ]);
        setIsValid(false);
        setPreviewUrl(null);
        fileIsValid = false;
      }
    });
  };

  return (
    <View style={globalStyle.formControl}>
      <View style={props.center && styles.center}>
        {previewUrl && (
          <View style={styles.imageUpload__preview}>
            <Image
              style={styles.img}
              source={{
                uri: `${previewUrl}`,
              }}
              alt="Preview"
            />
          </View>
        )}
        <ButtonComp
          mode={true}
          normal={true}
          buttonfont={true}
          maxwidth={true}
          onClick={pickDocHandler}
          title="Pick File"
        ></ButtonComp>
      </View>
      {!isValid && props.data == null && (
        <Text style={globalStyle.defaultFont}>{props.errorText}</Text>
      )}
    </View>
  );
});

export default ImageUpload;

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  imageUpload__preview: {
    borderColor: "#cccccc",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },

  img: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
});
