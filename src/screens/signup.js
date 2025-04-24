import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { TextInput, HelperText } from "react-native-paper";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import { db } from "../Database/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";

const auth = getAuth();

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SignUpScreen = ({ navigation }) => {
  const [InputsName, setNameInputs] = useState("");
  const [InputsEmail, setEmailInputs] = useState("");
  const [InputsPassword, setPasswordInputs] = useState("");
  const [isVerificationLinkSent, setIsVerificationLinkSent] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useContext(PracticeContext);

  // const handleSignup = async () => {
  //   try {
  //     if (InputsEmail.length > 0 && InputsPassword.length > 0) {
  //       const isUserCreated = await auth.createUserWithEmailAndPassword();
  //       InputsEmail,
  //         InputsPassword,
  //         await auth.currentUser.sendEmailVerification();
  //       await auth.signOut();
  //       Alert.alert("Please Verify Your Email, Check out your inbox ");
  //       navigation.replace("LoginScreen");
  //     } else {
  //       Alert.alert("Please Enter All Data");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setMessage(err.message);
  //   }
  // };

  // const handleSignup = async () => {
  //   try {
  //     console.log("InputsName:", InputsName);
  //     console.log("InputsEmail:", InputsEmail);
  //     console.log("InputsPassword:", InputsPassword);

  //     if (!InputsName.trim() || !InputsEmail.trim() || !InputsPassword.trim()) {
  //       // Check if any of the required fields are empty or contain only spaces
  //       Alert.alert("Please Enter All Data");
  //       return;
  //     }

  //     // Check if the name contains digits using regular expression
  //     const hasDigits = /\d/.test(InputsName);
  //     if (hasDigits) {
  //       Alert.alert("Name should not contain digits");
  //       return;
  //     }

  //     // Check if the email has a valid format using regular expression
  //     const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(InputsEmail);
  //     if (!isValidEmailFormat) {
  //       Alert.alert("Invalid email address format");
  //       return;
  //     }

  //     if (InputsPassword.length < 6) {
  //       // Check if the password is less than 6 characters
  //       Alert.alert("Password should be at least 6 characters long");
  //       return;
  //     }

  //     // All required fields have been provided, proceed with sign up
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       InputsEmail,
  //       InputsPassword
  //     );
  //     await updateProfile(userCredential.user, {
  //       displayName: InputsName,
  //     });
  //     await sendEmailVerification(auth.currentUser);
  //     Alert.alert(
  //       "Please Verify Your Email",
  //       "Check your inbox for the verification email.",
  //       [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             navigation.replace("LoginScreen");
  //           },
  //         },
  //       ]
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     setMessage(err.message);
  //   }
  // };

  const handleSignup = async () => {
    try {
      console.log("InputsName:", InputsName);
      console.log("InputsEmail:", InputsEmail);
      console.log("InputsPassword:", InputsPassword);

      if (!InputsName.trim() || !InputsEmail.trim() || !InputsPassword.trim()) {
        // Check if any of the required fields are empty or contain only spaces
        Alert.alert("Please Enter All Data");
        return;
      }

      // Check if the name contains digits using regular expression
      const hasDigits = /\d/.test(InputsName);
      if (hasDigits) {
        Alert.alert("Name should not contain digits");
        return;
      }

      // Check if the email has a valid format using regular expression
      const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(InputsEmail);
      if (!isValidEmailFormat) {
        Alert.alert("Invalid email address format");
        return;
      }

      if (InputsPassword.length < 6) {
        // Check if the password is less than 6 characters
        Alert.alert("Password should be at least 6 characters long");
        return;
      }

      // Check if the email is already registered with Firebase
      try {
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          InputsEmail
        );
        if (signInMethods.length > 0) {
          // The email is already registered
          Alert.alert(
            "Email is already registered. Please sign in or use a different email."
          );
          return;
        }
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Error checking email availability. Please try again later."
        );
        return;
      }

      // All required fields have been provided, proceed with sign up
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        InputsEmail,
        InputsPassword
      );
      await updateProfile(userCredential.user, {
        displayName: InputsName,
      });
      await sendEmailVerification(auth.currentUser);
      Alert.alert(
        "Please Verify Your Email",
        "Check your inbox for the verification email.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.replace("LoginScreen");
            },
          },
        ]
      );
    } catch (err) {
      console.log(err);
      setMessage(err.message);
    }
  };

  // const handleSignup = async () => {
  //   try {
  //     if (InputsEmail.length > 0 && InputsPassword.length > 0) {
  //       const userCredential = await createUserWithEmailAndPassword(
  //         auth,
  //         InputsEmail,
  //         InputsPassword
  //       );
  //       await updateProfile(userCredential.user, {
  //         displayName: InputsName,
  //       });
  //       await sendEmailVerification(auth.currentUser);
  //       Alert.alert(
  //         "Please Verify Your Email",
  //         "Check your inbox for the verification email."
  //       );
  //       console.log(
  //         "Please Verify Your Email",
  //         "Check your inbox for the verification email."
  //       );
  //       navigation.replace("LoginScreen");
  //     } else {
  //       Alert.alert("Please Enter All Data");
  //       console.log("Please Enter All Data");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setMessage(err.message);
  //   }
  // };

  // const SendOtp = async () => {
  //   const email = InputsEmail;
  //   const isValidEmail = validateEmail(email);
  //   if (!isValidEmail) {
  //     Alert.alert("Invalid email address");
  //     return;
  //   }

  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       InputsEmail,
  //       InputsPassword
  //     );
  //     await updateProfile(userCredential.user, {
  //       displayName: InputsName,
  //     });
  //     await sendEmailVerification(userCredential.user);
  //     setIsVerificationLinkSent(true);
  //     Alert.alert("Verify Link and then press Sign Up to create an account");
  //     console.log("Verify Link and then press Sign Up to create an account");
  //   } catch (error) {
  //     const errorMessage = error.message;
  //     Alert.alert("Account not created!!", errorMessage);
  //   }

  //setNameInputs("");
  //setEmailInputs("");
  //setPasswordInputs("");
  //};

  // const Signup = () => {
  //   alert("Account Created Successfully");
  //   navigation.replace("LoginScreen");
  //   setNameInputs("");
  //   setEmailInputs("");
  //   setPasswordInputs("");
  // };

  // const Signup = async () => {
  //   try {
  //     const Respond = await auth.createUserWithEmailAndPassword(
  //       InputsEmail,
  //       InputsPassword
  //     );
  //     Respond.user.updateProfile({
  //       displayName: InputsName,
  //     });
  //     alert("Account Created Successfully");
  //     navigation.replace("LoginScreen");
  //   } catch (error) {
  //     var errorMessage = error.message;
  //     alert("Account not created!!" + errorMessage);
  //   }
  //   setNameInputs("");
  //   setEmailInputs("");
  //   setPasswordInputs("");
  // };

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#38aaa4" }}>
      <Image
        source={require("./images/loginlogo.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          label="Name"
          value={InputsName}
          autoComplete="off"
          left={<TextInput.Icon icon={"account-box-outline"} />}
          mode="outlined"
          onChangeText={(val) => setNameInputs(val)}
        />
        <TextInput
          style={styles.input}
          label="Email"
          value={InputsEmail}
          autoComplete="off"
          left={<TextInput.Icon icon={"email"} />}
          mode="outlined"
          activeUnderlineColor="green"
          underlineColor="pink"
          //theme={{ colors: { text: "red" } }}
          onChangeText={(val) => setEmailInputs(val)}
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
        {/* <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 5,
            borderRadius: 5,
            marginBottom: 1,
            marginLeft: 145,
          }}
          onPress={SendOtp}
        >
          <Text style={styles.buttonText}>Send Verification Link Link</Text>
        </TouchableOpacity> */}
        <TextInput
          style={styles.input}
          label="Password"
          left={<TextInput.Icon icon={"lock"} />}
          mode="outlined"
          secureTextEntry
          //right={<TextInput.Icon icon="eye" />}
          autoComplete="off"
          value={InputsPassword}
          onChangeText={(val) => setPasswordInputs(val)}
        />
        <TouchableOpacity
          style={styles.button}
          //disabled={!isVerificationLinkSent}
          onPress={() => {
            //Signup();
            handleSignup();
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#38aaa4",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: -10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 7,
    marginBottom: 3,
    alignSelf: "center", // Center the image horizontally
    marginTop: 100,
  },
  input: {
    width: "90%",
    height: 40,
    marginVertical: 10,
  },
  button: {
    width: "70%",
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
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  link: {
    color: "#333",
    marginTop: 20,
  },
});
export default SignUpScreen;
