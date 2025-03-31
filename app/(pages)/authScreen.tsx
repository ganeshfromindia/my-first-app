import { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import AuthContext from "../../store/auth-context";
import { LinearGradient } from "expo-linear-gradient";

function LoginScreen() {
  /*
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.login(token);
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }
    */

  return (
    <>
      {/* <LinearGradient
        colors={["#ffffff", "#000000"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      /> */}
      <AuthContent />
    </>
  );
}

export default LoginScreen;
