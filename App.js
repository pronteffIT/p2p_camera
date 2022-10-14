import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./src/Modules/Navigation";
import Config from "./src/Modules/Config";

import Configuration from "./src/Views/Configuration";

export default function App() {
  console.log("hello");

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={"light-content"}
        showHideTransition={"slide"}
      />
      <Config />
      {/* <Configuration /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
