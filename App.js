import { StyleSheet, View } from "react-native";
import Home1 from "./Pages/Home";
import Login from "./Pages/Login";
import { AuthContext } from "./Pages/mis/AuthContext";
import { useEffect, useState } from "react";

export default function App() {
  const [userData, setUserData] = useState();

  return (
    <View style={styles.container}>
      <AuthContext.Provider value={{ userData, setUserData }}>
        {userData ? <Home1 /> : <Login />}
      </AuthContext.Provider>
    </View>
  );
}
/*
<AuthContext.Provider value={{ userData, setUserData }}>
        {userData ? <Home1 /> : <Login />}
      </AuthContext.Provider>
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
