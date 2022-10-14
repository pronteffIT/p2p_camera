import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  RefreshControl,
  TextInput,
  StatusBar,
  Keyboard,
} from "react-native";
import socketIo from "socket.io-client";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;
const font = (value) => (value / Dimensions.get("screen").height) * ht;

export default function Login({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [number, setNumber] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const Validate = async () => {
    if (number.length) {
      console.log("hello");
      await axios
        .post(
          "http://18.117.195.217/pass2parkit_staging/api/validate_driver_mobileno",
          {
            device_id: "",
            ip_address: "",
            user_lat: lat,
            user_long: long,
            device_push_id: expoPushToken,
            mobile_no: number,
            last_page_visited: "login screen",
          }
        )
        .then(async (res) => {
          console.log("res.data", res.data);
          let status = res.data.api_status
            ? res.data.api_status
            : res.data.status;
          //   console.log("status", status);
          if (status === "success") {
            await AsyncStorage.setItem(
              "data",
              JSON.stringify(res.data && res.data)
            );
            navigation.navigate("VerifyOtp");
          } else {
            alert("Invalid Mobile Number");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      alert("Please Enter Proper Mobile number");
    }

    // console.log("shdjsdh");
    // navigation.navigate("Home");
  };

  const getLocation = async () => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    let location;
    try {
      location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
    } catch {
      location = await Location.getLastKnownPositionAsync();
    }

    let lat =
      location &&
      location.coords &&
      location.coords.latitude &&
      location.coords.latitude.toFixed(4);
    let long =
      location &&
      location.coords &&
      location.coords.longitude &&
      location.coords.longitude.toFixed(4);
    setLat(lat);
    setLong(long);
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      <StatusBar
        animated={true}
        barStyle={"light-content"}
        showHideTransition={"slide"}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 2 }}>
          <Image
            source={require("../../assets/toplogo.png")}
            style={{ flex: 1, width: wd, resizeMode: "contain" }}
          />
        </View>
        <View
          style={{ flex: 8, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor: "red",
                height: ht * 0.05,
                width: wd * 0.6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                onChangeText={(no) => setNumber(no)}
                keyboardType={"phone-pad"}
                placeholder={"Enter Mobile number 9999999999"}
                style={{
                  height: wd * 0.06,
                  width: wd * 0.45,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  paddingHorizontal: 50,
                  borderWidth: wd * 0.001,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              //   backgroundColor: "red",
              width: wd * 0.45,
              //   justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: ht * 0.08,
                width: wd * 0.3,
                backgroundColor: "#fff",
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (ht * 0.08) / 2,
              }}
              activeOpacity={0.6}
              onPress={() => Validate()}
            >
              <View>
                <Text style={{ fontFamily: "RobotoBold", fontSize: font(20) }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c2038",
  },
});
