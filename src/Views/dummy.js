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
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;
const font = (value) => (value / Dimensions.get("screen").height) * ht;

var parseString = require("react-native-xml2js").parseString;

export default function DataScanner() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const socket = socketIo.connect("http://172.16.224.186:3000/");
  const [loadedData, setLoadedData] = useState("");

  useEffect(() => {
    getData();
    // socket.on("getData", (e) => {
    //   setState(e);
    // });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      socket.on("getData", (data) => {
        parseString(data, function (err, result) {
          if (err) {
            console.log("failed");
          }
          if (result) {
            // console.log("response", result);
            let data = result.Plates.Plate;
            setData(data.reverse());
            setSelected(result.Plates.Plate[0]);
            // setRefreshing(false);
            // console.log("response", selected);
          }
        });
        // setState(e);
      });
    });
  }, []);

  const getData = async () => {
    setRefreshing(true);
    let body = `<note></note>`;
    let headers = {
      Host: "192.168.0.60",
      Authorization: "Basic YWRtaW46c3RAMTIzNDU=",
      contentType: "application/xml",
    };
    axios
      .post(
        "http://192.168.0.60/ISAPI/Traffic/channels/1/vehicleDetect/plates",
        body,
        { headers },
        { timeout: "10000" }
      )
      .then((response) => {
        // console.log("response", response, "response");
        parseString(response.data, function (err, result) {
          if (err) {
            console.log("failed");
          }
          if (result) {
            // console.log("response", result.Plates.Plate[0]);
            let data = result.Plates.Plate;
            setData(data.reverse());
            setSelected(result.Plates.Plate[0]);
            setRefreshing(false);
            // console.log("response", selected);
          }
        });
        // console.log("response", json);
      })
      .catch((e) => {
        console.log(e, "sdsdsd");
        setRefreshing(false);
        alert("Something Went Wrong...!   :(");
      });
  };
  // console.log("data", data);

  // return <View style={styles.container}></View>;

  return (
    <View style={styles.container}>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      {/* header */}
      <View
        style={{
          flex: 1.2,
          backgroundColor: "#1c2038",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/nav.png")}
            style={{
              height: wd * 0.04,
              width: wd * 0.04,
              resizeMode: "contain",
              tintColor: "#fff",
            }}
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
            alignItems: "center",
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
      <View style={{ flexDirection: "row", flex: 9 }}>
        <View style={{ flex: 1, width: wd * 0.4 }}>
          {/* camera */}
          <View style={{ flex: 3 }}>
            <View
              style={{
                flex: 3,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/camera.png")}
                style={{
                  width: wd * 0.04,
                  height: wd * 0.05,
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: font(14), fontWeight: "bold" }}>
                Camera One
              </Text>
            </View>
            <View
              style={{
                flex: 6,
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
                style={{ flex: 1.2 }}
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
                        selected.picName && selected.picName[0]
                      }.jpg`,
                    }}
                    style={{
                      flex: 0.96,
                      width: wd * 0.24,
                      resizeMode: "stretch",
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
                    {selected.plateNumber && selected.plateNumber[0]}
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {selected.laneNo && selected.laneNo[0]}
                  </Text>
                </View>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Registered
                  </Text>
                  <Text style={{ fontSize: font(10) }}>
                    {selected.captureTime && selected.captureTime[0]}
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
                <View style={{ flex: 1 }}>
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
                      getData();
                    }}
                  />
                }
                renderItem={({ item, index }) => {
                  // console.log(item);
                  return (
                    <TouchableOpacity
                      onPress={() => setSelected(item)}
                      style={{
                        height: wd * 0.05,
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
                      }}
                    >
                      <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={{ fontSize: font(8) }}>
                          {item.captureTime && item.captureTime[0]}
                        </Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <ImageBackground
                          style={{
                            flex: 1,
                            // width: wd * 0.1,
                            // backgroundColor: "red",
                            height: wd * 0.08,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          source={require("../../assets/lic-frame.png")}
                          resizeMode="stretch"
                        >
                          <Text style={{ fontSize: font(9) }}>
                            {item.plateNumber && item.plateNumber[0]}
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
                                item.picName && item.picName[0]
                              }.jpg`,
                            }}
                            style={{
                              flex: 0.8,
                              width: wd * 0.1,
                              // height: wd * 0.2,
                              resizeMode: "stretch",
                            }}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 0.4,
                            width: wd * 0.17,
                            backgroundColor: item.status
                              ? "#86bb29"
                              : "#f46732",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: wd * 0.1,
                          }}
                        >
                          <Text style={{ fontSize: font(10), color: "#fff" }}>
                            {item.status ? "Registered" : "Expired"}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: font(9) }}>
                          {item.captureTime && item.captureTime[0]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, width: wd * 0.4 }}>
          {/* camera */}
          <View style={{ flex: 3 }}>
            <View
              style={{
                flex: 3,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/camera.png")}
                style={{
                  width: wd * 0.04,
                  height: wd * 0.05,
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: font(14), fontWeight: "bold" }}>
                Camera One
              </Text>
            </View>
            <View
              style={{
                flex: 6,
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
                style={{ flex: 1.2 }}
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
                        selected.picName && selected.picName[0]
                      }.jpg`,
                    }}
                    style={{
                      flex: 0.96,
                      width: wd * 0.24,
                      resizeMode: "stretch",
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
                    {selected.plateNumber && selected.plateNumber[0]}
                  </Text>
                  <Text style={{ fontSize: font(13) }}>
                    {selected.laneNo && selected.laneNo[0]}
                  </Text>
                </View>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                >
                  <Text style={{ fontSize: font(12), color: "#f79420" }}>
                    Registered
                  </Text>
                  <Text style={{ fontSize: font(10) }}>
                    {selected.captureTime && selected.captureTime[0]}
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
                width: wd * 0.9,
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
                <View style={{ flex: 1 }}>
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
            <View style={{ flex: 9, width: wd * 0.9 }}>
              <FlatList
                data={data && data}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                  <RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    refreshing={refreshing}
                    onRefresh={() => {
                      setRefreshing(true);
                      getData();
                    }}
                  />
                }
                renderItem={({ item, index }) => {
                  // console.log(item);
                  return (
                    <TouchableOpacity
                      onPress={() => setSelected(item)}
                      style={{
                        height: wd * 0.1,
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
                      }}
                    >
                      <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={{ fontSize: font(8) }}>
                          {item.captureTime && item.captureTime[0]}
                        </Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <ImageBackground
                          style={{
                            flex: 1,
                            // width: wd * 0.1,
                            // backgroundColor: "red",
                            height: wd * 0.08,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          source={require("../../assets/lic-frame.png")}
                          resizeMode="stretch"
                        >
                          <Text style={{ fontSize: font(9) }}>
                            {item.plateNumber && item.plateNumber[0]}
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
                                item.picName && item.picName[0]
                              }.jpg`,
                            }}
                            style={{
                              flex: 0.8,
                              width: wd * 0.1,
                              // height: wd * 0.2,
                              resizeMode: "stretch",
                            }}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 0.4,
                            width: wd * 0.17,
                            backgroundColor: item.status
                              ? "#86bb29"
                              : "#f46732",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: wd * 0.1,
                          }}
                        >
                          <Text style={{ fontSize: font(10), color: "#fff" }}>
                            {item.status ? "Registered" : "Expired"}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: font(9) }}>
                          {item.captureTime && item.captureTime[0]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
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
