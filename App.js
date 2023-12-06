import { StyleSheet, View } from "react-native";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { AuthContext } from "./Pages/mis/AuthContext";
import { useEffect, useState } from "react";

export default function App() {
  const [userData, setUserData] = useState();
  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <AuthContext.Provider value={{ userData, setUserData }}>
        {userData ? <Home /> : <Login />}
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
