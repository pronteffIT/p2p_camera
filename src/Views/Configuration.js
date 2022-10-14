import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
  RefreshControl,
  Keyboard,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { WebView } from "react-native-webview";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;
const font = (value) => (value / Dimensions.get("screen").height) * ht;

export default function Configuration({ navigation }) {
  var ImageUrl =
    "http://admin:st@12345@192.168.0.60/ISAPI/Streaming/channels/1/picture";
  const [data, setData] = useState({
    camera1Description: "",

    camera2Description: "",
  });
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [time, setTime] = useState(Date.now());
  const [refresh, setRefresh] = useState(Date.now());

  const checkData = () => {
    if (
      data.camera1Description.length == 0 ||
      data.camera2Description.length == 0
    ) {
      alert("Please Fill all the fields.");
    } else {
      navigation.navigate("Home", { configurationData: data });
    }
  };

  const refreshImage = () => {
    setRefresh(Date.now());
  };
  return (
    <View onTouchStart={() => Keyboard.dismiss()} style={styles.container}>
      {/* header */}
      <View
        style={{
          flex: 1.4,
          flexDirection: "row",
          zIndex: 100,
          backgroundColor: "#1c2038",
          ...Platform.select({
            android: {
              elevation: 2,
            },
            ios: {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
            },
          }),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.clear();
            navigation.navigate("Login");
          }}
          style={{
            flex: 0.25,
            // alignItems: "center",
            justifyContent: "center",
            marginLeft: wd * 0.025,
          }}
        >
          {/*  <Image
            source={require("../../assets/nav.png")}
            style={{
              height: wd * 0.04,
              width: wd * 0.04,
              resizeMode: "contain",
              tintColor: "#fff",
            }}
          /> */}
          <FontAwesome name="power-off" size={40} color="#A6A1A1" />
        </TouchableOpacity>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: font(20),
              fontWeight: "bold",
              color: "#fff",
            }}
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
          //   flexDirection: "row",
          flex: 8.6,
        }}
      >
        <KeyboardAwareScrollView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          // keyboardVerticalOffset={ht * 0.3}
          contentContainerStyle={{ flex: 1 }}
          extraScrollHeight={ht * 0.02}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: wd,
              // backgroundColor: "red",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: "#1c2038",
                  fontSize: font(23),
                  fontWeight: "bold",
                  marginTop: ht * 0.03,
                  marginBottom: ht * 0.035,
                }}
              >
                Camera 1
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#f79420",
                      marginBottom: ht * 0.02,
                      marginTop: ht * 0.04,
                      fontWeight: "bold",
                    }}
                  >
                    Camera Preview
                  </Text>
                  {/* <Image
                    source={require("../../assets/camerapreview.jpg")}
                    style={{ width: 100, height: 100 }}
                  /> */}
                  {/* <Image
                    style={{ width: 300, height: 200 }}
                    source={{
                      uri: `http://admin:st@12345@192.168.0.60/ISAPI/Streaming/channels/1/picture.jpeg`,
                      method: "GET",
                      headers: {
                        Pragma: "no-cache",
                      },
                    }}
                  /> */}

                  <WebView
                    key={refresh}
                    source={{
                      uri: `http://admin:st@12345@192.168.0.60/ISAPI/Streaming/channels/1/picture`,
                    }}
                    style={{
                      width: wd * 0.3,
                      height: wd * 0.3,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: "#f79420",
                      marginBottom: ht * 0.02,
                      // marginTop: ht * 0.04,
                      fontWeight: "bold",
                    }}
                  >
                    Camera Description
                  </Text>
                  <TextInput
                    style={{
                      width: wd * 0.3,
                      height: ht * 0.05,
                      borderWidth: wd * 0.001,
                      borderColor: "#1c2038",
                      borderRadius: wd * 0.005,
                      color: "#1c2038",
                      paddingLeft: wd * 0.01,
                    }}
                    onChangeText={(text) =>
                      setData({ ...data, camera1Description: text })
                    }
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                width: wd * 0.04,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "red",
              }}
            >
              <TouchableOpacity
                style={{
                  // backgroundColor: "green",
                  width: wd * 0.04,
                  alignItems: "center",
                  justifyContent: "center",
                  height: ht * 0.06,
                }}
                onPress={refreshImage}
              >
                <FontAwesome name="refresh" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: "#1c2038",
                  fontSize: font(23),
                  fontWeight: "bold",
                  marginTop: ht * 0.03,
                  marginBottom: ht * 0.035,
                }}
              >
                Camera 2
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#f79420",
                      marginBottom: ht * 0.02,
                      marginTop: ht * 0.04,
                      fontWeight: "bold",
                    }}
                  >
                    Camera Preview
                  </Text>
                  {/* <WebView
                    key={refresh}
                    source={{
                      uri: `http://admin:st@12345@192.168.0.60/ISAPI/Streaming/channels/1/picture`,
                    }}
                    style={{
                      width: wd * 0.3,
                      height: wd * 0.3,
                    }}
                  /> */}
                  <View
                    style={{ marginBottom: ht * 0.08, marginTop: ht * 0.012 }}
                  >
                    <Image
                      style={{
                        width: wd * 0.3,
                        height: wd * 0.15,
                        // backgroundColor: "red",
                      }}
                      source={require("../../assets/scanner-frame.png")}
                      resizeMode="stretch"
                    />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#f79420",
                      marginBottom: ht * 0.02,
                      // marginTop: ht * 0.04,
                      fontWeight: "bold",
                    }}
                  >
                    Camera Description
                  </Text>
                  <TextInput
                    style={{
                      width: wd * 0.3,
                      height: ht * 0.05,
                      borderWidth: wd * 0.001,
                      borderColor: "#1c2038",
                      borderRadius: wd * 0.005,
                      color: "#1c2038",
                      paddingLeft: wd * 0.01,
                    }}
                    onChangeText={(text) =>
                      setData({ ...data, camera2Description: text })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Button starts */}

          <View
            style={{
              flex: 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: ht * 0.08,
                width: wd * 0.3,
                backgroundColor: "#1c2038",
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: (ht * 0.08) / 2,
              }}
              activeOpacity={0.6}
              onPress={checkData}
              // onPress={() =>
              //   alert(
              //     `${data.camera1Description}, ${data.camera2Description}, ${data.camera2Code} , ${data.camera1Code}`
              //   )
              // }
            >
              <Text
                style={{
                  fontFamily: "RobotoBold",
                  fontWeight: "bold",
                  fontSize: font(20),
                  color: "#fff",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          {/* Button Ends */}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: ht,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
