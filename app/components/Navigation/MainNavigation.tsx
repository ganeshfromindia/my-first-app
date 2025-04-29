import React, { useContext, useEffect, useState } from "react";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import AuthContext from "@/store/auth-context";
import { StyleSheet, View } from "react-native";

const MainNavigation = (props: any) => {
  const [currentRole, setCurrentRole] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");

  const auth: any = useContext(AuthContext);

  useEffect(() => {
    let imagePath;
    setCurrentRole(auth.role);
    setCurrentUserName(auth.userName);
    if (auth.image) {
      imagePath = "http://localhost:5000/" + auth.image.replace(/\\/g, "/");
      // imagePath =
      //   "http://api.infoportal.co.in/" + auth.image.replace(/\\/g, "/");
      setCurrentImage(imagePath);
    }
  }, [auth]);

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  // const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  return (
    <React.Fragment>
      {/* {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />} */}
      {/* {currentRole && (
        <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
          <View style={styles.mainNavigationDrawerNav}>
            <Text
              style={styles.mainNavigationTitle}
              className="main-navigation__title"
            >
              {currentRole && currentRole === "Manufacturer" ? (
                <Link href="/(pages)/screens/dashboard/manufacturer/Manufacturer">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
              {currentRole && currentRole === "Admin" ? (
                <Link href="/(pages)/screens/dashboard/admin/Admin">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
              {currentRole && currentRole === "Trader" ? (
                <Link href="/(pages)/screens/dashboard/trader/Trader">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
            </Text>
            <NavLinks />
          </View>
        </SideDrawer>
      )} */}
      {currentRole && (
        <MainHeader>
          {/* <TouchableOpacity onPress={() => openDrawerHandler}>
            <View style={styles.mainNavigationMenuBtn}>
              <Text style={styles.mainNavigationMenuBtnSpan}></Text>
              <Text style={styles.mainNavigationMenuBtnSpan}></Text>
              <Text style={styles.mainNavigationMenuBtnSpan}></Text>
            </View>
          </TouchableOpacity> */}

          {/* main navigation  */}

          {/* {currentRole && (
            <Text style={[styles.mainNavigationTitle, styles.largeScreen]}>
              {currentRole && currentRole === "Manufacturer" ? (
                <Link href="/(pages)/screens/dashboard/manufacturer/Manufacturer">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
              {currentRole && currentRole === "Admin" ? (
                <Link href="/(pages)/screens/dashboard/admin/Admin">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
              {currentRole && currentRole === "Trader" ? (
                <Link href="/(pages)/screens/dashboard/trader/Trader">
                  <Image src={currentImage} alt={currentUserName} />
                </Link>
              ) : null}
            </Text>
          )} */}
          <View style={styles.mainNavigationHeaderNav}>
            <NavLinks />
          </View>
        </MainHeader>
      )}
    </React.Fragment>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({
  mainNavigationMenuBtn: {
    width: 3,
    height: 3,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-around",
    marginRight: 2,
    cursor: "pointer",
  },

  mainNavigationMenuBtnSpan: {
    width: 3,
    height: 2.5,
    backgroundColor: "#ffffff",
  },

  mainNavigationTitle: {
    color: "#ffffff",
    paddingHorizontal: 0,
    paddingVertical: 10,
    textAlign: "center",
  },

  mainNavigationTitlea: {
    textDecorationLine: "none",
    color: "#ffffff",
    height: "100%",
  },

  mainNavigationHeaderNav: {
    display: "none",
  },
  largeScreen: {
    display: "none",
  },

  mainNavigationDrawerNav: {
    height: "100%",
  },
});
