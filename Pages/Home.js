import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { COLORS, SIZES } from "./mis/theme";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ref, set, onValue, remove, push, child } from "firebase/database";
import { db } from "../components/config.jsx";
import { AuthContext } from "./mis/AuthContext";
import * as Location from "expo-location";

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
  const [actNames, setActNames] = useState([]);
  const [manifest, setManifest] = useState([]);
  const { userData, setUserData } = useContext(AuthContext);
  //const userData = "ritu";
  const [location1, setLocation] = useState();
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Bad Request");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  }, []);
  useEffect(() => {
    const tester = ref(db, "activities/");
    onValue(
      tester,
      (snapshot) => {
        let rezz = [];
        setManifest(snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          rezz.push(childKey);
        });
        setActNames(rezz);
      },
      {
        onlyOnce: true,
      }
    );
  }, []);
  //DB
  async function create(lat, lng, curr_lat, curr_lng) {
    await set(ref(db, "activities/" + userData), {
      username: userData,
      curr_lat: curr_lat,
      curr_lng: curr_lng,
      lat: lat,
      lng: lng,
    });
  }
  /*
  function get(username) {
    const starCountRef = ref(db, "activities/" + username);
    let response = "";
    onValue(starCountRef, (snapshot) => {
      response = snapshot.val();
    });
    return response;
  }
  */

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
    if (location1 == "Bad Request") {
      setOutput(
        <View>
          <Text>Please grant location permissions</Text>
        </View>
      );
      return;
    }
    const curr_lat = location1["coords"]["latitude"];
    const curr_lng = location1["coords"]["longitude"];
    const raw_coords = await getCoords(text);

    const raw_lat = raw_coords[0];
    const raw_lng = raw_coords[1];
    await create(raw_lat, raw_lng, curr_lat, curr_lng);

    const result = [];
    for (let i = 0; i < actNames.length; i = i + 1) {
      const name = actNames[i];
      const match = manifest[name];
      console.log(name);
      console.log(match);
      if (match === undefined || match === null) {
        break;
      } else {
        result[i] = match;
      }
    }
    const lat_lst = [];
    const lng_lst = [];
    const ppl = [];
    for (let i = 0; i < result.length; i = i + 1) {
      if (
        result[i] !== undefined &&
        result[i]["curr_lat"] >= curr_lat - 0.5 &&
        result[i]["curr_lat"] <= curr_lat + 0.5 &&
        result[i]["curr_lng"] >= curr_lng - 0.5 &&
        result[i]["curr_lng"] <= curr_lng + 0.5
      ) {
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
    if (ppl.length === 0) {
      setOutput(
        <View>
          <Text>No one here yet</Text>
        </View>
      );
    } else {
      const street = await getStreet(lat_final, lng_final);
      const namesString = ppl.join(" ");
      setOutput(
        <View>
          <Text style={styles.results}>{street}</Text>
          <Text style={styles.results}>{namesString}</Text>
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
  }
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello {userData}</Text>
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
