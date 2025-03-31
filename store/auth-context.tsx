import { createContext } from "react";

interface UserDataType {
  isLoggedIn: boolean;
  userId: number | null;
  userName: string | null;
  token: string | null;
  role: string | null;
  email: string | null;
  mobileNo: number | null;
  login: any;
  logout: any;
  image: string | null;
}

const AuthContext = createContext<UserDataType>({
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

export default AuthContext;
