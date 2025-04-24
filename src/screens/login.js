import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  Image,
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import { auth } from "../Database/firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
//import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [InputsEmail, setEmailInputs] = useState("");
  const [InputsPassword, setPasswordInputs] = useState("");
  const { securepassword, setsecurepassword } = useContext(PracticeContext);
  const [message, setMessage] = useState("");

  // const handleLogin = async () => {
  //   try {
  //     if (InputsEmail.length > 0 && InputsPassword.length > 0) {
  //       const user = await auth().signInUserWithEmailAndPassword(
  //         InputsEmail,
  //         InputsPassword
  //       );
  //       console.log(user);
  //       if (user.user.emailVerified) {
  //         Alert.alert("Successfully Logged in ");
  //         navigation.replace("AccountScreen");
  //       } else {
  //         Alert.alert("Please Verify Your Email");
  //       }
  //     } else {
  //       Alert.alert("Please Enter All Data");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setMessage(err.message);
  //   }
  // };

  const auth = getAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    try {
      if (InputsEmail.length > 0 && InputsPassword.length > 0) {
        // Additional check for password length
        if (InputsPassword.length < 6) {
          Alert.alert(
            "Invalid Password",
            "Password should be at least 6 characters long."
          );
          console.log("Invalid Password");
          return;
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          InputsEmail,
          InputsPassword
        );

        if (userCredential.user.emailVerified) {
          // Email is verified, proceed with login
          Alert.alert("Successfully Logged in");
          console.log("Successfully Logged in");
          navigation.replace("AccountScreen");
        } else {
          // Email is not verified
          Alert.alert("Please Verify Your Email to Login");
          console.log("Please Verify Your Email to Login");
        }
      } else {
        Alert.alert("Please Enter All Data");
        console.log("Please Enter All Data");
      }
    } catch (err) {
      // Handle different authentication errors
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        Alert.alert("Invalid Email", "Please check your email and try again.");
        console.log("Invalid Email");
      } else if (err.code === "auth/wrong-password") {
        Alert.alert(
          "Invalid Password",
          "Please check your password and try again."
        );
        console.log("Invalid Password");
      } else {
        console.log(err);
        setMessage(err.message);
      }
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     if (InputsEmail.length > 0 && InputsPassword.length > 0) {
  //       const user = await signInWithEmailAndPassword(
  //         auth,
  //         //InputsName,
  //         InputsEmail,
  //         InputsPassword
  //       );
  //       console.log(user);
  //       if (user.user.emailVerified) {
  //         Alert.alert("Successfully Logged in");
  //         console.log("Successfully Logged in");
  //         navigation.replace("AccountScreen");
  //       } else {
  //         Alert.alert("Please Verify Your Email to Login");
  //         console.log("Please Verify Your Email to Login");
  //       }
  //     } else {
  //       Alert.alert("Please Enter All Data");
  //       console.log("Please Enter All Data");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setMessage(err.message);
  //   }
  // };

  // const Login = async () => {
  //   try {
  //     //Sign In User with Email and Password
  //     const res = await auth
  //       .signInWithEmailAndPassword(InputsEmail, InputsPassword)
  //       .then(() => {
  //         alert("Login Successfully");
  //       });
  //     navigation.replace("AccountScreen");
  //   } catch (error) {
  //     alert(error.message);
  //   }
  //   setEmailInputs("");
  //   setPasswordInputs("");
  // };

  return (
    <ScrollView
      style={{ paddingTop: 135, height: "100%", backgroundColor: "#38aaa4" }}
    >
      <Image
        source={require("./images/loginlogo.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <Text style={styles.title}> Login</Text>
        <TextInput
          style={styles.input}
          label="Email"
          left={<TextInput.Icon icon={"email"} />}
          mode="outlined"
          value={InputsEmail}
          autoComplete="off"
          onChangeText={(event) => {
            setEmailInputs(event);
          }}
        />
        <HelperText
          type="error"
          visible={InputsEmail.length > 0 && !validateEmail(InputsEmail)}
          style={{
            marginRight: 195,
            marginTop: -15,
            marginBottom: -12,
            fontWeight: "bold",
          }}
        >
          Invalid email address
        </HelperText>
        <TextInput
          style={styles.input}
          label="Password"
          left={<TextInput.Icon icon={"lock"} />}
          mode="outlined"
          autoComplete="off"
          value={InputsPassword}
          onChangeText={(event) => {
            setPasswordInputs(event);
          }}
          right={
            <TextInput.Icon
              icon={securepassword ? "eye-off" : "eye"}
              onPress={() => setsecurepassword(!securepassword)}
            />
          }
          secureTextEntry={securepassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            //Login();
            handleLogin();
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    //paddingTop: 135,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 40,
    marginVertical: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 7,
    marginBottom: 3,
    alignSelf: "center", // Center the image horizontally
    marginTop: 50,
  },
  button: {
    width: 170,
    height: 45,
    backgroundColor: "#333",
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#333",
    marginTop: 20,
  },
});
export default LoginScreen;
