import React, { useState, useContext, useEffect, useCallback } from "react";
import Input from "../../../components/FormElements/Input";
import ButtonComp from "../../../components/FormElements/Button";
import ErrorModal from "../../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../../components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE } from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import { Text, View } from "react-native";
import s from "@/assets/css/style";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Card from "../../../components/UIElements/Card";

const DashboardManufacturerScreen = (props: any) => {
  const [manufacturerData, setManufacturerData] = useState<any>();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const manufacturerDashboardSubmitHandler = async (event: any) => {
    event.preventDefault();
    try {
      const formData = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
      };
      if (manufacturerData && manufacturerData.id) {
        await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/manufacturers/${manufacturerData.id}`,
          "PATCH",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        ).then((data: any) => {
          setManufacturerData(data.manufacturer);
        });
      } else {
        await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/manufacturers/create`,
          "POST",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        ).then((data: any) => {
          setManufacturerData(data.manufacturer);
        });
      }
    } catch (err) {}
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
        if (response.manufacturer) {
          setManufacturerData(response.manufacturer[0]);
        }
      } catch (err) {}
    }
  }, [auth.token, auth.userId, sendRequest]);

  useEffect(() => {
    if (auth.userId) {
      fetchManufacturerDashboardData();
    }
  }, [fetchManufacturerDashboardData, auth.userId]);

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
      address: {
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
      {!isLoading && (
        <Card cardProduct center>
          <View style={[s.placeForm, { padding: 12 }]}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={manufacturerData && manufacturerData.title}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a description."
              onInput={inputHandler}
              initialValue={manufacturerData && manufacturerData.description}
            />
            <Input
              id="address"
              element="textarea"
              label="Address"
              errorText="Please enter a address."
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              initialValue={manufacturerData && manufacturerData.address}
            />

            <View style={s.height25}></View>
            <ButtonComp
              onClick={manufacturerDashboardSubmitHandler}
              normal={true}
              buttonfont={true}
              maxwidth={true}
              disabled={!formState.isValid}
              title="SAVE"
            ></ButtonComp>
          </View>
        </Card>
      )}
    </React.Fragment>
  );
};

export default DashboardManufacturerScreen;
