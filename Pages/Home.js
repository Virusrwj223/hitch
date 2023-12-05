import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { COLORS, SIZES } from "./mis/theme";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ref, set, onValue, remove } from "firebase/database";
import { db } from "C:/CodingProjects/CodingProjects/hitch/components/config.jsx";

export default function Home() {
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");
  const [match, setMatch] = useState();
  const [dest, setDest] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [output, setOutput] = useState();
  function create() {
    set(ref(db, "activities/" + 1), {
      username: "Hrishi",
      lat: lat,
      lng: lng,
    });
  }
  function get(num) {
    const starCountRef = ref(db, "activities/" + num);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setMatch(data);
    });
  }
  function stopSearch() {
    remove(ref(db, "activities/" + 1));
    return "";
  }
  function buttonClickListener(text) {
    const api_loc = "10%Pari%Dedap%Walk"; //text.replace(/ /g, "%");
    fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=55EXm4OFNP9Woczhu8MSk1jSfDSDG5mR&location=${api_loc}`
    )
      .then((res) => res.json())
      .then((j) => {
        setlat(j["results"][0]["locations"][0]["latLng"]["lat"]);
        setlng(j["results"][0]["locations"][0]["latLng"]["lng"]);
      });

    create();

    const result = [];

    for (let i = 1; i < 2; i = i + 1) {
      get(i);
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
        if (lat_lst[i] >= lat - 0.0003 && lat_lst[i] <= lat + 0.0003) {
          lat_counter += lat_lst[i];
        }
        if (lng_lst[i] >= lng - 0.0003 && lng_lst[i] <= lng + 0.0003) {
          lng_counter += lng_lst[i];
        }
      }
    }
    if (lat_lst.length === 0) {
      return <Text>Please wait</Text>;
    } else {
      const lat_final = lat_counter / lat_lst.length;
      const lng_final = lng_counter / lng_lst.length;

      fetch(
        `https://www.mapquestapi.com/geocoding/v1/reverse?key=55EXm4OFNP9Woczhu8MSk1jSfDSDG5mR&location=${lat_final},${lng_final}8&includeRoadMetadata=true&includeNearestIntersection=true`
      )
        .then((res) => res.json())
        .then((j) => {
          setDest(j["results"][0]["locations"][0]["street"]);
        });
      return (
        <View>
          <Text style={styles.userName}>{dest}</Text>
          <Text style={styles.userName}>
            {ppl}
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => {
                setOutput(stopSearch());
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </Text>
        </View>
      );
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello Raj</Text>
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
            setOutput(buttonClickListener(searchTerm));
          }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>{output}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userName: {
    //fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
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
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
});
