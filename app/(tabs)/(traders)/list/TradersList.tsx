import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DataTable } from "react-native-paper";
import { PaperProvider } from "react-native-paper";

import Card from "@/components/UIElements/Card";
import ButtonComp from "@/components/FormElements/Button";
import Modal from "@/components/UIElements/Modal";
import Trader from "../item/Trader";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import { MAIN_URL } from "@/util/config";
import ErrorModal from "@/components/UIElements/ErrorModal";
import LoadingSpinner from "@/components/UIElements/LoadingSpinner";

import { View, Text, ScrollView, StyleSheet } from "react-native";

import globalStyle from "@/assets/css/style";
import { ThemedText } from "@/components/ThemedText";
import IconButton from "@/components/ui/IconButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

const TradersList = () => {
  const color = useThemeColor({ light: "#000000", dark: "#ffffff" }, "text");
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "text"
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
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [totalRowsP, setTotalRowsP] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [perPageP, setPerPageP] = useState(10);
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [manfProducts, setManfProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageP, setCurrentPageP] = useState(0);

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
    setPerPage(newPerPage);
  };

  const handlePageChange = (page: number) => {
    fetchTraders(page);
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
            `${process.env.EXPO_PUBLIC_API_URL}/api/products/trader/manufacturer/id?uid=${traderId}&page=${page}&size=${perPage}&delay=1`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          setLoadedProducts(response.products);
          setTotalRowsP(response.total);
          setLoading(false);
          setOpenP(true);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [traderId, auth.token, perPage, sendRequest]
  );

  const fetchProductsManf = useCallback(
    async (page: number = 1) => {
      setLoading(true);
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
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPage, sendRequest, auth]
  );

  const handlePerRowsChangeP = async (newPerPageP: number) => {
    setPerPageP(newPerPageP);
  };

  const handlePageChangeP = (page: number) => {
    fetchProducts(page);
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
      // setLoading(true);
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

  const [numberOfItemsPerPageList] = useState([10, 20, 40]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [numberOfItemsPerPageListP] = useState([10, 20, 40]);
  const [itemsPerPageP, onItemsPerPageChangeP] = useState(
    numberOfItemsPerPageListP[0]
  );

  let dmfHTML: any;

  if (manfProducts.length === 0) {
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <View style={globalStyle.center}>
          <Card cardProduct={true}>
            <Text>
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
            <Text>No traders found</Text>
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
          <DataTable>
            <ScrollView
              horizontal
              contentContainerStyle={{ flexDirection: "column" }}
            >
              <DataTable.Header>
                <DataTable.Title style={{ width: 40 }}>SN</DataTable.Title>
                <DataTable.Title style={{ width: 50 }}>Edit</DataTable.Title>
                <DataTable.Title style={{ width: 50 }}>Delete</DataTable.Title>
                <DataTable.Title style={{ width: 100 }}>Trader</DataTable.Title>
                <DataTable.Title style={{ width: 150 }}>Email</DataTable.Title>
                <DataTable.Title style={{ width: 100 }}>
                  Address
                </DataTable.Title>
                <DataTable.Title style={{ width: 100 }}>
                  Products
                </DataTable.Title>
              </DataTable.Header>
              {loadedTraders &&
                loadedTraders.map((data: any, index: number) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={{ width: 40 }}>
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
                    <DataTable.Cell style={{ width: 50 }}>
                      <IconButton
                        icon="trash-bin"
                        size={20}
                        color={colorIcon}
                        onPress={() => handleDeleteButtonClick(data)}
                      />
                      {/* <ThemedText style={[styles.editDeleteBtn]} type="outline">
                        Delete
                      </ThemedText> */}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ width: 100 }}>
                      {data.title}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ width: 150 }}>
                      {data.email}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ width: 100 }}>
                      {data.address}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={{ width: 100 }}
                      onPress={() => handleProductsDetailButtonClick(data)}
                    >
                      <ThemedText style={[styles.editDeleteBtn]} type="outline">
                        Products
                      </ThemedText>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
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
                selectPageDropdownLabel={"Rows per page"}
              />
            </ScrollView>
          </DataTable>
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
            {/* <View className="map-container"> */}
            <View>
              <Trader
                traderDataRecd={traderData}
                handleClose={handleClose}
              ></Trader>
            </View>
          </Modal>
        </>
      )}
      <Modal
        show={openP}
        onCancel={handleCloseP}
        header="Products"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions abc"
        datatable={true}
        footer={
          <View style={{ width: 100, margin: "auto" }}>
            <ButtonComp
              onClick={handleCloseP}
              normal={true}
              buttonfont={true}
              maxwidth={true}
              title="CLOSE"
            ></ButtonComp>
          </View>
        }
      >
        {/* <View  className="map-container">      */}

        {loadedProducts && !isLoading && (
          <>
            <DataTable>
              <ScrollView
                horizontal
                contentContainerStyle={{ flexDirection: "column" }}
              >
                <DataTable.Header>
                  <DataTable.Title style={{ width: 30 }}>SN</DataTable.Title>
                  <DataTable.Title style={{ width: 30, flexWrap: "nowrap" }}>
                    Product
                  </DataTable.Title>
                  <DataTable.Title style={{ width: 120 }}>
                    Description
                  </DataTable.Title>
                  <DataTable.Title style={{ width: 60 }}>Price</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>COA</DataTable.Title>
                  <DataTable.Title style={{ width: 50 }}>MSDS</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>CEP</DataTable.Title>
                  <DataTable.Title style={{ width: 30 }}>QOS</DataTable.Title>
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
                      <DataTable.Cell style={{ width: 30, flexWrap: "nowrap" }}>
                        {data.title}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 120 }}>
                        {data.description}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 60 }}>
                        {data.price}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 30 }}>
                        {data.COA ? "Yes" : "NA"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 50 }}>
                        {data.MSDS ? "Yes" : "NA"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 30 }}>
                        {data.CEP ? "Yes" : "NA"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 30 }}>
                        {data.QOS ? "Yes" : "NA"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ width: 120 }}>
                        <View style={{ flexDirection: "column" }}>
                          {
                            (dmfHTML =
                              data && data.dmf && data.dmf.length > 0 ? (
                                JSON.parse(data.dmf)
                                  .map((dataDMF: any) => dataDMF.label)
                                  .map((dataLabel: any, indexLabel: number) => (
                                    <View key={indexLabel}>
                                      <Text style={{ color }}>{dataLabel}</Text>
                                    </View>
                                  ))
                              ) : (
                                <Text>No</Text>
                              ))
                          }
                        </View>
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
        )}
      </Modal>
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
