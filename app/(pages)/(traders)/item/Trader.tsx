import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import Input from "@/components/FormElements/Input";
import ButtonComp from "@/components/FormElements/Button";
import ErrorModal from "@/components/UIElements/ErrorModal";
import LoadingSpinner from "@/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../../../util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import "./Trader.css";
import AuthContext from "@/store/auth-context";

import { MultiSelect } from "react-native-element-dropdown";
import { MAIN_URL } from "@/util/config";
import Modal from "@/components/UIElements/Modal";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import s from "../../../../assets/css/style";

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
  const [selected, setSelected] = useState<any>([]);
  const selectInputRef = useRef<any>();
  const renderAfterCalled = useRef(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProducts, setLoadedProducts] = useState<any>();
  const [traders, setTraders] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState<any>(null);
  const [productData, setProductData] = useState();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [traderInfo, setTraderInfo] = useState<any>();
  const [traderData, setTraderData] = useState<any>();
  const [newTrader, setNewTrader] = useState(false);
  const [isDisabled, setIsDisabled] = useState<pointerEvent>(pointerEvent.auto);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  useEffect(() => {
    if (traderDataRecd) {
      setProductData(JSON.parse(JSON.stringify(traderDataRecd.products)));
      setTraderData(traderDataRecd);
    }
  }, [traderDataRecd]);

  const fetchProducts = useCallback(
    async (page: any) => {
      let defaultProductsArray;
      if (auth) {
        try {
          const response = await sendRequest(
            `${MAIN_URL}/api/products/manufacturer/id?uid=${
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
          setLoadedProducts(selectProductData);
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
            let l = defaultProductsArray.length;
            let i;
            for (i = 0; i < l; i++) {
              if (flags[defaultProductsArray[i].id]) continue;
              flags[defaultProductsArray[i].id] = true;
              output.push(defaultProductsArray[i]);
            }
            setDefaultProducts(output);
            //setLoading(false);
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
            `${MAIN_URL}/api/traders/getAllTraders/traders`,
            "GET",
            null,
            { Authorization: "Bearer " + auth.token }
          ).then((response: any) =>
            resolve(setTraders(mapOptions(response.trader)))
          );
        } catch (err) {
          reject("No data");
        }
      }
    });
  }, [sendRequest, auth.token, auth.userId]);

  const handleTraderSelect = (options: any) => {
    let defaultProductsArray;
    setTraderData(options);
    setIsDisabled(pointerEvent.none);
    if (options && loadedProducts) {
      let traderProductsArray = options &&
        options.products &&
        options.products.length > 0 && [
          ...JSON.parse(JSON.stringify(options.products)),
        ];
      if (traderProductsArray.length > 0) {
        defaultProductsArray = loadedProducts.filter((data: any) =>
          data._id.includes(...traderProductsArray)
        );
      }
      let flags = [];
      let output = [];
      let l = defaultProductsArray.length;
      let i;
      if (defaultProducts && defaultProducts.length > 0) {
        for (i = 0; i < l; i++) {
          if (flags[defaultProductsArray[i].id]) continue;
          flags[defaultProductsArray[i].id] = true;
          output.push(defaultProductsArray[i]);
        }
      }

      setDefaultProducts(output);
    }
  };

  const mapOptions = (options: any) => {
    if (options && options.length > 0) {
      return options.map((data: any) => ({
        value: data.title,
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
        products: productData,
        folder:
          "Manufacturers/" +
          auth.userName +
          "/Traders/" +
          formState.inputs.title.value,
      };

      if (traderData && traderData.id) {
        await sendRequest(
          `${MAIN_URL}/api/traders/${traderData.id}`,
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
          `${MAIN_URL}/api/traders/create`,
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
    } catch (err) {}
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
    null,
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
    if (selectInputRef && selectInputRef.current) {
      selectInputRef.current.select.clearValue();
    }
    setDefaultProducts([]);
    setIsDisabled(pointerEvent.auto);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && !traderDataRecd && (
        <View style={[s.formControl, s.placeForm, styles.searchTrader]}>
          <View style={styles.containerdd}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={traders}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={selected}
              search
              searchPlaceholder="Search..."
              onChange={(item) => {
                setSelected(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="Safety"
                  size={20}
                />
              )}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.label}</Text>
                    <AntDesign color="black" name="delete" size={17} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <Text> Or Add New Trader</Text>
          <ButtonComp
            type="button"
            onClick={handleNewTrader}
            normal={true}
            buttonfont={true}
            maxwidth={true}
          >
            ADD NEW TRADER
          </ButtonComp>
        </View>
      )}
      {!isLoading && (newTrader || traderData) && (
        <View style={s.placeForm}>
          <View pointerEvents={isDisabled}>
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
            <Input
              id="email"
              element="textarea"
              label="Email"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email."
              onInput={inputHandler}
              initialValue={traderData && traderData.email}
            />
            <Input
              id="address"
              element="address"
              label="Address"
              errorText="Please enter a address."
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              initialValue={traderData && traderData.address}
            />

            {/*loadedProducts && defaultProducts && !loading && (
            <Select
              ref={selectInputRef}
              defaultValue={defaultProducts}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={loadedProducts}
              placeholder="Select Products"
              onChange={handleMultiProductSelect}
              formatOptionLabel={(option, { context }) => {
                //  context can be either `menu` or `value`
                //   menu - dropdown
                //   value - value displayed

                return context === "value" ? option.value : option.label;
              }}
            />
          )*/}
          </View>
          {loadedProducts && defaultProducts && (
            <View>
              <View style={styles.containerdd}>
                <MultiSelect
                  ref={selectInputRef}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={loadedProducts}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Products"
                  value={defaultProducts}
                  search
                  searchPlaceholder="Search..."
                  onChange={(item) => {
                    setSelected(item);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color="black"
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
                        <Text style={styles.textSelectedStyle}>
                          {item.label}
                        </Text>
                        <AntDesign color="black" name="delete" size={17} />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          )}
          <View style={s.height25}></View>
          <ButtonComp
            type="submit"
            normal={true}
            buttonfont={true}
            maxwidth={true}
            disabled={!formState.isValid}
          >
            SAVE
          </ButtonComp>
        </View>
      )}
      <Modal
        show={open}
        onCancel={handleCloseInfo}
        header={"Trader Login Details"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <ButtonComp
            type="button"
            onClick={handleCloseInfo}
            normal={true}
            buttonfont={true}
            maxwidth={true}
          >
            CLOSE
          </ButtonComp>
        }
      >
        <View style={styles.messageContainer}>
          <Text>{traderInfo && traderInfo.username}</Text>
          <Text>{traderInfo && traderInfo.password}</Text>
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
    color: "#ff0000",
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
    color: "#ff00ff",
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: "#00ff00",
  },
  messageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  searchTrader: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 150,
    marginBottom: 10,
  },
  SearchTraderDiv: {
    flexGrow: 5,
  },
  fieldset: {
    padding: 0,
    margin: 0,
  },
});
