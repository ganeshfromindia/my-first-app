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
} from "@/util/validators";
import useForm from "@/hooks/form-hook";
import useHttpClient from "@/hooks/http-hook";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Alert,
  Button,
} from "react-native";
import ButtonComp from "../FormElements/Button";
import { AuthContext } from "@/store/auth-context";
import { useRouter, useNavigation } from "expo-router";
import globalStyle from "@/assets/css/style";
import { Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { CommonActions } from "@react-navigation/native";
import Modal from "../UIElements/Modal";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";

const AuthForm = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [scrollViewMinHeight, setScrollViewMinHeight] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(false);
  const [traderInfo, setTraderInfo] = useState<any>();
  const [aadhaarField, setAadhaarField] = useState<boolean>(false);

  const image = { uri: "../../images/bkg.jpeg" };

  const renderAfterCalled = useRef(false);
  let ScrollViewMinHeight;
  const deviceHeight = Dimensions.get("window").height;
  const headerHeight = useHeaderHeight();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      aadhaar: {
        value: "",
        isValid: true,
      },
    },
    false
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
          },
          image: {
            value: "",
            isValid: true,
          },
          mobileNo: {
            value: "",
            isValid: true,
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
          responseData.image,
          true,
          new Date(responseData.expiration)
        );
        navigation.dispatch(
          CommonActions.reset({
            routes: [
              {
                key: "(tabs)",
                name: "(tabs)",
              },
            ],
          })
        );
        if (responseData.role === "Manufacturer") {
          router.replace(
            "/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen"
          );
        } else if (responseData.role === "Admin") {
          router.replace("/(tabs)/(dashboard)/admin/dashboardAdminScreen");
        } else if (responseData.role === "Trader") {
          router.replace("/(tabs)/(dashboard)/trader/dashboardTraderScreen");
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
          responseData.image,
          true,
          new Date(responseData.expiration)
        );
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
    }
  };

  useEffect(() => {
    if (!renderAfterCalled.current) {
      ScrollViewMinHeight = deviceHeight - headerHeight;
      setScrollViewMinHeight(ScrollViewMinHeight);
    }
    renderAfterCalled.current = true;
  }, []);

  const forgotPwdPreHandler = async () => {
    let toggle = !aadhaarField;
    if (toggle) {
      setFormData({
        password: {
          value: "",
          isValid: true,
        },
      });
    } else {
      setFormData({
        aadhaar: {
          value: "",
          isValid: true,
        },
      });
    }

    setAadhaarField(toggle);
  };
  const forgotPwdHandler = async () => {
    let email = formState.inputs.email.value;
    let aadhaar = formState.inputs.aadhaar.value;
    if (!email || email == null || !aadhaar || aadhaar == null) {
      Alert.alert(
        "Forgot Password",
        "Please enter Email and Aadhaar number",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );
      return;
    }
    if (!aadhaarField) return;
    try {
      const formData = { email: email, aadhaar: aadhaar };
      const responseData = await sendRequest(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/forgotPassword`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        }
      );
      setOpen(true);
      setTraderInfo({
        password:
          "Password is reset as: " +
          responseData.password +
          "Please change it in Profile page",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseInfo = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner asOverlay />}
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
                  <Text
                    style={[
                      globalStyle.defaultFont,
                      styles.authenticationFormH3,
                    ]}
                  >
                    {/* {isLoginMode ? "Login here" : "Please SignUp"} */}
                    "Login here"
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
                  {!aadhaarField && (
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
                      secure={true}
                    />
                  )}
                  {aadhaarField && (
                    <Input
                      key={"aadhaar"}
                      id="aadhaar"
                      element="aadhaar"
                      label="Aadhaar"
                      errorText="Please enter a aadhaar."
                      onInput={inputHandler}
                      validators={[VALIDATOR_REQUIRE()]}
                      authInput={true}
                      authLabel={true}
                      authGeneral={true}
                      secure={true}
                    />
                  )}
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
                  {!aadhaarField && (
                    <View style={styles.authenticationButton}>
                      <ButtonComp
                        mode={true}
                        normal={true}
                        buttonfont={true}
                        maxwidth={true}
                        submit
                        disabled={!formState.isValid}
                        onClick={authSubmitHandler}
                        // title={isLoginMode ? "Login" : "Sign Up"}
                        title="Login"
                      ></ButtonComp>
                    </View>
                  )}
                  {aadhaarField && (
                    <View style={styles.authenticationButton}>
                      <ButtonComp
                        mode={true}
                        normal={true}
                        buttonfont={true}
                        maxwidth={true}
                        submit
                        disabled={!formState.isValid}
                        onClick={forgotPwdHandler}
                        // title={isLoginMode ? "Login" : "Sign Up"}
                        title="Submit"
                      ></ButtonComp>
                    </View>
                  )}
                  {!aadhaarField && (
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        width: "100%",
                        paddingEnd: 7,
                        paddingTop: 15,
                      }}
                    >
                      <TouchableOpacity onPress={forgotPwdPreHandler}>
                        <ThemedText>Forgot Password</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {aadhaarField && (
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        width: "100%",
                        paddingEnd: 7,
                        paddingTop: 15,
                      }}
                    >
                      <TouchableOpacity onPress={forgotPwdPreHandler}>
                        <ThemedText>Switch to Login</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {/* <View style={[styles.authenticationButton, styles.top]}>
                  <ButtonComp
                    mode={true}
                    normal={true}
                    buttonfont={true}
                    maxwidth={true}
                    inverse
                    onClick={switchModeHandler}
                    title={`Switch To ${isLoginMode ? "Sign Up" : "Login"}`}
                  ></ButtonComp>
                </View> */}
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
    width: "auto",
    marginLeft: -5,
    marginRight: -5,
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
  messageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
