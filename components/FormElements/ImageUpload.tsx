import React, { useRef, useState, useEffect, memo } from "react";

import { StyleSheet, View, Image, Text, Alert, Platform } from "react-native";

import globalStyle from "@/assets/css/style";
import ButtonComp from "./Button";

import * as DocumentPicker from "expo-document-picker";

const ImageUpload: any = memo((props: any) => {
  const [previewUrl, setPreviewUrl] = useState<any>();
  const [isValid, setIsValid] = useState<any>(false);
  const [doc, setDoc] = useState<any>();

  useEffect(() => {
    if (props && props.data) {
      setPreviewUrl(
        "http://localhost:5000/" + props.data + `?${new Date().getTime()}`
        // "http://api.infoportal.co.in/" + props.data + `?${new Date().getTime()}`
      );
      props.onInput(props.id, props.data, true);
    }
  }, []);

  const pickDocHandler: any = async () => {
    // let fileIsValid = isValid;
    let fileIsValid;
    fileIsValid = false;
    setIsValid(false);
    setDoc(null);
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
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        let fileUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        setIsValid(true);
        setDoc(doc);
        setPreviewUrl(fileUpload.uri);
        fileIsValid = true;
        props.onInput(props.id, doc, fileIsValid);
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
        setDoc(null);
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
            <Image style={styles.img} src={previewUrl} alt="Preview" />
          </View>
        )}
        <ButtonComp onClick={pickDocHandler} title="Pick File"></ButtonComp>
      </View>
      {!isValid && props.data == null && <Text>{props.errorText}</Text>}
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
    objectFit: "cover",
  },
});
