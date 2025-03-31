import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// let logoutTimer;

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

const useAuth = () => {
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
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<any | null>();
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [mobileNo, setMobileNo] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const login = useCallback(
    async (
      uid: number | null,
      token: string | null,
      username: string | null,
      mobileNo: number | null,
      role: string | null,
      email: string | null,
      image: string | null,
      expirationDate: any | null
    ) => {
      setToken(token);
      setUserId(uid);
      setUserName(username);
      setMobileNo(mobileNo);
      setEmail(email);
      setRole(role);
      setImage(image);
      // const tokenExpirationDate =
      //   expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      // setTokenExpirationDate(tokenExpirationDate);
      try {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            userId: uid,
            token: token,
            userName: username,
            mobileNo: mobileNo,
            role: role,
            email: email,
            image: image,
          })
        );
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUserName(null);
    setMobileNo(null);
    setEmail(null);
    setRole(null);
    setImage(null);
    try {
      await AsyncStorage.removeItem("userData");
    } catch (err) {
      console.log(err);
    }
    // window.location.href = "/auth";
  }, []);

  // useEffect(() => {
  //   if (token && tokenExpirationDate) {
  //     const remainingTime =
  //       tokenExpirationDate.getTime() - new Date().getTime();
  //     logoutTimer = setTimeout(logout, remainingTime);
  //   } else {
  //     clearTimeout(logoutTimer);
  //   }
  // }, [token, logout, tokenExpirationDate]);

  const retrieveData = useCallback(async () => {
    const storedData: UserDataType | string =
      (await AsyncStorage.getItem("userData")) || initialUserData;
    storedData != null ? JSON.parse(JSON.stringify(storedData)) : null;
    if (
      storedData !== null &&
      typeof storedData === "object" &&
      storedData.token
      // &&  new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.userName,
        storedData.mobileNo,
        storedData.role,
        storedData.email,
        storedData.image,
        new Date(storedData.expiration)
      );
    }
  }, []);

  useEffect(() => {
    retrieveData();
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
    userName,
    email,
    mobileNo,
    role,
    image,
  };
};

export default useAuth;
