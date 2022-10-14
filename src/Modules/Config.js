import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
// // import Splash from "../Views/Authentication/Splash";
import Navigation from "./Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Config() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let d = await AsyncStorage.getItem("data");
    let tcd = await AsyncStorage.getItem("tow_company_id");
    let data = JSON.parse(d);
    let towCompanyId = JSON.parse(tcd);
    console.log("towCompanyId::::::::::::::", towCompanyId);
    console.log("authentication_token", data?.authentication_token);
    let status = data?.authentication_token && towCompanyId ? true : false;
    setUser(status);
  };

  async function loadResourcesAsync() {
    await Promise.all([
      Font.loadAsync({
        RobotoMedium: require("../../assets/Fonts/Roboto-Medium.ttf"),
        RobotoRegular: require("../../assets/Fonts/Roboto-Regular.ttf"),
        RobotoBold: require("../../assets/Fonts/Roboto-Bold.ttf"),
        RobotoLight: require("../../assets/Fonts/Roboto-Light.ttf"),
        UbuntuMedium: require("../../assets/Fonts/Ubuntu-Medium.ttf"),
        UbuntuRegular: require("../../assets/Fonts/Ubuntu-Regular.ttf"),
        UbuntuLight: require("../../assets/Fonts/Ubuntu-Light.ttf"),
      }),
    ]);
  }

  function handleLoadingError(error) {
    console.warn(error);
  }
  function handleFinishLoading() {
    setLoading(false);
  }

  return loading ? (
    <AppLoading
      startAsync={loadResourcesAsync}
      onError={(error) => handleLoadingError(error)}
      onFinish={() => handleFinishLoading()}
    />
  ) : (
    <>
      <Navigation data={user} />
    </>
  );
}

export default Config;
