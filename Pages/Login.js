import React, { useContext } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES } from "./mis/theme";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../components/config.jsx";
import { AuthContext } from "./mis/AuthContext";
import { ref, set } from "firebase/database";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userData, setUserData } = useContext(AuthContext);

  function create_acc() {
    set(ref(db, "accounts/" + username), {
      password: password,
    });
  }

  function buttonClickListener() {
    create_acc();
    setUserData(username);
  }

  return (
    <View>
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: 1 }}
        source={require("./pics/hitch_logo.png")}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Hey Hitch!</Text>
        <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 15 }}>
          Login/Sign-up
        </Text>
        <View style={styles.nestedContainer}>
          <TextInput
            style={styles.searchInput}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Username"
            placeholderTextColor="#555f61"
          />
          <TextInput
            style={styles.searchInput}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            placeholderTextColor="#555f61"
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              buttonClickListener(username);
            }}
          >
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    //fontFamily: "Roboto-Medium",
    fontSize: 28,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  innerContainer: {
    paddingTop: 40,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  nestedContainer: {
    marginTop: 60,
  },
  userName: {
    //fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  searchInput: {
    //fontFamily: FONT.regular,
    width: "100%",
    height: 30,
    paddingHorizontal: SIZES.medium,
    margin: 10,
    backgroundColor: "#F2F3F4",
    borderRadius: 10,
  },
  searchBtn: {
    width: "100%",
    height: 40,
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Login;
