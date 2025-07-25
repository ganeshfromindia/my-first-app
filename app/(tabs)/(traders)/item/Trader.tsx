import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import Input from "../../../components/FormElements/Input";
import ButtonComp from "../../../components/FormElements/Button";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import { AuthContext } from "@/store/auth-context";

import { MultiSelect, Dropdown } from "react-native-element-dropdown";
import Modal from "../../../components/UIElements/Modal";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import s from "@/assets/css/style";

import globalStyle from "@/assets/css/style";

import { Colors } from "@/constants/Colors";

enum pointerEvent {
  none = "none",
  auto = "auto",
  boxOnly = "box-only",
  boxNone = "box-none",
}

const Trader = ({
  traderDataRecd,
  handleClose,
}: {
  traderDataRecd: any;
  handleClose: any;
}) => {
  const [selected, setSelected] = useState<any>(null);
  const [isFocus, setIsFocus] = useState<any>(false);
  const renderAfterCalled = useRef(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProducts, setLoadedProducts] = useState<any>();
  const [traders, setTraders] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState<string[]>([]);
  const [productData, setProductData] = useState();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [traderInfo, setTraderInfo] = useState<any>();
  const [traderData, setTraderData] = useState<any>();
  const [newTrader, setNewTrader] = useState(false);
  const [isDisabled, setIsDisabled] = useState<pointerEvent>(pointerEvent.auto);
  const [isEmailDisabled, setIsEmailDisabled] = useState<pointerEvent>(
    pointerEvent.auto
  );

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
    if (traderDataRecd) {
      setTraderData(traderDataRecd);
      setIsEmailDisabled(pointerEvent.none);
      const selectedProducts = traderDataRecd.products;
      setDefaultProducts(selectedProducts || []);
    }
  }, [traderDataRecd]);

  useEffect(() => {
    if (selected) {
      setDefaultProducts([]);
      setIsDisabled(pointerEvent.none);
      setTraderData(selected.data);
      formState.inputs.title.isValid = true;
      formState.inputs.email.isValid = true;
      formState.inputs.address.isValid = true;
      formState.isValid = true;
    }
  }, [selected]);

  const fetchProducts = useCallback(
    async (page: any) => {
      let defaultProductsArray;
      if (auth) {
        try {
          const response = await sendRequest(
            `${
              process.env.EXPO_PUBLIC_API_URL
            }/api/products/manufacturer/id?uid=${
              auth.userId
            }&page=${page}&size=${1000}&delay=1`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          const selectProductData = response.products.map(
            (object: any, index: number) => ({
              ...object,
              label: object.title,
              value: object.title,
              key: index,
            })
          );
          setLoadedProducts(mapOptions(selectProductData));
          if (traderDataRecd && selectProductData) {
            let traderProductsArray = traderDataRecd &&
              traderDataRecd.products &&
              traderDataRecd.products.length > 0 && [
                ...JSON.parse(JSON.stringify(traderDataRecd.products)),
              ];
            if (traderProductsArray.length > 0) {
              defaultProductsArray = selectProductData.filter((data: any) =>
                traderProductsArray.includes(data._id.toString())
              );
            }
            let flags = [];
            let output = [];
            let l = defaultProductsArray && defaultProductsArray.length;
            let i;
            for (i = 0; i < l; i++) {
              if (flags[defaultProductsArray[i].id]) continue;
              flags[defaultProductsArray[i].id] = true;
              output.push(defaultProductsArray[i]);
            }
            let valuesOfDefaultProducts =
              output &&
              mapOptions(output) &&
              mapOptions(output).map((data: any) => data.value);
            setDefaultProducts(valuesOfDefaultProducts || []);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    [sendRequest, auth, traderDataRecd]
  );

  const fetchTraders = useCallback(() => {
    new Promise((resolve, reject) => {
      if (auth.token && auth.userId) {
        try {
          sendRequest(
            `${process.env.EXPO_PUBLIC_API_URL}/api/traders/getAllTraders/traders`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          ).then((response: any) => {
            if (response.trader && response.trader.length > 0) {
              resolve(setTraders(mapOptions(response.trader)));
            } else {
              resolve("No trader data");
            }
          });
        } catch (err) {
          reject("No data");
        }
      }
    });
  }, [sendRequest, auth.token, auth.userId]);

  const mapOptions = (options: any) => {
    if (options && options.length > 0) {
      return options.map((data: any) => ({
        data: data,
        value: data.id,
        key: data.id,
        label: data.title,
      }));
    }
  };

  const traderSubmitHandler = async (event: any) => {
    event.preventDefault();
    try {
      const formData: any = {
        title: formState.inputs.title.value,
        email: formState.inputs.email.value,
        address: formState.inputs.address.value,
        products: defaultProducts,
        folder:
          "Manufacturers/" +
          auth.userName +
          "/Traders/" +
          formState.inputs.title.value,
      };
      if (traderData && traderData.id) {
        await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/${traderData.id}`,
          "PATCH",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        handleClose();
      } else {
        const responseData = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/create`,
          "POST",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setOpen(true);
        setTraderInfo({
          username: "Username is " + responseData.trader.email,
          password: "And Password is " + responseData.password,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMultiProductSelect = (options: any) => {
    if (options) {
      const selectedProducts = options.map((data: any) => data._id);
      setProductData(selectedProducts);
    }
  };

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      address: {
        value: null,
        isValid: true,
      },
      products: {
        value: null,
        isValid: true,
      },
    },
    null
  );

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchProducts(1);
      fetchTraders();
    }
    renderAfterCalled.current = true;
  }, [fetchProducts, fetchTraders]);

  const handleCloseInfo = () => {
    setOpen(false);
    handleClose();
  };

  const handleNewTrader = () => {
    setNewTrader(true);
    formState.inputs.title.isValid = false;
    formState.inputs.email.isValid = false;
    formState.inputs.address.isValid = false;
    formState.isValid = false;
    setDefaultProducts([]);
    setIsDisabled(pointerEvent.auto);
    setIsEmailDisabled(pointerEvent.auto);

    setTraderData({
      address: "",
      email: "",
      id: "",
      label: "",
      manufacturer: "",
      products: [],
      title: "",
      value: "",
    });
    setSelected(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <View>
        {!isLoading && !traderDataRecd && (
          <View style={[s.formControl, s.placeForm, styles.searchTrader]}>
            <View style={styles.containerdd}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && { borderColor: Colors.light.tint, borderWidth: 1 },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                activeColor="#f3e3cc"
                data={traders}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select Trader" : "..."}
                value={selected}
                search
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                searchPlaceholder="Search..."
                onChange={(item) => {
                  setSelected(item);
                  setIsFocus(false);
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
              />
            </View>
            <Text
              style={[
                globalStyle.defaultFont,
                { paddingHorizontal: 12, paddingVertical: 5 },
              ]}
            >
              Or Add New Trader
            </Text>
            <View style={{ width: 200, margin: "auto" }}>
              <ButtonComp
                onClick={handleNewTrader}
                normal={true}
                buttonfont={true}
                maxwidth={true}
                title="ADD NEW TRADER"
              ></ButtonComp>
            </View>
          </View>
        )}
        {!isLoading && (newTrader || traderData) && (
          <View style={[s.formControl, s.placeForm, styles.searchTrader]}>
            <View style={styles.containerdd} pointerEvents={isDisabled}>
              <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={traderData && traderData.title}
              />
              <View pointerEvents={isEmailDisabled}>
                <Input
                  id="email"
                  element="input"
                  label="Email"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="Please enter a valid email."
                  onInput={inputHandler}
                  initialValue={traderData && traderData.email}
                />
              </View>
              <Input
                id="address"
                element="input"
                label="Address"
                errorText="Please enter a address."
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={traderData && traderData.address}
              />
            </View>
            <View>
              {loadedProducts && (
                <View style={styles.containerMultiSelect}>
                  <MultiSelect
                    mode="modal"
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    activeColor="#f3e3cc"
                    search
                    data={loadedProducts}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Products"
                    value={defaultProducts}
                    searchPlaceholder="Search..."
                    onChange={(item) => {
                      setDefaultProducts(item);
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
                      <TouchableOpacity
                        onPress={() => unSelect && unSelect(item)}
                      >
                        <View style={styles.selectedStyle}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                globalStyle.defaultFont,
                                styles.textSelectedStyle,
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
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              <View style={{ width: 100, margin: "auto" }}>
                <ButtonComp
                  normal={true}
                  buttonfont={true}
                  maxwidth={true}
                  disabled={!formState.isValid}
                  onClick={traderSubmitHandler}
                  title="SAVE"
                ></ButtonComp>
              </View>
            </View>
          </View>
        )}
      </View>
      <Modal
        show={open}
        onCancel={handleCloseInfo}
        header={"Trader Login Details"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
      >
        <View style={styles.messageContainer}>
          <Text style={globalStyle.defaultFont}>
            {traderInfo && traderInfo.username}
          </Text>
          <Text style={globalStyle.defaultFont}>
            {traderInfo && traderInfo.password}
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
            onClick={handleCloseInfo}
            normal={true}
            buttonfont={true}
            maxwidth={true}
            title="CLOSE"
          ></ButtonComp>
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default Trader;

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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    /*
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    */
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
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
