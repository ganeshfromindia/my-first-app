import React, { useState, useContext, useEffect, useCallback } from "react";
import Input from "@/components/FormElements/Input";
import ButtonComp from "@/components/FormElements/Button";
import ErrorModal from "@/components/UIElements/ErrorModal";
import LoadingSpinner from "@/components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE } from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";
import AuthContext from "@/store/auth-context";
import s from "@/assets/css/style";
import { View } from "react-native";

const DashboardTraderScreen = (props: any) => {
  const [traderData, setTraderData] = useState<any>();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const TraderDashboardSubmitHandler = async (event: any) => {
    event.preventDefault();
    try {
      const formData = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
      };
      if (traderData && traderData.id) {
        await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/updateTraderDetails//${traderData.id}`,
          "PATCH",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
      } else {
        await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/createTraderDetails`,
          "POST",
          JSON.stringify(formData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        ).then((data: any) => {
          setTraderData(data.traderDashboard);
        });
      }
    } catch (err) {}
  };

  const fetchTraderDashboardData = useCallback(async () => {
    if (auth.token && auth.userId) {
      try {
        const response = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/traders/traderDashboardData/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (response.trader) {
          setTraderData(response.trader[0]);
        }
      } catch (err) {}
    }
  }, [auth.token, auth.userId, sendRequest]);

  useEffect(() => {
    if (auth.userId) {
      fetchTraderDashboardData();
    }
  }, [fetchTraderDashboardData, auth.userId]);

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
    false,
    false
  );

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <View style={s.placeForm}>
          <Input
            key={traderData && traderData.title + "title"}
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
            key={traderData && traderData.description + "description"}
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a description."
            onInput={inputHandler}
            initialValue={traderData && traderData.description}
          />
          <Input
            key={traderData && traderData.address + "address"}
            id="address"
            element="address"
            label="Address"
            errorText="Please enter a address."
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={traderData && traderData.address}
          />

          <View style={s.height25}></View>
          <ButtonComp
            onClick={TraderDashboardSubmitHandler}
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

export default DashboardTraderScreen;
