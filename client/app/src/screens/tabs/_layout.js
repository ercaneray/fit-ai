import React from "react";
import { View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

const TabLayout = () => (
  <Tabs screenOptions={{
    tabBarActiveTintColor: "#BBF246",
    tabBarInactiveTintColor: "#FFF",
    tabBarStyle: {
      backgroundColor: "#0c0c14",
      borderTopWidth: 0,
      height: 70,
      paddingBottom: 10,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  }}>
   

    <Tabs.Screen
      name="my-workout-program"
      options={{
        header: ({ navigation }) => (
          <View style={{
            backgroundColor: "#121212",
            height: 90,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingTop: 50 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#BBF246" />
            </TouchableOpacity>
          </View>
        ),
        headerShown: true,
        headerTitle: "",
        title: "Antrenman",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="dumbbell" size={24} color={color} />
        ),
      }}
    />
 <Tabs.Screen
      name="main-page"
      options={{
        header: ({ navigation }) => (
          <View style={{
            backgroundColor: "#121212",
            height: 90,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingTop: 50 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#BBF246" />
            </TouchableOpacity>
          </View>
        ),
        headerTitle: false,
        title: "Anasayfa",
        tabBarIcon: ({ color }) => (
          <FontAwesome name="home" size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="my-diet-program"
      options={{
        header: ({ navigation }) => (
          <View style={{
            backgroundColor: "#121212",
            height: 90,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingTop: 50 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#BBF246" />
            </TouchableOpacity>
          </View>
        ),
        headerShown: true,
        headerTitle: "",
        title: "Diyet",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="food-apple" size={24} color={color} />
        ),
      }}
    />
  </Tabs>
);

export default TabLayout;