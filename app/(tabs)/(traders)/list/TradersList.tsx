import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DataTable, Modal as Nmodal } from "react-native-paper";
import Card from "../../../components/UIElements/Card";
import ButtonComp from "../../../components/FormElements/Button";
import Modal from "../../../components/UIElements/Modal";
import Trader from "../item/Trader";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import globalStyle from "@/assets/css/style";
import { ThemedText } from "../../../components/ThemedText";
import IconButton from "../../../components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

const TradersList = () => {
  const color = useThemeColor({ light: "#000000", dark: "#ffffff" }, "text");
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "text"
  );
  const background = useThemeColor(
    { light: "#ffffff", dark: "#000000" },
    "background"
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const renderAfterCalled = useRef(false);
  const renderAfterCalledFP = useRef(false);
  const [open, setOpen] = useState(false);
  const [openP, setOpenP] = useState(false);
  const [traderId, setTraderId] = useState();
  const [loadedTraders, setLoadedTraders] = useState([]);
  const [traderData, setTraderData] = useState<any>();
  const [totalRows, setTotalRows] = useState(0);
  const [totalRowsP, setTotalRowsP] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [perPageP, setPerPageP] = useState(10);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [manfProducts, setManfProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageP, setCurrentPageP] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 20, 40]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [numberOfItemsPerPageListP] = useState([10, 20, 40]);
  const [itemsPerPageP, onItemsPerPageChangeP] = useState(
    numberOfItemsPerPageListP[0]
  );

  const [currentIndex, setCurrentIndex] = useState(-1);

  const expandTabHandler = (et: any, index: number) => {
    setCurrentIndex(index);
  };

  let dmfHTML: any;
  const fetchTraders = useCallback(
    async (page: number = 1) => {
      if (auth.userId && auth.role) {
        try {
          const response = await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/traders/manufacturer/${auth.userId}?page=${page}&size=${perPage}&delay=1`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          let tradersList = response.traders;
          let total = response.total;
          setLoadedTraders(tradersList);
          setTotalRows(total);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPage, sendRequest, auth]
  );

  const handlePerRowsChange = async (newPerPage: number) => {
    setCurrentPage(0);
    fetchTraders(1);
    setPerPage(newPerPage);
    onItemsPerPageChange(newPerPage);
  };

  const handlePageChange = (page: number) => {
    fetchTraders(page + 1);
    setCurrentPage(page);
  };

  const handleEditButtonClick = useCallback((data: any) => {
    setOpen(true);
    setTraderData(data);
  }, []);

  const handleDeleteButtonClick = useCallback(
    async (data: any) => {
      let id = JSON.parse(data.id);
      try {
        if (id) {
          await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/traders/${id}`,
            "DELETE",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          fetchTraders(1);
        }
      } catch (err) {}
    },
    [sendRequest, auth, fetchTraders]
  );

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      if (traderId && auth.token) {
        try {
          const response = await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/products/trader/manufacturer/id?uid=${traderId}&page=${page}&size=${perPageP}&delay=1`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          setLoadedProducts(response.products);
          setTotalRowsP(response.total);
          setOpenP(true);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [traderId, auth.token, perPageP, sendRequest]
  );

  const fetchProductsManf = useCallback(
    async (page: number = 1) => {
      if (auth && auth.userId) {
        try {
          const response = await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/products/manufacturer/id?uid=${auth.userId}&page=${page}&size=${perPage}&delay=1`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
              "Content-type": "application/json",
            }
          );
          let products = response.products;
          setManfProducts(products);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPage, sendRequest, auth]
  );

  const handlePerRowsChangeP = async (newPerPageP: number) => {
    setCurrentPageP(0);
    fetchProducts(1);
    setPerPageP(newPerPageP);
    onItemsPerPageChangeP(newPerPageP);
  };

  const handlePageChangeP = (page: number) => {
    setCurrentPageP(page);
    fetchProducts(page + 1);
  };

  useEffect(() => {
    if (traderId) {
      fetchProducts(1);
    }
  }, [traderId, fetchProducts]);

  const handleOpen = (trader: any) => {
    setTraderData(trader);
    setOpen(true);
  };

  const handleOpenP = useCallback(
    async (trader: any) => {
      setTraderId(trader.id);
      fetchProducts(1);
    },
    [fetchProducts]
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseP = () => {
    setOpenP(false);
  };

  const handleProductsDetailButtonClick = useCallback(
    (data: any) => {
      handleOpenP(data);
    },
    [handleOpenP]
  );

  useEffect(() => {
    fetchTraders(1);
    fetchProductsManf(1);
  }, [auth]);

  useEffect(() => {
    if (!open) {
      fetchTraders(1);
    }
  }, [open, fetchTraders]);

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchTraders(1);
    }
    renderAfterCalled.current = true;
  }, [fetchTraders]);

  useEffect(() => {
    if (!renderAfterCalledFP.current) {
      fetchProductsManf(1);
    }
    renderAfterCalledFP.current = true;
  }, [fetchProductsManf]);

  useFocusEffect(
    useCallback(() => {
      // Fetch data or perform initialization logic when the screen is focused
      if (auth.userId) {
        fetchProductsManf();
      }
      return () => {
        // Optional: Clean up resources when the screen is unfocused
      };
    }, [])
  );

  if (manfProducts.length == 0) {
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <View style={globalStyle.center}>
          <Card cardProduct={true}>
            <Text style={globalStyle.defaultFont}>
              No Products found. Please add products first and then add Trader
            </Text>
          </Card>
        </View>
      </React.Fragment>
    );
  }
  if (loadedTraders && loadedTraders.length === 0 && manfProducts.length > 0) {
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <View style={globalStyle.center}>
          <Card cardProduct={true}>
            <Text style={globalStyle.defaultFont}>No traders found</Text>
            <ButtonComp
              onClick={() => handleOpen(null)}
              normal={true}
              buttonfont={true}
              maxwidth={true}
              title="Add Trader"
            ></ButtonComp>
            <Modal
              show={open}
              onCancel={handleClose}
              header="Add Trader"
              contentClass="place-item__modal-content"
              footerClass="place-item__modal-actions abc"
              datatable={false}
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
              <View className="map-container">
                <Trader
                  traderDataRecd={null}
                  handleClose={handleClose}
                ></Trader>
              </View>
            </Modal>
          </Card>
        </View>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <Card style={[styles.cardProduct, globalStyle.center]}>
          <ButtonComp
            onClick={() => handleOpen(null)}
            normal={true}
            buttonfont={true}
            maxwidth={true}
            title="Add Trader"
          ></ButtonComp>
        </Card>
      )}
      {loadedTraders && !isLoading && (
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
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 40 }}
                  >
                    SN
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 50 }}
                  >
                    Edit
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 50 }}
                  >
                    Delete
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 100 }}
                  >
                    Trader
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 150 }}
                  >
                    Email
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 100 }}
                  >
                    Address
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontStyle: "normal",
                    }}
                    style={{ width: 100 }}
                  >
                    Products
                  </DataTable.Title>
                </DataTable.Header>
                <ScrollView
                  contentContainerStyle={{
                    flexDirection: "column",
                  }}
                >
                  {loadedTraders &&
                    loadedTraders.map((data: any, index: number) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 40 }}
                        >
                          {data.serialNo}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
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
                        <DataTable.Cell style={{ width: 50 }}>
                          <IconButton
                            icon="trash-bin"
                            size={20}
                            color={colorIcon}
                            onPress={() => handleDeleteButtonClick(data)}
                          />
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 100 }}
                        >
                          {data.title}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 150 }}
                        >
                          {data.email}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 100 }}
                        >
                          {data.address}
                        </DataTable.Cell>
                        <DataTable.Cell
                          textStyle={{
                            fontFamily: "Work Sans",
                            fontWeight: 400,
                            fontStyle: "normal",
                          }}
                          style={{ width: 100 }}
                          onPress={() => handleProductsDetailButtonClick(data)}
                        >
                          <ThemedText
                            style={[styles.editDeleteBtn]}
                            type="outline"
                          >
                            Products
                          </ThemedText>
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                </ScrollView>
              </ScrollView>
            </DataTable>
            <DataTable.Pagination
              page={currentPage}
              numberOfPages={Math.ceil(totalRows / itemsPerPage)}
              numberOfItemsPerPage={itemsPerPage}
              onPageChange={(page) => handlePageChange(page)}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              onItemsPerPageChange={(numberOfItemsPerPage: number) => {
                handlePerRowsChange(numberOfItemsPerPage);
              }}
              showFastPaginationControls
            />
          </View>
          <Modal
            show={open}
            onCancel={handleClose}
            header={(traderData && traderData.title) || "Add Trader"}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            datatable={false}
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
              <Trader
                traderDataRecd={traderData}
                handleClose={handleClose}
              ></Trader>
            </View>
          </Modal>
        </>
      )}
      <Nmodal
        visible={openP}
        onDismiss={handleCloseP}
        style={{ backgroundColor: background }}
      >
        {loadedProducts.length == 0 && !isLoading && (
          <>
            <View style={{ marginHorizontal: "auto" }}>
              <Text style={[globalStyle.defaultFont, { color }]}>
                No Products found. Please add one.
              </Text>
            </View>
            <View
              style={{
                width: 100,
                marginTop: 25,
                marginHorizontal: "auto",
              }}
            >
              <ButtonComp
                onClick={handleCloseP}
                normal={true}
                buttonfont={true}
                maxwidth={true}
                title="CLOSE"
              ></ButtonComp>
            </View>
          </>
        )}
        {loadedProducts.length > 0 && !isLoading && (
          <>
            <View>
              <ScrollView>
                <DataTable>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      flexDirection: "column",
                      paddingBottom: 25,
                      flexGrow: 1,
                    }}
                  >
                    <DataTable.Header>
                      <DataTable.Title style={{ width: 30 }}>
                        SN
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 100 }}>
                        Product
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 120 }}>
                        Description
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 60 }}>
                        Price
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        COA
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 50 }}>
                        MSDS
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        CEP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        QOS
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 120 }}>
                        DMF
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        IP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        BP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        EP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        JP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 30 }}>
                        USP
                      </DataTable.Title>
                      <DataTable.Title style={{ width: 60 }}>
                        In House
                      </DataTable.Title>
                    </DataTable.Header>
                    <ScrollView
                      nestedScrollEnabled={true}
                      contentContainerStyle={{
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {loadedProducts &&
                        loadedProducts.map((data: any, index: number) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell style={{ width: 30 }}>
                              {data.serialNo}
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
                            <DataTable.Cell style={{ width: 30 }}>
                              {data.coa ? "Yes" : "NA"}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 50 }}>
                              {data.msds ? "Yes" : "NA"}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 30 }}>
                              {data.cep ? "Yes" : "NA"}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 30 }}>
                              {data.qos ? "Yes" : "NA"}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ width: 120 }}>
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => expandTabHandler(true, index)}
                              >
                                {currentIndex !== index && (
                                  <Text
                                    style={[globalStyle.defaultFont, { color }]}
                                  >
                                    {" "}
                                    Details
                                  </Text>
                                )}
                                {currentIndex == index &&
                                  (dmfHTML =
                                    data && data.dmf && data.dmf.length > 0 ? (
                                      JSON.parse(data.dmf)
                                        .map((dataDMF: any) => dataDMF.label)
                                        .map(
                                          (
                                            dataLabel: any,
                                            indexLabel: number
                                          ) => (
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                                JSON.stringify(data.pharmacopoeias[0])
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
                    </ScrollView>
                  </ScrollView>
                </DataTable>
                <DataTable.Pagination
                  style={{ zIndex: 99999, pointerEvents: "auto" }}
                  page={currentPageP}
                  numberOfPages={Math.ceil(totalRowsP / itemsPerPageP)}
                  numberOfItemsPerPage={itemsPerPageP}
                  onPageChange={(pageP) => handlePageChangeP(pageP)}
                  numberOfItemsPerPageList={numberOfItemsPerPageListP}
                  onItemsPerPageChange={(numberOfItemsPerPageP: number) => {
                    handlePerRowsChangeP(numberOfItemsPerPageP);
                  }}
                />
                <View
                  style={{
                    width: 100,
                    marginTop: 25,
                    marginHorizontal: "auto",
                  }}
                >
                  <ButtonComp
                    onClick={handleCloseP}
                    normal={true}
                    buttonfont={true}
                    maxwidth={true}
                    title="CLOSE"
                  ></ButtonComp>
                </View>
              </ScrollView>
            </View>
          </>
        )}
      </Nmodal>
    </React.Fragment>
  );
};

export default TradersList;

const styles = StyleSheet.create({
  editDeleteBtn: {
    position: "relative",
    width: 75,
    marginHorizontal: 5,
  },
  cardProduct: {
    backgroundColor: "transparent",
    paddingTop: 15,
  },
});
