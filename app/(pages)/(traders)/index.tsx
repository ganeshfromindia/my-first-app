import { startTransition, useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import AuthContext from "../../../store/auth-context";

import { Redirect } from "expo-router";
import TradersList from "./list/TradersList";

export default function IndexTradersLayout() {
  return <TradersList />;
}
