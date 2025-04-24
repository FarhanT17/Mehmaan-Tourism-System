import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import { db } from "../Database/firebase";

const AccountScreen = ({ navigation }) => {
  const {
    name,
    setname,
    email,
    setemail,
    password,
    setpassword,
    user,
    logOut,
  } = useContext(PracticeContext);
  const Logout = () => {
    logOut();
  };

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#38aaa4" }}>
      <View style={styles.Main}>
        {user ? (
          <>
            <Text style={{ color: "white", marginLeft: 15 }}>
              {user.displayName}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#333",
                width: "40%",
                height: "90%",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                //margin: "6%",
                marginLeft: 212,
              }}
              onPress={() => {
                Logout();
                navigation.navigate("LoginScreen");
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.Top}></View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={{
                  backgroundColor: "darkslategray",
                  width: "40%",
                  height: "90%",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  marginTop: "6%",
                }}
                onPress={() => navigation.navigate("SignUpScreen")}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Registrationn
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Image
        source={require("./images/Mehmaanlogo2.jpg")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <Text style={styles.text}>Select Account Type</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HostScreen")}
          >
            <Text style={styles.buttonText}>Are you Host?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => navigation.navigate("TouristScreen")}
          >
            <Text style={styles.buttonText}>Are you Tourist?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38aaa4",
  },
  Main: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#38aaa4",
    //color: "darkslategray",
  },
  Top: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "smokewhite",
  },
  text: {
    color: "#333",
    fontSize: 18,
    marginTop: 5,
  },
  image: {
    width: 180,
    height: 120,
    marginLeft: 120,
    borderRadius: 17,
    marginTop: 62,
  },
  buttonsContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    width: 260,
  },
  button2: {
    backgroundColor: "#333",
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    width: 260,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    paddingLeft: 18,
  },
});

export default AccountScreen;
