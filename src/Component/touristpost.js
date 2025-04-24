import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import { db, auth } from "../Database/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
//import ImageSelector from "./imageselect";

const Touristpost = () => {
  const {
    name,
    setname,
    email,
    setemail,
    password,
    setpassword,
    securepassword,
    setsecurepassword,
    lodgingModalVisible,
    setLodgingModalVisible,
    cateringModalVisible,
    setCateringModalVisible,
    transportModalVisible,
    setTransportModalVisible,
    securityModalVisible,
    setSecurityModalVisible,
    selectedButton,
    setSelectedButton,
    image,
    setImage,
  } = useContext(PracticeContext);

  return (
    <View>
      <Text>Hello</Text>
      <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    //backgroundColor: '#F5FCFF',
    marginTop: 20,
  },
});
export default Touristpost;
