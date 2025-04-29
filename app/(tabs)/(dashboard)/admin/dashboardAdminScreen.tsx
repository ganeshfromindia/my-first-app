import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from "react";
import { DataTable } from "react-native-paper";

import Card from "../../../components/UIElements/Card";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import { MAIN_URL } from "@/util/config";
import ButtonComp from "../../../components/FormElements/Button";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import { StyleSheet, Text, View } from "react-native";

import s from "@/assets/css/style";

const DashboardAdminScreen = (props: any) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const renderAfterCalled = useRef(false);
  const renderAfterCalledFP = useRef(false);
  const [loadedTraders, setLoadedTraders] = useState([]);
  const [loadedManufacturers, setLoadedManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRowsTrader, setTotalRowsTrader] = useState(0);
  const [totalRowsManufacturer, setTotalRowsManufacturer] = useState(0);
  const [perPageM, setPerPageM] = useState(10);
  const [currentPageM, setCurrentPageM] = useState(1);
  const [perPageT, setPerPageT] = useState(10);
  const [currentPageT, setCurrentPageT] = useState(1);
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
  };

  const handlePageChangeT = (page: number) => {
    fetchTraders(page);
    setCurrentPageT(page);
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

  const handlePerRowsChangeTrader = async (
    newPerPage: number,
    page: number
  ) => {
    setLoading(true);
    try {
      const response = await sendRequest(
        `${process.env.EXPO_PUBLIC_API_URL}/users/traderslist?page=${page}&size=${perPageT}&delay=1`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      let tradersList = response.traders;
      setLoadedTraders(tradersList);
      setPerPageT(newPerPage);
    } catch (err) {}
  };

  const handlePageChangeTrader = (page: number) => {
    fetchTraders(page);
    setCurrentPageT(page);
  };

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

  const handlePerRowsChangeManufacturer = async (
    newPerPage: number,
    page: number
  ) => {
    try {
      const response = await sendRequest(
        `${process.env.EXPO_PUBLIC_API_URL}/users/manufacturerslist?page=${page}&size=${perPageM}&delay=1`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      let manufacturersList = response.manufacturers;
      setLoadedManufacturers(manufacturersList);
      setPerPageM(newPerPage);
    } catch (err) {}
  };

  const handlePageChangeManufacturer = (page: number) => {
    fetchManufacturers(page);
    setCurrentPageM(page);
  };

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

  // if (loadedManufacturers && loadedManufacturers.length === 0) {
  //   return (
  //     <View style={s.center}>
  //       <Card cardProduct>
  //         <Text style={[s.navLinkbuttonActive,  s.defaultFont]}>No Manufacturers found.</Text>
  //       </Card>
  //     </View>
  //   );
  // }

  // if (loadedTraders && loadedTraders.length === 0) {
  //   return (
  //     <View style={s.center}>
  //       <Card cardProduct>
  //         <Text style={[s.navLinkbuttonActive,  s.defaultFont]}>No Traders found.</Text>
  //       </Card>
  //     </View>
  //   );
  // }

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
          <View style={s.autoFlex}>
            <ButtonComp
              normal={true}
              buttonfont={true}
              maxwidth={true}
              onClick={() => handleCurrentTab("manufacturers")}
              title="Manufacturers"
            ></ButtonComp>
          </View>
          <View style={s.autoFlex}>
            <ButtonComp
              normal={true}
              buttonfont={true}
              maxwidth={true}
              onClick={() => handleCurrentTab("traders")}
              title="Traders"
            ></ButtonComp>
          </View>
        </View>
      )}
      {loadedManufacturers && !isLoading && currentTab === "manufacturers" && (
        <>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>SN</DataTable.Title>
              <DataTable.Title>Delete</DataTable.Title>
              <DataTable.Title>Manufacturer</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Address</DataTable.Title>
              <DataTable.Title>Listing</DataTable.Title>
            </DataTable.Header>
            {loadedManufacturers &&
              loadedManufacturers.map((data: any, index: number) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{data.serialNo}</DataTable.Cell>
                  <DataTable.Cell
                    onPress={() => handleDeleteTraderButtonClick(data)}
                  >
                    Delete
                  </DataTable.Cell>
                  <DataTable.Cell>{data.title}</DataTable.Cell>
                  <DataTable.Cell>{data.description}</DataTable.Cell>
                  <DataTable.Cell>{data.address}</DataTable.Cell>
                  <DataTable.Cell>{data.listing}</DataTable.Cell>
                </DataTable.Row>
              ))}
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
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </>
      )}
      {loadedTraders && !isLoading && currentTab === "traders" && (
        <>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>SN</DataTable.Title>
              <DataTable.Title>Delete</DataTable.Title>
              <DataTable.Title>Trader</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Address</DataTable.Title>
              <DataTable.Title>Listing</DataTable.Title>
            </DataTable.Header>
            {loadedTraders &&
              loadedTraders.map((data: any, index: number) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{data.serialNo}</DataTable.Cell>
                  <DataTable.Cell
                    onPress={() => handleDeleteTraderButtonClick(data)}
                  >
                    Delete
                  </DataTable.Cell>
                  <DataTable.Cell>{data.title}</DataTable.Cell>
                  <DataTable.Cell>{data.email}</DataTable.Cell>
                  <DataTable.Cell>{data.address}</DataTable.Cell>
                  <DataTable.Cell>{data.listing}</DataTable.Cell>
                </DataTable.Row>
              ))}
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
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </>
      )}
    </React.Fragment>
  );
};

export default DashboardAdminScreen;
