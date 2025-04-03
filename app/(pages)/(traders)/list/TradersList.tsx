import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DataTable } from "react-native-paper";

import Card from "@/components/UIElements/Card";
import ButtonComp from "@/components/FormElements/Button";
import Modal from "@/components/UIElements/Modal";
import Trader from "../item/Trader";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import { MAIN_URL } from "@/util/config";
import ErrorModal from "@/components/UIElements/ErrorModal";
import LoadingSpinner from "@/components/UIElements/LoadingSpinner";

import { View, Text } from "react-native";

import s from "../../../../assets/css/style";

const TradersList = () => {
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
    setTraderData(JSON.parse(data));
  }, []);

  const handleDeleteButtonClick = useCallback(
    async (data: any) => {
      let id = JSON.parse(data.id);
      try {
        if (id) {
          await sendRequest(`${MAIN_URL}/api/traders/${id}`, "DELETE", null, {
            Authorization: "Bearer " + auth.token,
          });
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
            `${MAIN_URL}/api/products/trader/manufacturer/id?uid=${traderId}&page=${page}&size=${perPage}&delay=1`,
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
      if (auth) {
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

  const handleOpen = (trader: any, e: any) => {
    e.preventDefault();
    setTraderData(trader);
    setOpen(true);
  };

  const handleOpenP = useCallback(
    async (trader: any) => {
      setTraderId(trader.id);
      setLoading(true);
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
      handleOpenP(JSON.parse(data));
    },
    [handleOpenP]
  );

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
        <View style={s.center}>
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
        <View style={s.center}>
          <Card cardProduct={true}>
            <Text>No traders found</Text>
            <ButtonComp
              onClick={($event: any) => handleOpen(null, $event)}
              normal={true}
              buttonfont={true}
              maxwidth={true}
            >
              Add Trader
            </ButtonComp>
            <Modal
              show={open}
              onCancel={handleClose}
              header="Add Trader"
              contentClass="place-item__modal-content"
              footerClass="place-item__modal-actions abc"
              footer={
                <ButtonComp
                  type="button"
                  onClick={handleClose}
                  normal={true}
                  buttonfont={true}
                  maxwidth={true}
                >
                  CLOSE
                </ButtonComp>
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
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <Card cardProduct center>
          <ButtonComp
            type="button"
            onClick={($event: any) => handleOpen(null, $event)}
            normal={true}
            buttonfont={true}
            maxwidth={true}
          >
            Add Trader
          </ButtonComp>
        </Card>
      )}
      {loadedTraders && !isLoading && (
        <>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>SN</DataTable.Title>
              <DataTable.Title numeric>Edit</DataTable.Title>
              <DataTable.Title numeric>Delete</DataTable.Title>
              <DataTable.Title numeric>Trader</DataTable.Title>
              <DataTable.Title numeric>Email</DataTable.Title>
              <DataTable.Title numeric>Address</DataTable.Title>
              <DataTable.Title numeric>Products</DataTable.Title>
            </DataTable.Header>
            {loadedTraders &&
              loadedTraders.map((data: any, index: number) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell onPress={() => handleEditButtonClick(data)}>
                    <DataTable.Cell numeric>{data.serialNo}</DataTable.Cell>
                    Edit
                  </DataTable.Cell>
                  <DataTable.Cell
                    numeric
                    onPress={() => handleDeleteButtonClick(data)}
                  >
                    Delete
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{data.title}</DataTable.Cell>
                  <DataTable.Cell numeric>{data.email}</DataTable.Cell>
                  <DataTable.Cell numeric>{data.address}</DataTable.Cell>
                  <DataTable.Cell
                    numeric
                    onPress={() => handleProductsDetailButtonClick(data)}
                  >
                    <ButtonComp>Products</ButtonComp>
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
          </DataTable>
          <Modal
            show={open}
            onCancel={handleClose}
            header={(traderData && traderData.title) || "Add Trader"}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={
              <ButtonComp
                type="button"
                onClick={handleClose}
                normal={true}
                buttonfont={true}
                maxwidth={true}
              >
                CLOSE
              </ButtonComp>
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
        footer={
          <ButtonComp
            type="button"
            onClick={handleCloseP}
            normal={true}
            buttonfont={true}
            maxwidth={true}
          >
            CLOSE
          </ButtonComp>
        }
      >
        {/* <View  className="map-container">      */}
        <View>
          {loadedProducts && !isLoading && (
            <>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>SN</DataTable.Title>
                  <DataTable.Title numeric>Product</DataTable.Title>
                  <DataTable.Title numeric>Description</DataTable.Title>
                  <DataTable.Title numeric>Price</DataTable.Title>
                  <DataTable.Title numeric>COA</DataTable.Title>
                  <DataTable.Title numeric>MSDS</DataTable.Title>
                  <DataTable.Title numeric>CEP</DataTable.Title>
                  <DataTable.Title numeric>QOS</DataTable.Title>
                  <DataTable.Title numeric>DMF</DataTable.Title>
                  <DataTable.Title numeric>IP</DataTable.Title>
                  <DataTable.Title numeric>BP</DataTable.Title>
                  <DataTable.Title numeric>EP</DataTable.Title>
                  <DataTable.Title numeric>JP</DataTable.Title>
                  <DataTable.Title numeric>USP</DataTable.Title>
                  <DataTable.Title numeric>In House</DataTable.Title>
                </DataTable.Header>
                {loadedProducts &&
                  loadedProducts.map((data: any, index: number) =>
                    (data && data.dmf && data.dmf.length > 0 ? (
                      (dmfHTML = data.dmf
                        .map((dataDMF: any) => dataDMF.label)
                        .map((dataLabel: any, indexLabel: number) => (
                          <View>
                            <Text>{dataLabel}</Text>
                          </View>
                        )))
                    ) : (
                      <Text>No</Text>
                    ))(
                      <DataTable.Row key={index}>
                        <DataTable.Cell numeric>{data.serialNo}</DataTable.Cell>
                        <DataTable.Cell>{data.title}</DataTable.Cell>
                        <DataTable.Cell>{data.description}</DataTable.Cell>
                        <DataTable.Cell numeric>{data.price}</DataTable.Cell>
                        <DataTable.Cell>
                          {data.COA ? "Yes" : "NA"}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {data.MSDS ? "Yes" : "NA"}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {data.CEP ? "Yes" : "NA"}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {data.QOS ? "Yes" : "NA"}
                        </DataTable.Cell>
                        <DataTable.Cell>{dmfHTML}</DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("IP") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("BP") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("EP") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("JP") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("USP") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {JSON.parse(
                            JSON.stringify(data.pharmacopoeias[0])
                          ).includes("InHouse") ? (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          ) : (
                            <Text
                              className="check"
                              role="img"
                              aria-label="check"
                            >
                              {" "}
                              &#10004;{" "}
                            </Text>
                          )}
                        </DataTable.Cell>
                      </DataTable.Row>
                    )
                  )}
                <DataTable.Pagination
                  page={currentPageP}
                  numberOfPages={Math.ceil(totalRowsP / itemsPerPage)}
                  numberOfItemsPerPage={itemsPerPageP}
                  onPageChange={(pageP) => handlePageChangeP(pageP)}
                  numberOfItemsPerPageList={numberOfItemsPerPageListP}
                  onItemsPerPageChange={(numberOfItemsPerPageP: number) => {
                    handlePerRowsChangeP(numberOfItemsPerPageP);
                  }}
                  showFastPaginationControls
                  selectPageDropdownLabel={"Rows per page"}
                />
              </DataTable>
              <Modal
                show={open}
                onCancel={handleClose}
                header={(traderData && traderData.title) || "Add Trader"}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={
                  <ButtonComp
                    type="button"
                    onClick={handleClose}
                    normal={true}
                    buttonfont={true}
                    maxwidth={true}
                  >
                    CLOSE
                  </ButtonComp>
                }
              >
                {/* <View className="map-container">  */}
                <View>
                  <Trader
                    traderDataRecd={traderData}
                    handleClose={handleClose}
                  ></Trader>
                </View>
              </Modal>
            </>
          )}
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default TradersList;
