import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import socketIo from "socket.io-client";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// const keyboardVerticalOffset = Platform.OS === "android" ? 0 : -ht * 0.1;

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;
const font = (value) => (value / Dimensions.get("screen").height) * ht;

export default function VerifyOtp({ navigation }) {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [input5, setInput5] = useState("");
  const [input6, setInput6] = useState("");
  const inp1 = useRef();
  const inp2 = useRef();
  const inp3 = useRef();
  const inp4 = useRef();
  const inp5 = useRef();
  const inp6 = useRef();
  const changeValue = (ss, inpprev, inpFor, current, index) => {
    if (!ss) {
      inpprev.current.focus();
    } else {
      inpFor.current.focus();
    }
    current(ss);
  };
  const checkOtp = async () => {
    const sdata = await AsyncStorage.getItem("data");
    const storagedata = JSON.parse(sdata);
    console.log("storagedata::::::::::::::::", storagedata);
    console.log(
      "storagedata.session_id::::::::::::::::",
      storagedata.session_id
    );
    console.log(
      "storagedata.authentication_token::::::::::::::::",
      storagedata.authentication_token
    );
    var code = input1 + input2 + input3 + input4 + input5 + input6;
    console.log("code::::::::::::::", code);
    if (code.length === 6) {
      console.log("code::::::::::::::", code);
      console.log(
        "storagedata.session_id::::::::::::::",
        storagedata.session_id
      );
      console.log(
        "storagedata.authentication_token::::::::::::::",
        storagedata.authentication_token
      );
      await axios
        .post(
          "http://18.117.195.217/pass2parkit_staging/api/validate_login_otp",
          {
            session_id: storagedata.session_id,
            authentication_token: storagedata.authentication_token,
            api_key: "y12YonD8JP03mJ0FLNKCoWYDYowjLMfk",
            otp: code,
          }
        )
        .then(async (res) => {
          //   console.log("otp response", res.data.driver_details.tow_company_id);
          if (res.data.api_status == "success") {
            await AsyncStorage.setItem(
              "tow_company_id",
              JSON.stringify(res.data.driver_details.tow_company_id)
            );
            const a = await AsyncStorage.getItem("tow_company_id");
            console.log("a::::::::::", a);
            navigation.navigate("Configuration");
          } else {
            alert(`${res.data.api_status}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Invalid otp entered.Please try again with correct otp.");
    }
  };
  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      <StatusBar
        animated={true}
        barStyle={"light-content"}
        showHideTransition={"slide"}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 2, zIndex: 5 }}>
          <Image
            source={require("../../assets/toplogo.png")}
            style={{ flex: 1, width: wd, resizeMode: "contain" }}
          />
        </View>

        <View
          style={{
            flex: 8,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "pink",
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
                justifyContent: "center",
                alignItems: "center",
                height: ht * 0.25,
              }}
            >
              <Image
                source={require("../../assets/sms.png")}
                style={{
                  width: Dimensions.get("window").width * 0.1,
                  height: Dimensions.get("window").width * 0.1,
                }}
              />
            </View>
            {/* Verificarion text starts */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: ht * 0.1,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: font(24),
                  fontFamily: "UbuntuRegular",
                }}
              >
                Verification Code
              </Text>
              <Text
                style={{
                  color: "#a6aac3",
                  fontSize: font(13),
                  fontFamily: "UbuntuRegular",
                }}
              >
                Sit back and relax! while we verify
              </Text>
              <Text
                style={{
                  color: "#a6aac3",
                  fontSize: font(13),
                  fontFamily: "UbuntuRegular",
                }}
              >
                your mobile number
              </Text>
            </View>
            {/* Verification text Ends */}
            {/* Mobile No Starts */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: ht * 0.1,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: font(16),
                  textAlign: "center",
                  fontFamily: "UbuntuRegular",
                }}
              >
                Please type verification code sent to
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: font(16),
                  textAlign: "center",
                  fontFamily: "UbuntuRegular",
                }}
              >
                +1998856786278
              </Text>
            </View>
            {/* Mobile No Ends */}
            {/* Otp input Starts */}
            <View
              style={{
                justifyContent: "center",
                height: ht * 0.1,
                width: wd * 0.3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp1}
                  onSubmitEditing={() => inp2.current.focus()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) => {
                    changeValue(text, inp1, inp2, setInput1, 1);
                  }}
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") {
                    } else inp2.current.focus();
                  }}
                />

                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp2}
                  onSubmitEditing={() => inp3.current.focus()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) =>
                    changeValue(text, inp1, inp3, setInput2, 2)
                  }
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") inp1.current.focus();
                    else inp3.current.focus();
                  }}
                />

                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp3}
                  onSubmitEditing={() => inp4.current.focus()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) =>
                    changeValue(text, inp2, inp4, setInput3, 3)
                  }
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") inp2.current.focus();
                    else inp4.current.focus();
                  }}
                />

                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp4}
                  onSubmitEditing={() => inp5.current.focus()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) =>
                    changeValue(text, inp3, inp5, setInput4, 4)
                  }
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") inp3.current.focus();
                    else inp5.current.focus();
                  }}
                />

                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp5}
                  onSubmitEditing={() => inp6.current.focus()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) =>
                    changeValue(text, inp4, inp6, setInput5, 5)
                  }
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") inp4.current.focus();
                    else inp6.current.focus();
                  }}
                />

                <TextInput
                  placeholderTextColor="#cccccc"
                  keyboardType="number-pad"
                  style={styles.input}
                  ref={inp6}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={
                    Platform.OS == "android" ? "numeric" : "number-pad"
                  }
                  maxLength={1}
                  onChangeText={(text) =>
                    changeValue(text, inp5, inp6, setInput6, 6)
                  }
                  onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                    if (keyValue === "Backspace") inp5.current.focus();
                    else Keyboard.dismiss();
                  }}
                />
              </View>
            </View>
            {/* Otp input Ends */}
            {/* Button Starts */}
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: ht * 0.2,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#333858",
                  shadowOffset: { height: 0, width: 0 },
                  shadowOpacity: 0.2,
                  shadowColor: "gray",
                  width: wd * 0.13,
                  height: wd * 0.05,
                  elevation: 1,
                  borderRadius: wd * 0.025,
                }}
                onPress={() => navigation.navigate("Login")}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "UbuntuRegular",
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f79420",
                  shadowOffset: { height: 0, width: 0 },
                  shadowOpacity: 0.2,
                  shadowColor: "gray",
                  width: wd * 0.13,
                  height: wd * 0.05,
                  elevation: 1,
                  borderRadius: wd * 0.025,
                }}
                onPress={checkOtp}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "UbuntuRegular",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            {/* Button Ends */}
            {/* Bottom Text Starts */}
            <View
              style={{
                //   flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: 10,
                height: ht * 0.1,
              }}
            >
              <Text
                style={{
                  color: "#62688a",
                  fontSize: 12,
                  fontFamily: "UbuntuLight",
                }}
              >
                Powered by Pass2parkit.com
              </Text>
            </View>
            {/* Bottom Text Ends */}
          </KeyboardAwareScrollView>
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
  input: {
    width: wd * 0.04,
    height: wd * 0.04,
    borderWidth: wd * 0.0015,
    borderColor: "#cccccc",
    color: "#ffffff",
    // paddingLeft: wd * 0.045,
    fontSize: font(20),
    fontFamily: "RobotoMedium",
    textAlign: "center",
  },
});
