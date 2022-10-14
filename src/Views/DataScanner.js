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
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import socketIo from "socket.io-client";
import moment from "moment";
import { Audio } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
var parseString = require("react-native-xml2js").parseString;

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;
const font = (value) => (value / Dimensions.get("screen").height) * ht;

const outside = [];
var outsideIterator = 0;

export default function DataScanner({ route, navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const [rightdata, setRightData] = useState(false);
  const { configurationData } = route.params;
  const [borderStatus, setBorderStatus] = useState(true);
  const [indexValue, setIndexValue] = useState();
  const [tune, setTune] = useState();
  const [borderColour, setBorderColour] = useState("");
  const [sounds, setSound] = useState();
  const [message, setMessage] = useState("");
  const [iterarte, setIterate] = useState(0);
  const [restricttouch, setRestrictTouch] = useState(false);
  const socket = socketIo("http://172.16.224.192:3000/");
  console.log("data scanner");
  console.log("configurationData::::::::::::", configurationData);
  useEffect(() => {
    // getData();
    // socket.on("getData", (e) => {
    //   setState(e);
    // });
  }, []);

  // const settingAudio = async (tuneStatus) => {
  //   console.log("Loading Sound");
  //   await Audio.setAudioModeAsync({
  //     allowsRecordingIOS: false,
  //     interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  //     playsInSilentModeIOS: true,
  //     interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  //     shouldDuckAndroid: true,
  //     staysActiveInBackground: true,
  //     playThroughEarpieceAndroid: true,
  //   });
  //   const sound = new Audio.Sound();

  //   const status = {
  //     shouldPlay: true,
  //     isLooping: false,
  //   };
  //   // console.log("sound:::::::::::::::", sound);
  //   console.log("tuneStatus::::::::", tuneStatus);
  //   if (tuneStatus) {
  //     sound.loadAsync(require("../../assets/sounds/failed.wav"), status, false);
  //     setSound(sound);
  //   } else {
  //     sound.loadAsync(
  //       require("../../assets/sounds/success.wav"),
  //       status,
  //       false
  //     );
  //     setSound(sound);
  //   }
  //   // await sound.playAsync();
  // };

  // // async function playSound() {
  // //   await sound.playAsync();
  // // }

  // const borderBlink = (index, status) => {
  //   // socket.close();
  //   console.log("borderBlink");
  //   setIndexValue(index);

  //   console.log(status);
  //   if (status == "Active") {
  //     setTune(true);
  //     settingAudio(true);
  //     console.log("borderBlink1");
  //     var refreshIntervalId = setInterval(() => {
  //       setBorderStatus((prev) => !prev);
  //     }, 500);
  //     setBorderColour("green");
  //   } else {
  //     console.log("borderBlink2");
  //     setTune(false);
  //     settingAudio(false);
  //     var refreshIntervalId = setInterval(() => {
  //       setBorderStatus((prev) => !prev);
  //     }, 500);
  //     setBorderColour("red");
  //   }

  //   setTimeout(() => {
  //     setBorderColour("#fff");
  //     setSound();
  //     setRestrictTouch(false);
  //     clearInterval(refreshIntervalId);
  //     // callSocket();
  //   }, 8000);
  // };

  useEffect(() => {
    var a = [];
    if (data.length > 20) {
      a = data.splice(0, 20);

      setData(a);
    }
  }, [data]);
  useEffect(() => {
    // const socket = socketIo("http://172.16.224.191:3000/");
    callSocket();
  }, []);

  const callSocket = () => {
    // const socket = socketIo("http://172.16.224.191:3000/");

    socket.on("getData", (d) => {
      scanNumberPlate(d.plateNumber._text, d);
      console.log("d::::::::::::::::::", d);
      console.log("calling socket");
    });
  };

  const scanNumberPlate = async (plateNo, dt) => {
    const stdata = await AsyncStorage.getItem("data");
    const storagedata = JSON.parse(stdata);
    const a = await AsyncStorage.getItem("tow_company_id");
    const tow_company_id = JSON.parse(a);
    console.log("d::::::::::::----", dt);

    const platearr = [
      "ptr6778",
      "423tt",
      "tre432",
      "SA34556",
      "1234",
      "texas4",
      "hu8799",
      "11123344",
    ];
    await axios
      .post(
        "http://18.117.195.217/pass2parkit_staging/api/scan_lic_plateno_new",
        {
          // session_id: 652248,
          // authentication_token: "f2m0wv5tga8n2j0hzkt8qt8ei73gd1",
          // api_key: "MgjbEWjoLtq8dzNYmyBLvzpuYWNJI34v",
          // tow_company_id: 1027,
          session_id: storagedata.session_id,
          authentication_token: storagedata.authentication_token,
          api_key: storagedata.api_keys.get_team_members,
          tow_company_id: tow_company_id,
          // lic_plateno: plateNo,
          // lic_plateno: "",
          // lic_plateno: platearr[outsideIterator],
          lic_plateno: plateNo,
        }
      )
      .then((res) => {
        // console.log("res.data::::::::::::", res.data);
        let arr = [...outside];
        // console.log("camera_status:::::::::", res.data.camera_status);
        getSoundValidation(res.data.camera_status);

        if (outsideIterator == platearr.length - 1) {
          outsideIterator = 0;
        } else {
          outsideIterator = outsideIterator + 1;
        }
        console.log(
          "platearr[outsideIterator]:::::::::::::::::",
          platearr[outsideIterator]
        );
        dt.expire = res.data.Expiry_date;
        dt.status = res.data.camera_status;
        dt.message = res.data.camera_message;
        // console.log("res.data.camera_message::::::::", res.data.camera_message);

        // arr.unshift(dt);
        // outside.unshift(dt);
        // setData(arr);

        setData((prev) => [dt, ...prev]);

        setSelected(dt);
      })
      .catch((err) => {
        console.log("inside error....");
        console.log(err);
      });
  };
  // console.log("data.length::::::::::: outside data", data.length);

  const getSoundValidation = async (stat) => {
    // console.log("hitting::::::::::again");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
    });
    // const sound = new Audio.Sound();

    const status = {
      shouldPlay: true,
      isLooping: false,
    };
    // console.log("sound:::::::::::::::", sound);
    // console.log("stats::::::::", stat);
    getColourValidation(stat);
    if (stat == "Active") {
      // sound.loadAsync(
      //   require("../../assets/sounds/positive.wav"),
      //   status,
      //   false
      // );
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/positive.wav"),
        status
      );
      await sound.playAsync();
    } else {
      // sound.loadAsync(
      //   require("../../assets/sounds/negative.wav"),
      //   status,
      //   false
      // );
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/negative.wav"),
        status
      );
      await sound.playAsync();
    }
  };

  const onRowPressSound = async (stat) => {
    if (stat == "Active") {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/positive.wav")
      );
      await sound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/negative.wav")
      );
      await sound.playAsync();
    }
  };

  const getColourValidation = (stat) => {
    // console.log("borderBlink in some function and index 0 and no timeout");
    setIndexValue(0);

    if (stat == "Active") {
      // console.log("borderBlink1 in some function");
      setBorderColour("green");
    } else {
      // console.log("borderBlink2 in some function");
      setBorderColour("red");
    }

    // setTimeout(() => {
    //   setBorderColour("#fff");
    // }, 1000);
  };
  console.log("selected::::::::::::", selected);
  return (
    <View style={styles.container}>
      {/* header */}
      <View
        style={{
          flex: 1.4,
          backgroundColor: "#1c2038",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          // onPress={() => {
          //   AsyncStorage.clear();
          //   navigation.navigate("Login");
          // }}
          onPress={() => {
            // AsyncStorage.clear();
            navigation.goBack();
          }}
          style={{
            flex: 0.25,
            // alignItems: "center",
            justifyContent: "center",
            marginLeft: wd * 0.025,
          }}
        >
          {/*   <Image
            source={require("../../assets/nav.png")}
            style={{
              height: wd * 0.04,
              width: wd * 0.04,
              resizeMode: "contain",
              tintColor: "#fff",
            }}
          /> */}
          <Ionicons
            name="arrow-back-circle-outline"
            size={45}
            color="#A6A1A1"
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: font(20), fontWeight: "bold", color: "#fff" }}
          >
            P2P Data Scanner
          </Text>
        </View>
        <View
          style={{
            flex: 0.25,
            alignItems: "flex-end",
            marginRight: wd * 0.025,
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{
              height: wd * 0.05,
              width: wd * 0.08,
              resizeMode: "cover",
              tintColor: "#fff",
            }}
          />
        </View>
      </View>
      {/* body */}
      <View
        style={{
          flexDirection: "row",
          flex: 8.6,
        }}
      >
        <View
          style={{
            flex: 1,
            width: wd * 0.44,
            alignItems: "center",
          }}
        >
          {/* camera */}
          <View style={{ flex: 3 }}>
            <View
              style={{
                height: wd * 0.03,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: font(22), fontWeight: "bold" }}>
                {configurationData.camera1Description}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/camera.png")}
                style={{
                  width: wd * 0.017,
                  height: wd * 0.017,
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: font(14), fontWeight: "bold" }}>
                {"  "} Camera 1
              </Text>
            </View>
            <View
              style={{
                flex: 7,
                width: wd * 0.44,
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                zIndex: 100,
                elevation: 5,
              }}
            >
              <ImageBackground
                style={{ flex: 0.8 }}
                source={require("../../assets/scanner-frame.png")}
                resizeMode="stretch"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: `http://192.168.0.60/doc/ui/images/plate/${
                        selected.picName && selected.picName._text
                      }.jpg`,
                    }}
                    style={{
                      flex: 0.96,
                      width: wd * 0.19,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </ImageBackground>

              <View style={{ flex: 1 }}>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Scan Details
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {selected.plateNumber && selected.plateNumber._text}
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {selected.laneNo && selected.laneNo._text}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: "center",
                    paddingLeft: 10,
                  }}
                >
                  <Text style={{ fontSize: font(14) }}>
                    {selected.message && selected.message}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingLeft: 10,
                  }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Registered
                  </Text>
                  <Text style={{ fontSize: font(10) }}>
                    {selected.captureTime &&
                      // moment
                      //   .utc(selected.expire)
                      //   .local()
                      //   .format("DD/MM/YYYY hh:mm A")
                      selected.expire}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* data */}
          <View
            style={{
              flex: 7,
              marginTop: 10,
              marginBottom: 3,
            }}
          >
            <View
              style={{
                flex: 1,
                width: wd * 0.44,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flex: 0.85,
                  backgroundColor: "#f79420",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1.2 }}>
                  <Text
                    style={{
                      fontSize: font(11),
                      color: "#fff",
                      paddingLeft: 5,
                    }}
                  >
                    Scan Date & Time
                  </Text>
                </View>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    LIC Plate
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    status
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    expiry date & time
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 9, width: wd * 0.44 }}>
              <FlatList
                data={data && data}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                  <RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    refreshing={refreshing}
                    onRefresh={() => {
                      setRefreshing(true);
                    }}
                  />
                }
                renderItem={({ item, index }) => {
                  // console.log("status::::::::", item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        // setRestrictTouch(true);
                        setSelected(item);
                        setIndexValue(index);
                        setBorderColour(
                          item.status == "Active" ? "green" : "red"
                        );
                        onRowPressSound(item.status);
                      }}
                      // disabled={true}
                      style={{
                        height: wd * 0.04,
                        marginVertical: 5,
                        marginHorizontal: 2,
                        backgroundColor: item.status ? "#fff" : "#ffffff70",
                        flexDirection: "row",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        zIndex: 100,
                        elevation: 2,
                        borderColor:
                          borderStatus && [indexValue].includes(index)
                            ? borderColour
                            : "#fff",
                        borderWidth: wd * 0.001,
                      }}
                    >
                      <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={{ fontSize: font(8) }}>
                          {item.captureTime &&
                            moment
                              .utc(item.captureTime._text)
                              .local()
                              .format("DD/MM/YYYY hh:mm A")}
                        </Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <ImageBackground
                          style={{
                            flex: 1,
                            // width: wd * 0.1,
                            // backgroundColor: "red",
                            height: wd * 0.03,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          source={require("../../assets/lic-frame.png")}
                          resizeMode="stretch"
                        >
                          <Text style={{ fontSize: font(9) }}>
                            {item.plateNumber && item.plateNumber._text}
                          </Text>
                        </ImageBackground>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderColor: "#f79420",
                          }}
                        >
                          <Image
                            source={{
                              uri: `http://192.168.0.60/doc/ui/images/plate/${
                                item.picName && item.picName._text
                              }.jpg`,
                            }}
                            style={{
                              flex: 0.8,
                              width: wd * 0.04,
                              // height: wd * 0.2,
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 0.4,
                            width: wd * 0.07,
                            backgroundColor:
                              item.status == "Active" ? "#86bb29" : "#f46732",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: wd * 0.1,
                          }}
                        >
                          <Text style={{ fontSize: font(9), color: "#fff" }}>
                            {item.status && item.status}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: font(9) }}>
                          {item.expire && item.expire}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: wd * 0.44,
            alignItems: "center",
          }}
        >
          {/* camera */}
          <View style={{ flex: 3 }}>
            <Text style={{ fontSize: font(22), fontWeight: "bold" }}>
              {configurationData.camera2Description}
            </Text>
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/camera.png")}
                style={{
                  width: wd * 0.017,
                  height: wd * 0.017,
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: font(14), fontWeight: "bold" }}>
                {"  "} Camera 2
              </Text>
            </View>
            <View
              style={{
                flex: 7,
                width: wd * 0.44,
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                zIndex: 100,
                elevation: 5,
              }}
            >
              <ImageBackground
                style={{ flex: 0.8 }}
                source={require("../../assets/scanner-frame.png")}
                resizeMode="stretch"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {rightdata ? (
                    <Image
                      source={{
                        uri: `http://192.168.0.60/doc/ui/images/plate/${
                          selected.picName && selected.picName._text
                        }.jpg`,
                      }}
                      style={{
                        flex: 0.96,
                        width: wd * 0.19,
                        resizeMode: "contain",
                      }}
                    />
                  ) : null}
                </View>
              </ImageBackground>

              <View style={{ flex: 1 }}>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Scan Details
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {rightdata
                      ? selected.plateNumber && selected.plateNumber._text
                      : null}
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {rightdata
                      ? selected.laneNo && selected.laneNo._text
                      : null}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: "center",
                    paddingLeft: 10,
                  }}
                >
                  <Text style={{ fontSize: font(14) }}>
                    {rightdata ? selected.message && selected.message : null}
                  </Text>
                </View>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Registered
                  </Text>
                  <Text style={{ fontSize: font(10) }}>
                    {rightdata
                      ? selected.captureTime &&
                        moment
                          .utc(selected.captureTime._text)
                          .local()
                          .format("DD/MM/YYYY hh:mm A")
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* data */}
          <View
            style={{
              flex: 7,
              marginTop: 10,
              marginBottom: 3,
            }}
          >
            <View
              style={{
                flex: 1,
                width: wd * 0.44,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flex: 0.85,
                  backgroundColor: "#f79420",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1.2 }}>
                  <Text
                    style={{
                      fontSize: font(11),
                      color: "#fff",
                      paddingLeft: 5,
                    }}
                  >
                    Scan Date & Time
                  </Text>
                </View>
                <View style={{ flex: 0.8 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    LIC Plate
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    status
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: font(11), color: "#fff" }}>
                    expiry date & time
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 9, width: wd * 0.44 }}>
              {rightdata ? (
                <FlatList
                  data={data && data}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      colors={["#9Bd35A", "#689F38"]}
                      refreshing={refreshing}
                      onRefresh={() => {
                        setRefreshing(true);
                      }}
                    />
                  }
                  renderItem={({ item, index }) => {
                    // console.log(item);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          // setRestrictTouch(true);
                          setSelected(item);
                          setIndexValue(index);
                          setBorderColour(
                            item.status == "Active" ? "green" : "red"
                          );
                          onRowPressSound(item.status);
                        }}
                        // disabled={true}
                        style={{
                          height: wd * 0.04,
                          marginVertical: 5,
                          marginHorizontal: 2,
                          backgroundColor: item.status ? "#fff" : "#ffffff70",
                          flexDirection: "row",
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          zIndex: 100,
                          elevation: 2,
                          borderColor:
                            borderStatus && [indexValue].includes(index)
                              ? borderColour
                              : "#fff",
                          borderWidth: wd * 0.001,
                        }}
                      >
                        <View style={{ flex: 1, paddingLeft: 5 }}>
                          <Text style={{ fontSize: font(8) }}>
                            {item.captureTime &&
                              moment
                                .utc(item.captureTime._text)
                                .local()
                                .format("DD/MM/YYYY hh:mm A")}
                          </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <ImageBackground
                            style={{
                              flex: 1,
                              // width: wd * 0.1,
                              // backgroundColor: "red",
                              height: wd * 0.03,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            source={require("../../assets/lic-frame.png")}
                            resizeMode="stretch"
                          >
                            <Text style={{ fontSize: font(9) }}>
                              {item.plateNumber && item.plateNumber._text}
                            </Text>
                          </ImageBackground>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              borderColor: "#f79420",
                            }}
                          >
                            <Image
                              source={{
                                uri: `http://192.168.0.60/doc/ui/images/plate/${
                                  item.picName && item.picName._text
                                }.jpg`,
                              }}
                              style={{
                                flex: 0.8,
                                width: wd * 0.04,
                                // height: wd * 0.2,
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flex: 0.4,
                              width: wd * 0.07,
                              backgroundColor:
                                item.status == "Active" ? "#86bb29" : "#f46732",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: wd * 0.1,
                            }}
                          >
                            <Text style={{ fontSize: font(9), color: "#fff" }}>
                              {item.status && item.status}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: font(9) }}>
                            {item.expire && item.expire}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      elevation: 10,
                      backgroundColor: "#f79420",
                      justifyContent: "center",
                      alignItems: "center",
                      width: wd * 0.18,
                      height: ht * 0.05,
                      borderRadius: wd * 0.09,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      No Data to Display
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: ht,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
