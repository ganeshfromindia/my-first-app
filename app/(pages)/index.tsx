import { startTransition, useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import AuthContext from "../../store/auth-context";

import { Redirect } from "expo-router";
import useAuth from "@/hooks/auth-hook";

function AuthStack() {
  return <Redirect href="/authScreen" />;
}

function AuthenticatedStack() {
  return <Redirect href="/welcomeScreen" />;
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
