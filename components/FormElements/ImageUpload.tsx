import React, { useRef, useState, useEffect, memo } from "react";

import { StyleSheet, View, Image, Text } from "react-native";

import globalStyle from "@/assets/css/style";
import ButtonComp from "./Button";

import * as DocumentPicker from "expo-document-picker";

const ImageUpload: any = memo((props: any) => {
  const [previewUrl, setPreviewUrl] = useState<any>();
  const [isValid, setIsValid] = useState<any>(false);
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
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // all files
      // type: "image/*" // all images files
      // type: "audio/*" // all audio files
      // type: "application/*" // for pdf, doc and docx
      // type: "application/pdf" // .pdf
      // type: "application/msword" // .doc
      // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
      // type: "vnd.ms-excel" // .xls
      // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
      // type: "text/csv" // .csv
      copyToCacheDirectory: false,
    });
    console.log(result && result.assets && result.assets[0].uri);
  };

  return (
    <View style={globalStyle.formControl}>
      <View style={props.center && styles.center}>
        <View style={styles.imageUpload__preview}>
          {previewUrl && (
            <Image style={styles.img} src={previewUrl} alt="Preview" />
          )}
        </View>
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
    width: 13,
    height: 13,
    borderColor: "#cccccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
