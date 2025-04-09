import { startTransition, useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import AuthContext from "../../store/auth-context";

import { Redirect } from "expo-router";

function AuthStack() {
  return <Redirect href="/authScreen" />;
}

function AuthenticatedStack() {
  const auth = useContext(AuthContext);

  if (auth && auth.token) {
    if (auth.role == "Manufacturer") {
      return <Redirect href="/(pages)/(traders)/list/TradersList" />;
    } else if (auth.role == "Trader") {
      return <Redirect href="/(pages)/(traders)/list/TradersList" />;
    } else if (auth.role == "Admin") {
      <Redirect href="/(pages)/(dashboard)/admin/dashboardAdminScreen" />;
    }
  }
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return !authCtx.isLoggedIn ? <AuthStack /> : <AuthenticatedStack />;
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
