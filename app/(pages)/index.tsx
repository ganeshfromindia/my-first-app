import { startTransition, useContext, useEffect } from "react";

import { AuthContext } from "../../store/auth-context";

import { useRouter, useFocusEffect, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

function AuthStack() {
  const router = useRouter();

  useFocusEffect(() => {
    // Redirect to /about
    router.replace("/authScreen");
  });

  return null;
  //return <Redirect href="/authScreen" />;
}

function AuthenticatedStack() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const navigation = useNavigation();
  useFocusEffect(() => {
    if (auth && auth.token) {
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
      if (auth.role == "Manufacturer") {
        router.replace(
          "/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen"
        );

        // return (
        //   <Redirect href="/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen" />
        // );
      }
      // else if (auth.role == "Trader") {
      //   return (
      //     <Redirect href="/(tabs)/(dashboard)/trader/dashboardTraderScreen" />
      //   );
      // } else if (auth.role == "Admin") {
      //   return <Redirect href="/(tabs)/(dashboard)/admin/dashboardAdminScreen" />;
      // }
    }
  });
  return null;
}

const retrieveData = async () => {
  const initialUserData: any = {
    token: null,
    userId: null,
    userName: null,
    email: null,
    mobileNo: null,
    role: null,
    image: null,
    expiration: null,
  };
  const auth = useContext(AuthContext);
  let storedData: any =
    (await AsyncStorage.getItem("userData")) || initialUserData;
  storedData != null ? JSON.parse(storedData) : null;
  storedData = JSON.parse(storedData);
  if (
    storedData !== null &&
    typeof storedData === "object" &&
    storedData.token
    // &&  new Date(storedData.expiration) > new Date()
  ) {
    auth.login(
      storedData.userId,
      storedData.token,
      storedData.userName,
      storedData.mobileNo,
      storedData.role,
      storedData.email,
      storedData.image,
      true,
      new Date(storedData.expiration)
    );
  }
};

function Navigation() {
  retrieveData();
  let authCtx = useContext(AuthContext);
  return !authCtx.isLoggedIn ? <AuthStack /> : <AuthenticatedStack />;
}

function Root(): any {
  return <Navigation />;
}

export default function PagesLayout() {
  return <Root />;
}
