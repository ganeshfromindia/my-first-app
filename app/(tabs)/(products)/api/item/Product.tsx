import React, { useCallback, useContext, useEffect, useState } from "react";
import { MultiSelect } from "react-native-element-dropdown";

import Input from "../../../../components/FormElements/Input";
import ButtonComp from "../../../../components/FormElements/Button";
import ErrorModal from "../../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../../components/UIElements/LoadingSpinner";
import ImageUpload from "../../../../components/FormElements/ImageUpload";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import { AuthContext } from "@/store/auth-context";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import globalStyle from "@/assets/css/style";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import * as Sharing from "expo-sharing";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import IconButton from "@/app/components/ui/IconButton";

const Product = ({
  productdata,
  handleClose,
}: {
  productdata: any;
  handleClose: any;
}) => {
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.light.tint },
    "text"
  );
  const FileExts = [
    "jpg",
    "png",
    "gif",
    "heic",
    "webp",
    "bmp",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "pdf",
    "jpeg",
  ];
  const { StorageAccessFramework } = FileSystem;
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");
  const [downloadProgress, setDownloadProgress] = useState<any>();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [pharmacopoeiaData, setPharmacopoeiaData] = useState<string[]>([]);
  const [dmfData, setDMFData] = useState<string[]>([]);
  const [pageData, setPageData] = useState<any>();

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text
          style={[
            styles.selectedTextStyle,
            globalStyle.defaultFont,
            { color: "#000000" },
          ]}
        >
          {item.label}
        </Text>
        <AntDesign
          style={styles.icon}
          color={Colors.light.tint}
          name="Safety"
          size={20}
        />
      </View>
    );
  };

  useEffect(() => {
    if (productdata) {
      if (productdata.dmf.length > 0) {
        let jsonParsedDMF = JSON.parse(productdata.dmf);
        let dmfValue = jsonParsedDMF.map((data: any) => data.value);
        setDMFData(dmfValue);
      }

      if (productdata.pharmacopoeias.length > 0) {
        let jsonParsedpharmacopoeias = JSON.parse(productdata.pharmacopoeias);
        let pharmacopoeiasValue = jsonParsedpharmacopoeias.map(
          (data: any) => data.value
        );
        setPharmacopoeiaData(pharmacopoeiasValue);
      }
      setPageData(productdata);
    }
  }, [productdata]);

  const optionsPharamacopoeia = [
    { value: "IP", label: "Indian Pharmacopoeia" },
    { value: "BP", label: "British Pharmacopoeia" },
    { value: "USP", label: "US Pharmacopoeia" },
    { value: "JP", label: "Japanese Pharmacopoeia" },
    { value: "EP", label: "European Pharmacopoeia" },
    { value: "InHouse", label: "In House" },
  ];

  const optionsDMF = [
    { value: "USDMF", label: "US DMF" },
    { value: "BRAZILDMF", label: "Brazilian DMF" },
    { value: "KOREADMF", label: "Korean DMF" },
    { value: "EUDMF", label: "European DMF" },
    { value: "RUSSIANDMF", label: "Russian DMF" },
    { value: "NA", label: "Not Available" },
  ];

  const renameProduct = (product: any) => {
    return product
      .toLowerCase()
      .split(" ")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim();
  };

  const productSubmitHandler = async (event: any) => {
    event.preventDefault();
    setPageData(null);
    try {
      const formData = new FormData();
      formData.append(
        "folder",
        "Manufacturers/" +
          auth.userName +
          "/Products/" +
          renameProduct(formState.inputs.title.value)
      );
      let derivedDMF = optionsDMF.filter((data: any) =>
        dmfData.includes(data.value)
      );
      let derivedPharmacopoeias = optionsPharamacopoeia.filter((data: any) =>
        pharmacopoeiaData.includes(data.value)
      );

      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("coa", formState.inputs.coa.value);
      formData.append("msds", formState.inputs.msds.value);
      formData.append("cep", formState.inputs.cep.value);
      formData.append("qos", formState.inputs.qos.value);
      formData.append("dmf", JSON.stringify(derivedDMF));
      formData.append("impurities", formState.inputs.impurities.value);
      formData.append("refStandards", formState.inputs.refStandards.value);
      formData.append("pharmacopoeias", JSON.stringify(derivedPharmacopoeias));

      if (productdata && productdata.id) {
        const responseData = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/products/${productdata.id}`,
          "PATCH",
          formData,
          {
            Authorization: "Bearer " + auth.token,
            Accept: "application/json",
          }
        );
        setPageData((prev: any) => responseData.product);
      } else {
        formData.append("category", "api");
        const responseData = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/products/create`,
          "POST",
          formData,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setPageData(responseData.product);
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadButtonClick = async (data: any, e: any) => {
    let fileNameArray = data.split("/");
    let fileName = fileNameArray[fileNameArray.length - 1];
    if (Platform.OS == "android") {
      const dir = ensureDirAsync(downloadPath);
    }

    //alert(fileName)
    const downloadResumable: any = FileSystem.createDownloadResumable(
      `${process.env.EXPO_PUBLIC_API_URL}/${data}`,
      downloadPath + fileName,
      {},
      downloadCallback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      if (Platform.OS == "android") saveAndroidFile(uri, fileName);
      else saveIosFile(uri);
    } catch (e) {
      console.error("download error:", e);
    }
  };

  const saveAndroidFile = async (fileUri: any, fileName = "File") => {
    let savedName = fileName;
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        let type = mime.lookup(fileName) || "";
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          type
        )
          .then(async (uri) => {
            const bracketPart = extractTextBetweenBrackets(uri);
            let splitedName = savedName.split(".");
            bracketPart
              ? (savedName =
                  splitedName[0] + "(" + bracketPart + ")" + splitedName[1])
              : savedName;
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            alert("File Downloaded Successfully as " + savedName);
          })
          .catch((e) => {});
      } catch (e: any) {
        throw new Error(e);
      }
    } catch (err) {}
  };

  const extractTextBetweenBrackets = (str: any) => {
    const matches = str.match(/\(([^)]+)\)/);
    if (matches) {
      return matches[1];
    }
    return null;
  };

  const saveIosFile = async (fileUri: any) => {
    if (FileExts.every((x) => !fileUri.endsWith(x))) {
      const UTI = "public.item";
      const shareResult = await Sharing.shareAsync(fileUri, { UTI });
    }
    // your ios code
    // i use expo share module to save ios file
  };

  const downloadCallback = (downloadProgress: any) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  const ensureDirAsync = async (dir: any, intermediates = true) => {
    const props = await FileSystem.getInfoAsync(dir);
    if (props.exists && props.isDirectory) {
      return props;
    }
    let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
    return await ensureDirAsync(dir, intermediates);
  };

  const saveFile = async (fileUri: string) => {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
  };

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: true,
      },
      coa: {
        value: null,
        isValid: true,
      },
      msds: {
        value: null,
        isValid: true,
      },
      cep: {
        value: null,
        isValid: true,
      },
      qos: {
        value: null,
        isValid: true,
      },
      dmf: {
        value: null,
        isValid: true,
      },
      impurities: {
        value: null,
        isValid: true,
      },
      refStandards: {
        value: null,
        isValid: true,
      },
      pharmacopoeias: {
        value: null,
        isValid: true,
      },
    },
    null
  );

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && pageData && (
        <View
          style={[
            globalStyle.formControl,
            globalStyle.placeForm,
            styles.searchTrader,
          ]}
        >
          <View style={styles.containerdd}>
            {isLoading && <LoadingSpinner asOverlay />}
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={pageData && pageData.title}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (at least 5 characters)."
              onInput={inputHandler}
              initialValue={pageData && pageData.description}
            />
            <Input
              id="price"
              element="input"
              label="Price"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_REQUIRE()]}
              errorText="Please enter a price."
              onInput={inputHandler}
              initialValue={pageData && pageData.price}
            />
            <Text>Product Image</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ flexGrow: 2 }}>
                <ImageUpload
                  id="image"
                  onInput={inputHandler}
                  // errorText="Please provide an product image."
                  data={(pageData && pageData.image) || null}
                />
              </View>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {pageData && pageData.image ? (
                  <IconButton
                    icon="cloud-download"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) =>
                      handleDownloadButtonClick(pageData.image, $event)
                    }
                  />
                ) : (
                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text>COA</Text>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={{ flexGrow: 2 }}>
                <ImageUpload
                  id="coa"
                  onInput={inputHandler}
                  // errorText="Please provide sample COA."
                  data={(pageData && pageData.coa) || null}
                />
              </View>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {pageData && pageData.coa ? (
                  <IconButton
                    icon="cloud-download"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) =>
                      handleDownloadButtonClick(pageData.coa, $event)
                    }
                  />
                ) : (
                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text>MSDS</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ flexGrow: 2 }}>
                <ImageUpload
                  id="msds"
                  onInput={inputHandler}
                  // errorText="Please provide an MSDS."
                  data={(pageData && pageData.msds) || null}
                />
              </View>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {pageData && pageData.msds ? (
                  <IconButton
                    icon="cloud-download"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) =>
                      handleDownloadButtonClick(pageData.msds, $event)
                    }
                  />
                ) : (
                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text>Certificate of Suitability</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ flexGrow: 2 }}>
                <ImageUpload
                  id="cep"
                  onInput={inputHandler}
                  // errorText="Please provide a Certificate of Suitability."
                  data={(pageData && pageData.cep) || null}
                />
              </View>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {pageData && pageData.cep ? (
                  <IconButton
                    icon="cloud-download"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) =>
                      handleDownloadButtonClick(pageData.cep, $event)
                    }
                  />
                ) : (
                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text>Quality Overall Summary</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ flexGrow: 2 }}>
                <ImageUpload
                  id="qos"
                  onInput={inputHandler}
                  // errorText="Please provide an Quality Overall Summary."
                  data={(pageData && pageData.qos) || null}
                />
              </View>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {pageData && pageData.qos ? (
                  <IconButton
                    icon="cloud-download"
                    size={20}
                    color={colorIcon}
                    onPress={($event: any) =>
                      handleDownloadButtonClick(pageData.qos, $event)
                    }
                  />
                ) : (
                  <View style={globalStyle.iconWrapper}>
                    <Text>{"     "}</Text>
                  </View>
                )}
              </View>
            </View>
            <Input
              id="impurities"
              element="textarea"
              label="Impurities"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter Impurities separated by comma."
              onInput={inputHandler}
              initialValue={pageData && pageData.impurities}
            />
            <Input
              id="refStandards"
              element="textarea"
              label="Reference Standards"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter Reference Standards separated by comma."
              onInput={inputHandler}
              initialValue={pageData && pageData.refStandards}
            />
            <MultiSelect
              mode="modal"
              style={[styles.dropdown, { marginTop: 25 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              activeColor="#f3e3cc"
              search
              data={optionsDMF}
              labelField="label"
              valueField="value"
              placeholder="Select DMF"
              value={dmfData}
              searchPlaceholder="Search..."
              onChange={(item) => {
                setDMFData(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={Colors.light.tint}
                  name="Safety"
                  size={20}
                />
              )}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text
                      style={[
                        styles.textSelectedStyle,
                        globalStyle.defaultFont,
                        { color: "#000000" },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <AntDesign
                      color={Colors.light.tint}
                      name="delete"
                      size={17}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />

            <MultiSelect
              mode="modal"
              style={[styles.dropdown, { marginTop: 25 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              activeColor="#f3e3cc"
              search
              data={optionsPharamacopoeia}
              labelField="label"
              valueField="value"
              placeholder="Select Pharamacopoeia"
              value={pharmacopoeiaData}
              searchPlaceholder="Search..."
              onChange={(item) => {
                setPharmacopoeiaData(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={Colors.light.tint}
                  name="Safety"
                  size={20}
                />
              )}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text
                      style={[
                        styles.textSelectedStyle,
                        globalStyle.defaultFont,
                        { color: "#000000" },
                      ]}
                    >
                      {item.value}
                    </Text>
                    <AntDesign
                      color={Colors.light.tint}
                      name="delete"
                      size={17}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />

            <View className="height25"></View>
            <View style={{ width: 100, margin: "auto" }}>
              <ButtonComp
                onClick={productSubmitHandler}
                normal={true}
                buttonfont={true}
                maxwidth={true}
                disabled={!formState.isValid}
                title="SAVE"
              ></ButtonComp>
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default Product;

const styles = StyleSheet.create({
  containerdd: {
    padding: 16,
  },
  containerMultiSelect: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
    /*
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    */
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: Colors.light.tint,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
    /*
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    */
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  searchTrader: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  SearchTraderDiv: {
    flexGrow: 5,
  },
  fieldset: {
    padding: 0,
    margin: 0,
  },
  dropdownContainer: {
    width: "100%",
    justifyContent: "flex-start",
  },
});
