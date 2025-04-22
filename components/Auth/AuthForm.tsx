import React, { useState, useContext, useEffect, useRef } from "react";

import Card from "../UIElements/Card";
import Input from "../FormElements/Input";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ImageUpload from "../FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";

import { StyleSheet, Text, View, ScrollView, StatusBar } from "react-native";
import ButtonComp from "../FormElements/Button";
import AuthContext from "@/store/auth-context";
import { useRouter } from "expo-router";
import globalStyle from "@/assets/css/style";
import { Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

const AuthForm = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [scrollViewMinHeight, setScrollViewMinHeight] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const image = { uri: "../../images/bkg.jpeg" };

  const renderAfterCalled = useRef(false);
  let ScrollViewMinHeight;
  const deviceHeight = Dimensions.get("window").height;
  const headerHeight = useHeaderHeight();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: true,
        isTouched: false,
      },
      password: {
        value: "",
        isValid: true,
        isTouched: false,
      },
    },
    null,
    null
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          mobileNo: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: true,
            isTouched: false,
          },
          image: {
            value: null,
            isValid: true,
            isTouched: false,
          },
          mobileNo: {
            value: null,
            isValid: true,
            isTouched: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: any) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.name,
          responseData.mobileNo,
          responseData.role,
          responseData.email,
          responseData.image
        );
        console.log(responseData.role);
        if (responseData.role === "Manufacturer") {
          router.navigate(
            "/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen"
          );
        } else if (responseData.role === "Admin") {
          router.navigate("/(tabs)/(dashboard)/admin/dashboardAdminScreen");
        } else if (responseData.role === "Trader") {
          router.navigate("/(tabs)/(dashboard)/trader/dashboardTraderScreen");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();

        formData.append(
          "folder",
          "Manufacturers/" + formState.inputs.name.value + "/Users"
        );
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("mobileNo", formState.inputs.mobileNo.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", {
          uri: formState.inputs.image.value.uri,
          name: formState.inputs.image.value.name,
          type: "image/jpeg",
        } as any);
        const responseData = await sendRequest(
          `${process.env.EXPO_PUBLIC_API_URL}/api/users/signup`,
          "POST",
          formData
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.name,
          responseData.mobileNo,
          responseData.role,
          responseData.email,
          responseData.image
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (!renderAfterCalled.current) {
      ScrollViewMinHeight = deviceHeight - headerHeight;
      setScrollViewMinHeight(ScrollViewMinHeight);
    }
    renderAfterCalled.current = true;
  }, []);

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {/* {isLoading && <LoadingSpinner asOverlay />} */}
      {!isLoading && (
        <View>
          <ScrollView
            contentContainerStyle={{
              minHeight: scrollViewMinHeight,
              overflow: "scroll",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <View style={styles.authenticationContainer}>
              <Card style={[styles.authentication, styles.authenticationCard]}>
                <View style={styles.authenticationForm}>
                  <Text style={styles.authenticationFormH3}>
                    {isLoginMode ? "Login here" : "Please SignUp"}
                  </Text>
                  {!isLoginMode && (
                    <Input
                      element="input"
                      id="name"
                      type="text"
                      label="Your Name"
                      errorText="Please enter a name."
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                      authInput={true}
                      authLabel={true}
                      authGeneral={true}
                    />
                  )}
                  {!isLoginMode && (
                    <ImageUpload
                      center
                      id="image"
                      onInput={inputHandler}
                      errorText="Please provide an image."
                    />
                  )}
                  <Input
                    element="input"
                    id="email"
                    type="text"
                    label="E-Mail"
                    errorText="Please enter a valid email address."
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                    onInput={inputHandler}
                    authInput={true}
                    authLabel={true}
                    authGeneral={true}
                  />
                  <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid password, at least 6 characters."
                    onInput={inputHandler}
                    authInput={true}
                    authLabel={true}
                    authGeneral={true}
                  />
                  {!isLoginMode && (
                    <Input
                      element="input"
                      id="mobileNo"
                      type="text"
                      label="Mobile No"
                      validators={[
                        VALIDATOR_REQUIRE(),
                        VALIDATOR_MINLENGTH(10),
                      ]}
                      errorText="Please enter a valid mobile no, at least 10 characters."
                      onInput={inputHandler}
                      authInput={true}
                      authLabel={true}
                      authGeneral={true}
                    />
                  )}
                  <View style={styles.authenticationButton}>
                    <ButtonComp
                      mode={true}
                      normal={true}
                      buttonfont={true}
                      maxwidth={true}
                      submit
                      disabled={!formState.isValid}
                      onClick={authSubmitHandler}
                      title={isLoginMode ? "Login" : "Sign Up"}
                    ></ButtonComp>
                  </View>
                </View>
                <View style={[styles.authenticationButton, styles.top]}>
                  <ButtonComp
                    mode={true}
                    normal={true}
                    buttonfont={true}
                    maxwidth={true}
                    inverse
                    onClick={switchModeHandler}
                    title={`Switch To ${isLoginMode ? "Sign Up" : "Login"}`}
                  ></ButtonComp>
                </View>
              </Card>
            </View>
            <View style={globalStyle.rowContainer}>
              <View style={globalStyle.autoFlex}>
                <ButtonComp href={"https://picjumbo.com/author/viktorhanacek/"}>
                  Photo by Viktor Hanacek
                </ButtonComp>
              </View>
              <View style={globalStyle.autoFlex}>
                <ButtonComp href={"https://picjumbo.com"}>
                  picjumbo.com
                </ButtonComp>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </React.Fragment>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  authenticationHeader: {
    color: "#ffffff",
    textAlign: "center",
  },

  authenticationContainer: {
    paddingVertical: 5,
  },
  authentication: {
    width: "80%",
    maxWidth: "80%",
    marginHorizontal: "auto",
    marginVertical: 0,
    textAlign: "center",
    position: "relative",
  },
  authenticationCard: {
    boxShadow: "none",
    paddingTop: 50,
    borderRadius: 17,
  },
  authenticationForm: {
    marginVertical: 18,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.13)",
    borderRadius: 10,
    backdropFilter: "blur(10px)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    boxShadow: "0 0 40px rgba(8, 7, 16, 0.6)",
    paddingHorizontal: 35,
    paddingVertical: 50,
  },
  authenticationFormH3: {
    fontSize: 25,
    fontWeight: 500,
    lineHeight: 42,
    textAlign: "center",
    color: "#ffffff",
  },
  authenticationPlaceholder: {
    color: "#e5e5e5",
  },
  authenticationButton: {
    marginTop: 50,
    width: "100%",
  },
  authenticationContainerImageUploadCenter: {
    borderColor: "#465f66",
    borderWidth: 1,
  },

  authenticationContainerInputWebkitAutofill: {
    transitionProperty: "backgroundColor color",
    transitionDuration: "600000s",
    transitionDelay: "0s",
  },
  authenticationContainerInputWebkitAutofillFocus: {
    transitionProperty: "backgroundColor color",
    transitionDuration: "600000s",
    transitionDelay: "0s",
  },
  photBySpan: {
    color: "#f4ad62",
  },
  photByA: {
    color: "#f4ad62",
  },
  mainContainer: {
    paddingTop: 16,
    height: "100%",
  },
  top: {
    position: "absolute",
    top: 0,
    left: "26.5%",
    width: 150,
  },
});
