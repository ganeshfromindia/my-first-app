import { startTransition, useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import AuthContext from "../../store/auth-context";

import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserDataType {
  token: string | null;
  userId: number | null;
  userName: string | null;
  email: string | null;
  mobileNo: number | null;
  role: string | null;
  image: string | null;
  expiration: any | null;
}

function AuthStack() {
  return <Redirect href="/authScreen" />;
}

function AuthenticatedStack() {
  const auth = useContext(AuthContext);

  if (auth && auth.token) {
    if (auth.role == "Manufacturer") {
      return (
        <Redirect href="/(tabs)/(dashboard)/manufacturer/dashboardManufacturerScreen" />
      );
    } else if (auth.role == "Trader") {
      return (
        <Redirect href="/(tabs)/(dashboard)/trader/dashboardTraderScreen" />
      );
    } else if (auth.role == "Admin") {
      <Redirect href="/(tabs)/(dashboard)/admin/dashboardAdminScreen" />;
    }
  }
}

const retrieveData = async () => {
  const initialUserData: UserDataType = {
    token: null,
    userId: null,
    userName: null,
    email: null,
    mobileNo: null,
    role: null,
    image: null,
    expiration: null,
  };
  const authCtx = useContext(AuthContext);
  const storedData: UserDataType | string =
    (await AsyncStorage.getItem("userData")) || initialUserData;
  storedData != null ? JSON.parse(JSON.stringify(storedData)) : null;
  if (
    storedData !== null &&
    typeof storedData === "object" &&
    storedData.token
    // &&  new Date(storedData.expiration) > new Date()
  ) {
    authCtx.login(
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
  async function callData() {
    return await retrieveData();
  }
  callData().then(() => {
    const authCtx = useContext(AuthContext);
    return !authCtx.isLoggedIn ? <AuthStack /> : <AuthenticatedStack />;
  });
  return <AuthStack />;
}

function Root(): any {
  SplashScreen.preventAutoHideAsync();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = authCtx.token;

      if (storedToken) {
        authCtx.isLoggedIn = true;
      }
    }

    fetchToken();
  }, []);

  if (authCtx.isLoggedIn) {
    return startTransition(() => {
      SplashScreen.hideAsync();
    });
  }

  return <Navigation />;
}

export default function PagesLayout() {
  return <Root />;
}
