import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { DataTable } from "react-native-paper";

import Card from "../../../components/UIElements/Card";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import ButtonComp from "../../../components/FormElements/Button";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import { ScrollView, Text, View } from "react-native";

import s from "@/assets/css/style";

const DashboardAdminScreen = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const renderAfterCalled = useRef(false);
  const renderAfterCalledFP = useRef(false);
  const [loadedTraders, setLoadedTraders] = useState([]);
  const [loadedManufacturers, setLoadedManufacturers] = useState([]);
  const [totalRowsTrader, setTotalRowsTrader] = useState(0);
  const [totalRowsManufacturer, setTotalRowsManufacturer] = useState(0);
  const [perPageM, setPerPageM] = useState(10);
  const [perPageT, setPerPageT] = useState(10);
  const [currentPageT, setCurrentPageT] = useState(1);
  const [currentPageM, setCurrentPageM] = useState(1);
  const [currentTab, setCurrentTab] = useState("traders");

  const [numberOfItemsPerPageListT] = useState([10, 20, 40]);
  const [itemsPerPageT, onItemsPerPageChangeT] = useState(
    numberOfItemsPerPageListT[0]
  );
  const [numberOfItemsPerPageListM] = useState([10, 20, 40]);
  const [itemsPerPageM, onItemsPerPageChangeM] = useState(
    numberOfItemsPerPageListM[0]
  );

  const handlePerRowsChangeT = async (newPerPage: number) => {
    setPerPageT(newPerPage);
    setCurrentPageT(0);
    fetchTraders(1);
    onItemsPerPageChangeT(newPerPage);
  };

  const handlePageChangeT = (page: number) => {
    setCurrentPageT(page);
    fetchTraders(page + 1);
  };
  const handlePerRowsChangeM = async (newPerPage: number) => {
    setPerPageM(newPerPage);
    setCurrentPageM(0);
    fetchManufacturers(1);
    onItemsPerPageChangeM(newPerPage);
  };

  const handlePageChangeM = (page: number) => {
    setCurrentPageM(page);
    fetchManufacturers(page + 1);
  };

  const fetchTraders = useCallback(
    async (page: number) => {
      if (auth) {
        try {
          const response = await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/users/traderslist?page=${page}&size=${perPageT}&delay=1`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          let traderList = response.traders;
          let total = response.total;
          setLoadedTraders(traderList);
          setTotalRowsTrader(total);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPageT, sendRequest, auth]
  );

  const fetchManufacturers = useCallback(
    async (page: number) => {
      if (auth) {
        try {
          const response = await sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/users/manufacturerslist?page=${page}&size=${perPageM}&delay=1`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          );
          let manufacturersList = response.manufacturers;
          let total = response.total;
          setLoadedManufacturers(manufacturersList);
          setTotalRowsManufacturer(total);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [perPageM, sendRequest, auth]
  );

  const handleDeleteTraderButtonClick = useCallback(
    async (data: any) => {
      let id = JSON.parse(data.id);
      if (auth) {
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
      }
    },
    [sendRequest, auth, fetchTraders]
  );

  const handleDeleteManufacturerButtonClick = useCallback(
    async (data: any) => {
      let id = JSON.parse(data.target.value).id;
      if (auth) {
        try {
          if (id) {
            await sendRequest(
              `${process.env.EXPO_PUBLIC_API_URL}/api/manufacturers/${id}`,
              "DELETE",
              null,
              {
                Authorization: "Bearer " + auth.token,
              }
            );
            fetchManufacturers(1);
          }
        } catch (err) {}
      }
    },
    [sendRequest, auth, fetchManufacturers]
  );

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchTraders(1);
    }
    renderAfterCalled.current = true;
  }, [fetchTraders]);

  useEffect(() => {
    if (!renderAfterCalledFP.current) {
      fetchManufacturers(1);
    }
    renderAfterCalledFP.current = true;
  }, [fetchManufacturers]);

  function handleCurrentTab(presentTab: string) {
    setCurrentTab(presentTab);
    if (presentTab === "manufacturers") {
      fetchManufacturers(1);
    } else if (presentTab === "traders") {
      fetchTraders(1);
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedManufacturers && loadedManufacturers.length === 0 && (
        <View style={s.center}>
          <Card cardProduct>
            <Text style={[s.defaultFont]}>No Manufacturers found.</Text>
          </Card>
        </View>
      )}

      {loadedTraders && loadedTraders.length === 0 && (
        <View style={s.center}>
          <Card cardProduct>
            <Text style={[s.defaultFont]}>No Traders found.</Text>
          </Card>
        </View>
      )}
      {!isLoading && (
        <View style={[s.rowContainer]}>
          {loadedManufacturers && loadedManufacturers.length > 0 && (
            <View style={s.autoFlex}>
              <ButtonComp
                normal={true}
                buttonfont={true}
                maxwidth={true}
                onClick={() => handleCurrentTab("manufacturers")}
                title="Manufacturers"
              ></ButtonComp>
            </View>
          )}
          {loadedTraders && loadedTraders.length > 0 && (
            <View style={s.autoFlex}>
              <ButtonComp
                normal={true}
                buttonfont={true}
                maxwidth={true}
                onClick={() => handleCurrentTab("traders")}
                title="Traders"
              ></ButtonComp>
            </View>
          )}
        </View>
      )}
      {loadedManufacturers &&
        loadedManufacturers.length > 0 &&
        !isLoading &&
        currentTab === "manufacturers" && (
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
                      Manufacturer
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Work Sans",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 120 }}
                    >
                      Description
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Work Sans",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 150 }}
                    >
                      Address
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Work Sans",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 60 }}
                    >
                      Listing
                    </DataTable.Title>
                  </DataTable.Header>
                  <ScrollView
                    contentContainerStyle={{
                      flexDirection: "column",
                    }}
                  >
                    {loadedManufacturers &&
                      loadedManufacturers.map((data: any, index: number) => (
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
                            onPress={() =>
                              handleDeleteManufacturerButtonClick(data)
                            }
                            style={{ width: 50 }}
                          >
                            Delete
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
                            style={{ width: 120 }}
                          >
                            {data.description}
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontFamily: "Work Sans",
                              fontWeight: 400,
                              fontStyle: "normal",
                            }}
                            style={{ width: 150 }}
                          >
                            {data.address}
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontFamily: "Work Sans",
                              fontWeight: 400,
                              fontStyle: "normal",
                            }}
                            style={{ width: 60 }}
                          >
                            {data.listing}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                  </ScrollView>
                </ScrollView>
              </DataTable>
              <DataTable.Pagination
                page={currentPageM}
                numberOfPages={Math.ceil(totalRowsManufacturer / itemsPerPageM)}
                numberOfItemsPerPage={itemsPerPageM}
                onPageChange={(page) => handlePageChangeM(page)}
                numberOfItemsPerPageList={numberOfItemsPerPageListM}
                onItemsPerPageChange={(numberOfItemsPerPage: number) => {
                  handlePerRowsChangeM(numberOfItemsPerPage);
                }}
                showFastPaginationControls
              />
            </View>
          </>
        )}
      {loadedTraders &&
        loadedTraders.length > 0 &&
        !isLoading &&
        currentTab === "traders" && (
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
                      style={{ width: 150 }}
                    >
                      Address
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={{
                        fontFamily: "Work Sans",
                        fontWeight: 400,
                        fontStyle: "normal",
                      }}
                      style={{ width: 60 }}
                    >
                      Listing
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
                            onPress={() => handleDeleteTraderButtonClick(data)}
                            style={{ width: 50 }}
                          >
                            Delete
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
                            style={{ width: 150 }}
                          >
                            {data.address}
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={{
                              fontFamily: "Work Sans",
                              fontWeight: 400,
                              fontStyle: "normal",
                            }}
                            style={{ width: 60 }}
                          >
                            {data.listing}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                  </ScrollView>
                </ScrollView>
              </DataTable>
              <DataTable.Pagination
                page={currentPageT}
                numberOfPages={Math.ceil(totalRowsTrader / itemsPerPageT)}
                numberOfItemsPerPage={itemsPerPageT}
                onPageChange={(page) => handlePageChangeT(page)}
                numberOfItemsPerPageList={numberOfItemsPerPageListT}
                onItemsPerPageChange={(numberOfItemsPerPage: number) => {
                  handlePerRowsChangeT(numberOfItemsPerPage);
                }}
                showFastPaginationControls
              />
            </View>
          </>
        )}
    </React.Fragment>
  );
};

export default DashboardAdminScreen;
