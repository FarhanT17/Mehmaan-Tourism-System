import React, { useState, useContext, useLayoutEffect } from "react";
import Swiper from "react-native-swiper";
import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Image,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
//import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import LoginScreen from "./login";
import { storage, db, auth } from "../Database/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import {
//   doc,
//   setDoc,
//   Timestamp,
//   addDoc,
//   collection,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   date,
//   deleteDoc,
//   updateDoc,
// } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import { PracticeContext, PracticeProvider } from "../Practicecontext";
//import Addpost from "../Component/Addpost.js";

const Tab = createBottomTabNavigator();

const Profile = ({ navigation }) => {
  const { user, logOut } = useContext(PracticeContext);

  const Logout = () => {
    // Perform logout logic here
    logOut();
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../screens/images/usericon.png")}
          style={styles.userImage}
        />
        {user !== null && (
          <>
            <Text style={styles.profileText}>Welcome to Your Profile</Text>
            <Text style={styles.usernameText}>
              {user?.displayName || "User"}
            </Text>
            <Text style={styles.emailText}>{user?.email}</Text>
            {/* Add other profile information as needed */}

            <TouchableOpacity style={styles.logoutButton} onPress={Logout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Profile;
