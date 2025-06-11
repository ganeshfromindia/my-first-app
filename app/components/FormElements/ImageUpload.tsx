import React, { useRef, useState, useEffect, memo } from "react";

import { StyleSheet, View, Image, Text, Alert, Platform } from "react-native";

import globalStyle from "@/assets/css/style";
import ButtonComp from "./Button";

import * as DocumentPicker from "expo-document-picker";

import * as mime from "react-native-mime-types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import IconButton from "@/app/components/ui/IconButton";
import Modal from "../UIElements/Modal";
import Pdf from "react-native-pdf";

const ImageUpload: any = memo((props: any) => {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [source, setSource] = useState({});
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.light.tint },
    "text"
  );
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
        if (size > 5 * 1024 * 1024) {
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

  const loadDoc = (doc: any) => {
    const source = {
      uri: doc,
      cache: true,
    };
    setSource(source);
    let fileNameArray = doc.split("/");
    let fileName = fileNameArray[fileNameArray.length - 1];
    if (fileName.includes("pdf")) {
      setDocType("pdf");
    } else {
      setDocType("image");
    }
    let documentCat = fileName.split(".")[0];
    setDocCategory(docCategory);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <View style={globalStyle.formControl}>
        <View style={props.center && styles.center}>
          {/* {!isValid && props.data == null && (
          <Text style={globalStyle.defaultFont}>{props.errorText}</Text>
        )} */}
          <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flexGrow: 1,
                  alignItems: "center",
                }}
              >
                {previewUrl ? (
                  <IconButton
                    icon="search-outline"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) => loadDoc(previewUrl)}
                  />
                ) : (
                  // <View style={styles.imageUpload__preview}>
                  //   <Image
                  //     style={styles.img}
                  //     source={{
                  //       uri: `${previewUrl}`,
                  //     }}
                  //     alt="Preview"
                  //   />
                  // </View>

                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexGrow: 1,
                  alignItems: "center",
                }}
              >
                <IconButton
                  icon="cloud-upload"
                  size={20}
                  color={colorIcon}
                  onPress={($event: any) => pickDocHandler()}
                />
              </View>
            </View>
          </View>
          {/* <ButtonComp
          mode={true}
          normal={true}
          buttonfont={true}
          maxwidth={true}
          onClick={pickDocHandler}
          title="Pick File"
        ></ButtonComp> */}
        </View>
      </View>
      <Modal
        show={open}
        onCancel={handleClose}
        header={docCategory}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <ButtonComp
            onClick={handleClose}
            normal={true}
            buttonfont={true}
            maxwidth={true}
            title="CLOSE"
          ></ButtonComp>
        }
      >
        <View>
          {docType == "pdf" && (
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
            />
          )}
          {docType == "image" && (
            <Image
              style={styles.img}
              source={{
                uri: `${previewUrl}`,
              }}
              alt="Preview"
            />
          )}
        </View>
      </Modal>
    </React.Fragment>
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
