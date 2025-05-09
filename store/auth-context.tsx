import { createContext } from "react";

interface Logindatatype {
  userId: number | null;
  token: string | null;
  username: string | null;
  mobileNo: number | null;
  role: string | null;
  email: string | null;
  image: string | null;
  isLoggedIn: boolean | null;
  expirationDate: any | null;
}

interface UserDataType {
  isLoggedIn: boolean;
  userId: number | any;
  userName: string | any;
  token: string | any;
  role: string | any;
  email: string | any;
  mobileNo: number | any;
  login: (
    userId: number | null,
    token: string | null,
    username: string | null,
    mobileNo: number | null,
    role: string | null,
    email: string | null,
    image: string | null,
    isLoggedIn: boolean | null,
    expirationDate: any | null
  ) => void;
  logout: () => void;
  image: string | any;
}

export const AuthContext = createContext<UserDataType>({
  isLoggedIn: false,
  userId: null,
  userName: null,
  token: null,
  role: null,
  email: null,
  mobileNo: null,
  login: () => {},
  logout: () => {},
  image: null,
});
