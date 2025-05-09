import React, { useCallback, useContext, useEffect, useState } from "react";
import { MultiSelect } from "react-native-element-dropdown";

import Input from "../../../components/FormElements/Input";
import ButtonComp from "../../../components/FormElements/Button";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import ImageUpload from "../../../components/FormElements/ImageUpload";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import { AuthContext } from "@/store/auth-context";
import { AntDesign } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import globalStyle from "@/assets/css/style";

const Product = ({
  productdata,
  handleClose,
}: {
  productdata: any;
  handleClose: any;
}) => {
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
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
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
    { value: "IP", label: "Indian Pharmacopoeia", selectedLabel: "IP" },
    { value: "BP", label: "British Pharmacopoeia", selectedLabel: "BP" },
    { value: "USP", label: "US Pharmacopoeia", selectedLabel: "USP" },
    { value: "JP", label: "Japanese Pharmacopoeia", selectedLabel: "JP" },
    { value: "EP", label: "European Pharmacopoeia", selectedLabel: "EP" },
    { value: "InHouse", label: "In House", selectedLabel: "In House" },
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

  const handleDownloadButtonClick = useCallback(
    (event: any) => {
      const fileReader = new FileReader();
      let userData = sessionStorage.getItem("userData");
      let fileWithPath = event.target.value;
      sendRequest(
        `${process.env.EXPO_PUBLIC_API_URL}/api/download?file=${fileWithPath}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + JSON.parse(userData || "").token,
          responseType: "blob",
        }
      )
        .then((res: any) => {
          fileReader.readAsDataURL(new Blob([res]));
        })
        .catch((err: any) => console.log(err));
      let currentFilename = fileWithPath.split("/").pop();
      fileReader.addEventListener("loadend", () => {
        const blobString = fileReader.result;
        const link: any = document.createElement("a");
        link.href = blobString;
        link.setAttribute("download", currentFilename);
        document.body.appendChild(link);
        link.click();
      });
    },
    [sendRequest]
  );

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
    null,
    null
  );

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && pageData && (
        <View style={globalStyle.placeForm}>
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
          <ImageUpload
            id="image"
            onInput={inputHandler}
            errorText="Please provide an product image."
            data={(pageData && pageData.image) || null}
          />
          {pageData && pageData.image ? (
            <ButtonComp
              type="ButtonComp"
              value={pageData.image}
              onClick={(e: any) => handleDownloadButtonClick(e)}
              title="Download Product Image"
            ></ButtonComp>
          ) : null}
          <ImageUpload
            id="coa"
            onInput={inputHandler}
            errorText="Please provide sample COA."
            data={(pageData && pageData.coa) || null}
          />
          {pageData && pageData.coa ? (
            <ButtonComp
              type="ButtonComp"
              value={pageData.coa}
              onClick={(e: any) => handleDownloadButtonClick(e)}
              title="Download COA"
            ></ButtonComp>
          ) : null}
          <ImageUpload
            id="msds"
            onInput={inputHandler}
            errorText="Please provide an MSDS."
            data={(pageData && pageData.msds) || null}
          />

          {pageData && pageData.msds ? (
            <ButtonComp
              type="ButtonComp"
              value={pageData.msds}
              onClick={(e: any) => handleDownloadButtonClick(e)}
              title="Download MSDS"
            ></ButtonComp>
          ) : null}
          <ImageUpload
            id="cep"
            onInput={inputHandler}
            errorText="Please provide a Certificate of Suitability."
            data={(pageData && pageData.cep) || null}
          />
          {pageData && pageData.cep ? (
            <ButtonComp
              type="ButtonComp"
              value={pageData.cep}
              onClick={(e: any) => handleDownloadButtonClick(e)}
              title="Download Certificate of Suitability"
            ></ButtonComp>
          ) : null}
          <ImageUpload
            id="qos"
            onInput={inputHandler}
            errorText="Please provide an Quality Overall Summary."
            data={(pageData && pageData.qos) || null}
          />
          {pageData && pageData.qos ? (
            <ButtonComp
              type="button"
              value={pageData.qos}
              onClick={(e: any) => handleDownloadButtonClick(e)}
              title="Download Quality Overall Summary"
            ></ButtonComp>
          ) : null}
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
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
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
                color="black"
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
                  <AntDesign color="black" name="delete" size={17} />
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
            search
            data={optionsPharamacopoeia}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={pharmacopoeiaData}
            searchPlaceholder="Search..."
            onChange={(item) => {
              setPharmacopoeiaData(item);
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
                  <Text
                    style={[
                      styles.textSelectedStyle,
                      globalStyle.defaultFont,
                      { color: "#000000" },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <AntDesign color="black" name="delete" size={17} />
                </View>
              </TouchableOpacity>
            )}
          />

          <View className="height25"></View>
          <ButtonComp
            onClick={productSubmitHandler}
            normal={true}
            buttonfont={true}
            maxwidth={true}
            disabled={!formState.isValid}
            title="SAVE"
          ></ButtonComp>
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
