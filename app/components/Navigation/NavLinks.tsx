import React, { useContext, useEffect, useState } from "react";
import { Link } from "expo-router";

import AuthContext from "@/store/auth-context";
import { View, Text, StyleSheet } from "react-native";

import globalStyle from "@/assets/css/style";
import ButtonComp from "../FormElements/Button";

const NavLinks = (props: any) => {
  const auth: any = useContext(AuthContext);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    setCurrentRole(auth.role);
  }, [auth]);
  return (
    <View
      style={[{ display: "flex", flexDirection: "row" }, globalStyle.navLink]}
    >
      {((auth.isLoggedIn && currentRole === "Manufacturer") ||
        (auth.isLoggedIn && currentRole === "Trader")) && (
        <View
          style={[
            { display: "flex", flexDirection: "column" },
            globalStyle.navLinkli,
          ]}
        >
          {/* <Link href="/(pages)/screens/products/list/ProductsList">
            <ButtonComp inverse={true}>Products</ButtonComp>
          </Link> */}
        </View>
      )}
      {auth.isLoggedIn && currentRole === "Manufacturer" && (
        <View
          style={[
            { display: "flex", flexDirection: "column" },
            globalStyle.navLink,
          ]}
        >
          <Link href="/(tabs)/(dashboard)/trader/dashboardTraderScreen">
            <ButtonComp inverse={true}>Traders</ButtonComp>
          </Link>
        </View>
      )}
      {/* {!auth.isLoggedIn && (
        <View style={[{ display: "flex", flexDirection: "column" }, style]}>
          <Link to="/auth">AUTHENTICATE</Link>
        </View>>
      )} */}
      {auth.isLoggedIn && (
        <View
          style={[
            { display: "flex", flexDirection: "column" },
            globalStyle.navLink,
          ]}
        >
          <ButtonComp onClick={auth.logout} inverse={true}>
            Logout
          </ButtonComp>
        </View>
      )}
    </View>
  );
};

export default NavLinks;
