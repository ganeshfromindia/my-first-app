import React, { useState, useCallback, useContext, useEffect } from "react";
import globalStyle from "@/assets/css/style";
import IconButton from "../../../../components/ui/IconButton";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import * as Sharing from "expo-sharing";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DataTable } from "react-native-paper";
import Card from "../../../../components/UIElements/Card";
import ButtonComp from "../../../../components/FormElements/Button";
import Modal from "../../../../components/UIElements/Modal";
import Product from "../item/Product";
import useHttpClient from "@/hooks/http-hook";
import { AuthContext } from "@/store/auth-context";
import ErrorModal from "../../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../../components/UIElements/LoadingSpinner";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../../../components/ThemedText";
import { useFocusEffect } from "@react-navigation/native";

const ProductsList = () => {
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
  const color = useThemeColor({ light: "#000000", dark: "#ffffff" }, "text");
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "text"
  );
  let dmfHTML: any;
  const [numberOfItemsPerPageListP] = useState([10, 20, 40]);
  const [itemsPerPageP, onItemsPerPageChangeP] = useState(
    numberOfItemsPerPageListP[0]
  );
  let primaryProductData = {
    title: "",
    description: "",
    price: "",
    image: "",
    coa: "",
    msds: "",
    cep: "",
    qos: "",
    impurities: "",
    refStandards: "",
    dmf: [],
    pharmacopoeias: [],
    id: "",
    manufacturer: "",
    traders: [],
  };
  const auth = useContext(AuthContext);
  const [downloadProgress, setDownloadProgress] = useState<any>();
  const [currentPageP, setCurrentPageP] = useState(0);
  const [perPageP, setPerPageP] = useState(10);
  const [totalRowsP, setTotalRowsP] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [productData, setProductData] = useState<any>();
  const [allowAddProduct, setAllowAddProduct] = useState(false);
  const [allowViewProduct, setAllowViewProduct] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const expandTabHandler = (index: number) => {
    setCurrentIndex(index);
  };

  const fetchManufacturerDashboardData = useCallback(async () => {
    if (auth.token && auth.userId) {
      try {
        const response = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/manufacturers/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (
          (response.manufacturer && response.manufacturer[0].aadhaar) ||
          response.manufacturer[0].aadhaar != null
        ) {
          setAllowAddProduct(true);
        } else {
          setAllowAddProduct(false);
        }
      } catch (err) {}
    }
  }, [auth.token, auth.userId, sendRequest]);

  const fetchTraderDashboardData = useCallback(async () => {
    if (auth.token && auth.userId) {
      try {
        const response = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/traderDashboardData/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (
          response.trader &&
          (response.trader[0].aadhaar || response.trader[0].aadhaar != null)
        ) {
          setAllowViewProduct(true);
        } else {
          setAllowViewProduct(false);
        }
      } catch (err) {}
    }
  }, [auth.token, auth.userId, sendRequest]);

  const fetchProducts = useCallback(
    async (page: number) => {
      if (auth.userId && auth.role) {
        let url;
        if (auth.role === "Manufacturer") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/manufacturer/id?uid=${auth.userId}&category=pigments&page=${page}&size=${perPageP}&delay=1`;
        } else if (auth.role === "Trader") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/trader/id?uid=${auth.userId}&category=pigments&page=${page}&size=${perPageP}&delay=1`;
        }
        try {
          const response = await sendRequest(url, "GET", null, {
            Authorization: "Bearer " + auth.token,
          });
          setLoadedProducts(response.products);
          setTotalRowsP(response.total);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPageP, sendRequest, auth]
  );

  const handleDeleteButtonClick = (data: any) => {
    Alert.alert(
      "Delete Product",
      "Please confirm deletion",
      [
        { text: "OK", onPress: () => deleteProduct(data) },
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
      ],
      { cancelable: false }
    );
  };

  const deleteProduct = useCallback(
    async (data: any) => {
      let id = data.id;
      if (auth) {
        try {
          if (id) {
            await sendRequest(
              `${process.env.EXPO_PUBLIC_API_URL}/api/products/${id}`,
              "DELETE",
              null,
              {
                Authorization: "Bearer " + auth.token,
              }
            );
            fetchProducts(1);
          }
        } catch (err) {}
      }
    },
    [sendRequest, auth, fetchProducts]
  );

  const handleEditButtonClick = (data: any) => {
    setOpen(true);
    setProductData(data);
  };

  const handleOpen = (product: any, e: any) => {
    e.preventDefault();
    setProductData(product);
    setOpen(true);
  };

  const handleClose = () => {
    setProductData(null);
    setOpen(false);
  };

  useEffect(() => {
    fetchProducts(1);
  }, [auth]);

  useEffect(() => {
    if (!open) {
      fetchProducts(1);
    }
  }, [open, fetchProducts]);

  useFocusEffect(
    useCallback(() => {
      // Fetch data or perform initialization logic when the screen is focused
      if (auth.userId && auth.role == "Manufacturer") {
        fetchManufacturerDashboardData();
      } else if (auth.userId && auth.role == "Trader") {
        fetchTraderDashboardData();
      }
      handlePerRowsChangeP(itemsPerPageP);
    }, [])
  );

  const handlePerRowsChangeP = async (newPerPageP: number) => {
    setPerPageP(newPerPageP);
    setCurrentPageP(0);
    onItemsPerPageChangeP(newPerPageP);
  };

  useEffect(() => {
    fetchProducts(1);
  }, [perPageP]);

  const handlePageChangeP = (page: number) => {
    setCurrentPageP(page);
    fetchProducts(page + 1);
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

  if (!allowAddProduct && auth.role === "Manufacturer") {
    return (
      <React.Fragment>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {isLoading && <LoadingSpinner asOverlay />}
        <View style={globalStyle.center}>
          <Card style={styles.cardProduct}>
            <ThemedText>
              Please fill the Manufacturer's details in dashboard. So as to add
              products
            </ThemedText>
          </Card>
        </View>
      </React.Fragment>
    );
  }

  if (loadedProducts?.length === 0 && auth.role === "Manufacturer") {
    return (
      <React.Fragment>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {isLoading && <LoadingSpinner asOverlay />}
        <View style={globalStyle.center}>
          <Card style={styles.cardProduct}>
            <ThemedText>No products found</ThemedText>
            <ButtonComp
              type="button"
              onClick={($event: any) => handleOpen(primaryProductData, $event)}
              normal={true}
              buttonfont={true}
              maxwidth={true}
              title="Add Product"
            ></ButtonComp>
            <Modal
              show={open}
              onCancel={handleClose}
              header="Add Product"
              contentClass="place-item__modal-content"
              footerClass="place-item__modal-actions abc"
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
                <Product
                  productdata={productData}
                  handleClose={handleClose}
                ></Product>
              </View>
            </Modal>
          </Card>
        </View>
      </React.Fragment>
    );
  }
  if (!allowViewProduct && auth.role == "Trader") {
    return (
      <React.Fragment>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {isLoading && <LoadingSpinner asOverlay />}
        <View style={globalStyle.center}>
          <Card style={styles.cardProduct}>
            <ThemedText>
              Please fill the Trader's details in dashboard. So as to view
              products
            </ThemedText>
          </Card>
        </View>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && auth.role === "Manufacturer" && (
        <Card style={[styles.cardProduct, globalStyle.center]}>
          <ButtonComp
            onClick={($event: any) => handleOpen(primaryProductData, $event)}
            normal={true}
            buttonfont={true}
            maxwidth={true}
            title="Add Product"
          ></ButtonComp>
        </Card>
      )}
      {loadedProducts && !isLoading && (
        <>
          <View style={{ flex: 1 }}>
            <DataTable style={{ flex: 1 }}>
              <ScrollView
                horizontal
                nestedScrollEnabled={true}
                contentContainerStyle={{
                  flexDirection: "column",
                }}
              >
                <DataTable.Header>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    SN
                  </DataTable.Title>

                  {auth && auth.role == "Manufacturer" && (
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Monteserrat",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 50 }}
                    >
                      Edit
                    </DataTable.Title>
                  )}
                  {auth && auth.role == "Manufacturer" && (
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Monteserrat",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 50 }}
                    >
                      Delete
                    </DataTable.Title>
                  )}
                  {auth && auth.role == "Trader" && (
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Monteserrat",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 200 }}
                    >
                      Manufacturer
                    </DataTable.Title>
                  )}
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 100 }}
                  >
                    Product
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 120 }}
                  >
                    Description
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60 }}
                  >
                    Price
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    COA
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    MSDS
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    CEP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    QOS
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 120 }}
                  >
                    DMF
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    IP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    BP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    EP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    JP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 30 }}
                  >
                    USP
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Monteserrat",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 60 }}
                  >
                    In House
                  </DataTable.Title>
                </DataTable.Header>
                <ScrollView
                  nestedScrollEnabled={true}
                  contentContainerStyle={{
                    flexDirection: "column",
                  }}
                >
                  {loadedProducts &&
                    loadedProducts.map((data: any, index: number) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 30 }}
                        >
                          {data.serialNo}
                        </DataTable.Cell>
                        {auth && auth.role == "Manufacturer" && (
                          <DataTable.Cell
                            textStyle={{
                              fontFamily: "Monteserrat",
                              fontWeight: 400,
                              fontStyle: "normal",
                            }}
                            style={{ width: 50 }}
                          >
                            <IconButton
                              icon="pencil"
                              size={20}
                              color={colorIcon}
                              onPress={() => handleEditButtonClick(data)}
                            />
                          </DataTable.Cell>
                        )}
                        {auth && auth.role == "Manufacturer" && (
                          <DataTable.Cell style={{ width: 50 }}>
                            <IconButton
                              icon="trash-bin"
                              size={20}
                              color={colorIcon}
                              onPress={() => handleDeleteButtonClick(data)}
                            />
                          </DataTable.Cell>
                        )}
                        {auth && auth.role == "Trader" && (
                          <DataTable.Cell
                            textStyle={{
                              fontFamily: "Monteserrat",
                              fontWeight: 400,
                              fontStyle: "normal",
                            }}
                            style={{ width: 200 }}
                          >
                            {data.manufacturer.title}
                          </DataTable.Cell>
                        )}
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 100 }}
                        >
                          {data.title}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 120 }}
                        >
                          {data.description}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 60 }}
                        >
                          {data.price}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{
                            width: 60,
                            justifyContent: "center",
                          }}
                        >
                          {data.coa ? (
                            <IconButton
                              icon="cloud-download"
                              size={20}
                              color={colorIcon}
                              onPress={($event: any) =>
                                handleDownloadButtonClick(data.coa, $event)
                              }
                            />
                          ) : (
                            "NA"
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{
                            width: 60,
                            justifyContent: "center",
                          }}
                        >
                          {data.msds ? (
                            <IconButton
                              icon="cloud-download"
                              size={20}
                              color={colorIcon}
                              onPress={($event: any) =>
                                handleDownloadButtonClick(data.msds, $event)
                              }
                            />
                          ) : (
                            "NA"
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{
                            width: 60,
                            justifyContent: "center",
                          }}
                        >
                          {data.cep ? (
                            <IconButton
                              icon="cloud-download"
                              size={20}
                              color={colorIcon}
                              onPress={($event: any) =>
                                handleDownloadButtonClick(data.cep, $event)
                              }
                            />
                          ) : (
                            "NA"
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{
                            width: 60,
                            justifyContent: "center",
                          }}
                        >
                          {data.qos ? (
                            <IconButton
                              icon="cloud-download"
                              size={20}
                              color={colorIcon}
                              onPress={($event: any) =>
                                handleDownloadButtonClick(data.qos, $event)
                              }
                            />
                          ) : (
                            "NA"
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Monteserrat",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 120 }}
                        >
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => expandTabHandler(index)}
                          >
                            {currentIndex !== index && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={[globalStyle.defaultFont, { color }]}
                                >
                                  Details
                                </Text>
                                <IconButton
                                  icon="caret-back-circle-outline"
                                  size={20}
                                  color={colorIcon}
                                  onPress={() => expandTabHandler(index)}
                                />
                              </View>
                            )}
                            {currentIndex == index &&
                              (dmfHTML =
                                data && data.dmf && data.dmf.length > 0 ? (
                                  JSON.parse(data.dmf)
                                    .map((dataDMF: any) => dataDMF.label)
                                    .map(
                                      (dataLabel: any, indexLabel: number) => (
                                        <View key={indexLabel}>
                                          <Text
                                            style={[
                                              globalStyle.defaultFont,
                                              { color },
                                            ]}
                                          >
                                            {dataLabel}
                                          </Text>
                                        </View>
                                      )
                                    )
                                ) : (
                                  <Text style={globalStyle.defaultFont}>
                                    No
                                  </Text>
                                ))}
                          </TouchableOpacity>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 30 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("IP") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 30 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("BP") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 30 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("EP") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 30 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("JP") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 30 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("USP") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 60 }}>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0] || "")
                          ).includes("InHouse") ? (
                            <Text
                              style={globalStyle.check}
                              role="img"
                              aria-label="check"
                            >
                              &#10004;
                            </Text>
                          ) : (
                            <Text
                              style={globalStyle.cross}
                              role="img"
                              aria-label="check"
                            >
                              &#x274C;
                            </Text>
                          )}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                </ScrollView>
              </ScrollView>
            </DataTable>
            <DataTable.Pagination
              page={currentPageP}
              numberOfPages={Math.ceil(totalRowsP / itemsPerPageP)}
              onPageChange={(page) => handlePageChangeP(page)}
              showFastPaginationControls
              numberOfItemsPerPageList={numberOfItemsPerPageListP}
              numberOfItemsPerPage={itemsPerPageP}
              onItemsPerPageChange={(numberOfItemsPerPage: number) => {
                handlePerRowsChangeP(numberOfItemsPerPage);
              }}
            />
          </View>

          <Modal
            show={open}
            onCancel={handleClose}
            header={(productData && productData.title) || "Add Product"}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={
              <View style={{ width: 100, margin: "auto" }}>
                <ButtonComp
                  onClick={handleClose}
                  normal={true}
                  buttonfont={true}
                  maxwidth={true}
                  title="CLOSE"
                ></ButtonComp>
              </View>
            }
          >
            <View>
              <Product
                productdata={productData}
                handleClose={handleClose}
              ></Product>
            </View>
          </Modal>
        </>
      )}
    </React.Fragment>
  );
};

export default ProductsList;

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
  SearchTraderView: {
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
  cardProduct: {
    backgroundColor: "transparent",
    paddingTop: 15,
  },
  lastColumn: {
    fontSize: 12,
    fontWeight: 500,
    paddingRight: "6%",
  },
  headerCont: {
    justifyContent: "space-between",
  },
});
