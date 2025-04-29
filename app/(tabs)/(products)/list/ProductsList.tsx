import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import globalStyle from "@/assets/css/style";
import IconButton from "../../../components/ui/IconButton";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import * as Sharing from "expo-sharing";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import { DataTable } from "react-native-paper";
import Card from "../../../components/UIElements/Card";
import ButtonComp from "../../../components/FormElements/Button";
import Modal from "../../../components/UIElements/Modal";
import Product from "../item/Product";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../../components/ThemedText";
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
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [allowAddProduct, setAllowAddProduct] = useState(false);
  const [isDownloaded, setisdownloaded] = useState<any>();
  const subHeader = true;

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
        if (response.manufacturer && response.manufacturer.length > 0) {
          setAllowAddProduct(true);
        } else {
          setAllowAddProduct(false);
        }
      } catch (err) {}
    }
  }, [auth.token, auth.userId, sendRequest]);

  const fetchProducts = useCallback(
    async (page: number) => {
      if (auth.userId && auth.role) {
        let url;
        if (auth.role === "Manufacturer") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/manufacturer/id?uid=${auth.userId}&page=${page}&size=${perPage}&delay=1`;
        } else if (auth.role === "Trader") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/trader/id?uid=${auth.userId}&page=${page}&size=${perPage}&delay=1`;
        }
        setLoading(true);
        try {
          const response = await sendRequest(url, "GET", null, {
            Authorization: "Bearer " + auth.token,
          });
          setLoadedProducts((prev) => {
            return response.products;
          });
          setTotalRowsP(response.total);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPage, sendRequest, auth]
  );

  const handleDeleteButtonClick = useCallback(
    async (data: any) => {
      let id = JSON.parse(data.target.value).id;
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

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    let userData = sessionStorage.getItem("userData");
    let userId = JSON.parse(userData || "").userId;
    setLoading(true);
    try {
      let url;
      if (auth.role === "Manufacturer") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/manufacturer/id?uid=${userId}&page=${page}&size=${newPerPage}&delay=1`;
      } else if (auth.role === "Trader") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/api/products/trader/id?uid=${userId}&page=${page}&size=${newPerPage}&delay=1`;
      }
      const response = await sendRequest(url, "GET", null, {
        Authorization: "Bearer " + auth.token,
      });
      setLoadedProducts(response.products);
      setPerPage(newPerPage);
      setLoading(false);
    } catch (err) {}
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
  }, [fetchProducts]);

  useEffect(() => {
    if (!open) {
      fetchProducts(1);
    }
  }, [open, fetchProducts]);

  useEffect(() => {
    if (auth.userId) {
      fetchManufacturerDashboardData();
    }
  }, [fetchManufacturerDashboardData, auth.userId]);

  useFocusEffect(
    useCallback(() => {
      // Fetch data or perform initialization logic when the screen is focused
      if (auth.userId) {
        fetchManufacturerDashboardData();
        fetchProducts(1);
      }
      return () => {
        // Optional: Clean up resources when the screen is unfocused
      };
    }, [])
  );

  const handlePerRowsChangeP = async (newPerPageP: number) => {
    setPerPageP(newPerPageP);
  };

  const handlePageChangeP = (page: number) => {
    fetchProducts(page);
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
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            alert("Report Downloaded Successfully");
          })
          .catch((e) => {});
      } catch (e: any) {
        throw new Error(e);
      }
    } catch (err) {}
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
        <ErrorModal error={error} onClear={clearError} />
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
        <ErrorModal error={error} onClear={clearError} />
        <View style={globalStyle.center}>
          <Card style={styles.cardProduct}>
            <ThemedText>No products found</ThemedText>
            <ButtonComp
              type="button"
              onClick={($event: any) => handleOpen(primaryProductData, $event)}
              normal={true}
              buttonfont={true}
              maxwidth={true}
            >
              Add Product
            </ButtonComp>
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
          <>
            <DataTable>
              <ScrollView
                horizontal
                contentContainerStyle={{ flexDirection: "column" }}
              >
                <DataTable.Header>
                  <DataTable.Title style={{ width: 30 }}>SN</DataTable.Title>
                  <DataTable.Title style={{ width: 50 }}>Edit</DataTable.Title>
                  <DataTable.Title style={{ width: 100 }}>
                    Product
                  </DataTable.Title>
                  <DataTable.Title style={{ width: 120 }}>
                    Description
                  </DataTable.Title>
                  <DataTable.Title style={{ width: 60 }}>Price</DataTable.Title>
                  <DataTable.Title
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    COA
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    MSDS
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    CEP
                  </DataTable.Title>
                  <DataTable.Title
                    style={{ width: 60, justifyContent: "center" }}
                  >
                    QOS
                  </DataTable.Title>
                  <DataTable.Title style={{ width: 120 }}>DMF</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>IP</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>BP</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>EP</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>JP</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>USP</DataTable.Title>
                  <DataTable.Title style={{ width: 60 }}>
                    In House
                  </DataTable.Title>
                </DataTable.Header>
                {loadedProducts &&
                  loadedProducts.map((data: any, index: number) => (
                    <DataTable.Row key={index}>
                      <DataTable.Cell style={{ width: 30 }}>
                        {data.serialNo}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 50 }}>
                        <IconButton
                          icon="pencil"
                          size={20}
                          color={colorIcon}
                          onPress={() => handleEditButtonClick(data)}
                        />
                        {/* <ThemedText style={[styles.editDeleteBtn]} type="outline">
                                              Edit
                                            </ThemedText> */}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 100 }}>
                        {data.title}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 120 }}>
                        {data.description}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 60 }}>
                        {data.price}
                      </DataTable.Cell>
                      <DataTable.Cell
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
                      <DataTable.Cell style={{ width: 120 }}>
                        <View
                          style={{
                            flexDirection: "column",
                          }}
                        >
                          <ScrollView>
                            {
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
                                  <Text style={[globalStyle.defaultFont]}>
                                    No
                                  </Text>
                                ))
                            }
                          </ScrollView>
                        </View>
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
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
                            {" "}
                            &#10004;{" "}
                          </Text>
                        ) : (
                          <Text
                            style={globalStyle.cross}
                            role="img"
                            aria-label="check"
                          >
                            {" "}
                            &#x274C;{" "}
                          </Text>
                        )}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                <DataTable.Pagination
                  page={currentPageP}
                  numberOfPages={Math.ceil(totalRowsP / itemsPerPageP)}
                  numberOfItemsPerPage={itemsPerPageP}
                  onPageChange={(pageP) => handlePageChangeP(pageP)}
                  numberOfItemsPerPageList={numberOfItemsPerPageListP}
                  onItemsPerPageChange={(numberOfItemsPerPageP: number) => {
                    handlePerRowsChangeP(numberOfItemsPerPageP);
                  }}
                  showFastPaginationControls
                  selectPageDropdownLabel={"Rows per page"}
                />
              </ScrollView>
            </DataTable>
            {/* <Modal
                show={open}
                onCancel={handleClose}
                header={(traderData && traderData.title) || "Add Trader"}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                <View style={{ width: 100, margin: "auto" }}>
                  <ButtonComp
                    type="button"
                    onClick={handleClose}
                    normal={true}
                    buttonfont={true}
                    maxwidth={true}
                  >
                    CLOSE
                  </ButtonComp>
                  </View>
                }
              >
               
                <View>
                  <Trader
                    traderDataRecd={traderData}
                    handleClose={handleClose}
                  ></Trader>
                </View>
              </Modal> */}
          </>
          {/* <DataTable
            columns={columns}
            data={loadedProducts}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            subHeaderComponent={subHeaderComponent}
            subHeader={subHeader}
          ></DataTable> */}
          <Modal
            show={open}
            onCancel={handleClose}
            header={(productData && productData.title) || "Add Product"}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={
              <ButtonComp
                onClick={handleClose}
                normal={true}
                buttonfont={true}
                maxwidth={true}
              >
                CLOSE
              </ButtonComp>
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
