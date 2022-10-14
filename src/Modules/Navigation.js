import React, { useEffect, useState } from "react";
import { View, Dimensions, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// screens
import DataScanner from "../Views/DataScanner";
import Login from "../Views/Login";
import VerifyOtp from "../Views/VerifyOtp";
import Configuration from "../Views/Configuration";

const ht = Dimensions.get("window").height;
const wd = Dimensions.get("window").width;

const Navigation = (data) => {
  console.log("dsdsds", data);

  const Stack = createNativeStackNavigator();
  let name = data.data ? "Configuration" : "Login";
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={name}
      >
        <Stack.Screen name="Home" component={DataScanner} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Configuration" component={Configuration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
