import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/login";
import SignUpScreen from "./src/screens/signup";
import AccountScreen from "./src/screens/accounttype";
import HostScreen from "./src/screens/Host";
import TouristScreen from "./src/screens/tourist";
import { PracticeProvider, PracticeContext } from "./src/Practicecontext";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <PracticeProvider>
      <NavigationContainer>
        <Stack.Navigator
        //  initialRouteName="LoginScreen"
        // screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              //title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{
              //title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{
              headerStyle: {
                backgroundColor: "#38aaa4",
              },
              title: "     AccountType",
              //headerShown: false,
            }}
          />
          <Stack.Screen
            name="HostScreen"
            component={HostScreen}
            options={{
              headerStyle: {
                backgroundColor: "#38aaa4",
              },
              // title: "HostScreen",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TouristScreen"
            component={TouristScreen}
            options={{
              headerStyle: {
                backgroundColor: "#38aaa4",
              },
              // title: "     HostScreen",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PracticeProvider>
  );
}
