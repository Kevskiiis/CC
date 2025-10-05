import React from "react";
import {  SafeAreaView, View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function CreateCommunityScreen() {
   return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.text}>Create Post</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: COLORS.background, // same app background
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text: { fontSize: 18, color: COLORS.text },
  });