import { createContext } from "react";

interface UserDataType {
  isLoggedIn: boolean;
  userId: number | any;
  userName: string | any;
  token: string | any;
  role: string | any;
  email: string | any;
  mobileNo: number | any;
  login: (userData: any | null) => void;
  logout: () => void;
  image: string | any;
}

const AuthContext = createContext<any>({
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
