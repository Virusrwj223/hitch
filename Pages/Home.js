import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useContext, useState } from "react";
import { COLORS, SIZES } from "./mis/theme";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ref, set, onValue, remove } from "firebase/database";
import { db } from "../components/config.jsx";
import { AuthContext } from "./mis/AuthContext";

const styles = StyleSheet.create({
  containerNested: {
    backgroundColor: "#E8E9EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    //paddingTop: 10,
    borderRadius: 20,
    height: 150,
  },
  container: {
    width: "100%",
  },
  userName: {
    //fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  results: {
    //fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
    //margin: 10,
  },
  welcomeMessage: {
    //fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  searchInput: {
    //fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  stopBtn: {
    width: "100%",
    height: "40%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
});

function Home1() {
  const [searchTerm, setSearchTerm] = useState("");
  const [output, setOutput] = useState(<Text></Text>);
  const { userData, setUserData } = useContext(AuthContext);
  //const userData = "Hrishi";
  //DB
  function create(lat, lng) {
    set(ref(db, "activities/" + userData), {
      username: userData,
      lat: lat,
      lng: lng,
    });
  }
  async function get() {
    const starCountRef = ref(db, "activities/" + userData);
    let response = "";
    await onValue(starCountRef, (snapshot) => {
      response = snapshot.val();
    });
    return response;
  }
  function stopSearch() {
    remove(ref(db, "activities/" + userData));
    setOutput(<View></View>);
  }
  //QUEST api
  async function getCoords(text) {
    const api_loc = "10%Pari%Dedap%Walk"; //text.replace(/ /g, "%");
    const response = await fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=55EXm4OFNP9Woczhu8MSk1jSfDSDG5mR&location=${api_loc}`
    );
    const temp = await response.json();
    const lat = await temp["results"][0]["locations"][0]["latLng"]["lat"];
    const lng = await temp["results"][0]["locations"][0]["latLng"]["lng"];
    return [lat, lng];
  }
  async function getStreet(lat, lng) {
    const response = await fetch(
      `https://www.mapquestapi.com/geocoding/v1/reverse?key=55EXm4OFNP9Woczhu8MSk1jSfDSDG5mR&location=${lat},${lng}8&includeRoadMetadata=true&includeNearestIntersection=true`
    );
    const temp = await response.json();
    const street = await temp["results"][0]["locations"][0]["street"];
    return street;
  }
  //Parser
  async function buttonClickListener(text) {
    const raw_coords = await getCoords(text);
    const raw_lat = raw_coords[0];
    const raw_lng = raw_coords[1];
    create(raw_lat, raw_lng);

    const result = [];
    for (let i = 1; i < 2; i = i + 1) {
      const match = await get();
      if (match === undefined || match === null) {
        break;
      } else {
        result[i - 1] = match;
      }
    }

    const lat_lst = [];
    const lng_lst = [];
    const ppl = [];
    for (let i = 0; i < result.length; i = i + 1) {
      if (result[i] !== undefined) {
        lat_lst[i] = result[i]["lat"];
        lng_lst[i] = result[i]["lng"];
        ppl[i] = result[i]["username"];
      }
    }

    let lat_counter = 0;
    let lng_counter = 0;
    for (let i = 0; i < lat_lst.length; i = i + 1) {
      if (result[i] !== undefined) {
        if (lat_lst[i] >= raw_lat - 0.0003 && lat_lst[i] <= raw_lat + 0.0003) {
          lat_counter += lat_lst[i];
        }
        if (lng_lst[i] >= raw_lng - 0.0003 && lng_lst[i] <= raw_lng + 0.0003) {
          lng_counter += lng_lst[i];
        }
      }
    }
    const lat_final = lat_counter / lat_lst.length;
    const lng_final = lng_counter / lng_lst.length;
    const street = await getStreet(lat_final, lng_final);
    setOutput(
      <View>
        <Text style={styles.results}>{street}</Text>
        <Text style={styles.results}>{ppl}</Text>
        <TouchableOpacity
          style={styles.stopBtn}
          onPress={() => {
            stopSearch();
          }}
        >
          <Entypo name="cross" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello </Text>
        <Text style={styles.welcomeMessage}>Where do you want to go today</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder="I am going to..."
          />
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => {
            buttonClickListener(searchTerm);
          }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerNested}>{output}</View>
    </View>
  );
}

export default Home1;
