import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  Alert,
  Platform,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../Database/firebase";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import ImageSelector from "./imageselect";

const Addpost = ({ navigation }) => {
  const {
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
    user,
    logOut,
  } = useContext(PracticeContext);

  //const [image, setImage] = useState({ uri: "" });

  const [lodgingCity, setlodgingCity] = useState("");
  const [lodgingPrice, setlodgingPrice] = useState("");
  const [lodgingTiming, setlodgingTiming] = useState("");
  const [lodgingDescription, setlodgingDescription] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [cateringCity, setcateringCity] = useState("");
  const [cateringPrice, setcateringPrice] = useState("");
  const [cateringTiming, setcateringTiming] = useState("");
  const [cateringDescription, setcateringDescription] = useState("");

  const [transportCity, settransportCity] = useState("");
  const [transportPrice, settransportPrice] = useState("");
  const [transportTiming, settransportTiming] = useState("");
  const [transportDescription, settransportDescription] = useState("");

  const [securityCity, setsecurityCity] = useState("");
  const [securityPrice, setsecurityPrice] = useState("");
  const [securityTiming, setsecurityTiming] = useState("");
  const [securityDescription, setsecurityDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageurl, setImageUrl] = useState("");
  const [data, setData] = useState([]);

  const callsnapshot = () => {
    callFunction();
  };

  const sendImage = async () => {
    let resullt = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resullt.canceled) {
      setImage(resullt.uri);
    }
  };
  useEffect(() => {
    const uploadImage = async () => {
      alert("Image is Uploading! Wait!");

      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      /** @type {any} */
      const metadata = {
        contentType: "image/jpeg",
      };

      const storageRef = ref(storage, "images/" + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              //alert("storage not authorized");

              break;
            case "storage/canceled":
              //alert("Storeage not accessed");

              break;

            case "storage/unknown":
              //alert("unknown storage access");

              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //alert("Image Has Been Uploaded");
            console.log("File available at", downloadURL);
            setImageUrl(downloadURL);
          });
        }
      );
    };
    if (image != null) {
      uploadImage(), setImage(null);
    }
  }, [image]);

  const dateAndTime = moment().format("dddd, MM/DD/YY, hh:mm A");
  //console.log(dateAndTime); // Output: 06/07/23, 10:53 PM

  const uploadlodgingData = async () => {
    if (
      lodgingCity != "" &&
      lodgingPrice != "" &&
      lodgingTiming != "" &&
      lodgingDescription != "" &&
      imageurl != "" &&
      fromDate !== null &&
      toDate !== null
    ) {
      const docRef = await addDoc(collection(db, "Seller_posts"), {
        Category: selectedButton,
        City: lodgingCity,
        Price: lodgingPrice,
        Timing: lodgingTiming,
        Description: lodgingDescription,
        Image: imageurl,
        timestamp: dateAndTime,
        Name: user.displayName,
        FromDate: fromDate,
        ToDate: toDate,
        Email: user.email,
      }).then(() => {
        //console.log('User account created!');
        setlodgingCity("");
        setlodgingPrice("");
        setlodgingTiming("");
        setlodgingDescription("");
        setImageUrl("");
        setFromDate(null);
        setToDate(null); // Set the  input to an empty string
      });

      //console.log("Document written with ID:", docRef);
      alert("Your Data Uploaded Succussfully");
      console.log("Your Data Uploaded Succussfully");
    } else {
      alert("Kindly enter every Field of form");
    }
  };

  /* useEffect(() => {
    const ReadData = async () => {
      const docRef = doc(db, "AllData", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data: ", docSnap.data());
        setlodgingCity(docSnap.data().LodgingCity);
        setlodgingPrice(docSnap.data().LodgingPrice);
        setlodgingTiming(docSnap.data().LodgingTiming);
        setlodgingDescription(docSnap.data().LodgingDescription);
      } else {
        console.log("No Such document Found !");
      }
    };
    ReadData();
  }, []); */

  const uploadcateringData = async () => {
    if (
      cateringCity != "" &&
      cateringPrice != "" &&
      cateringTiming != "" &&
      cateringDescription != "" &&
      imageurl != ""
      //fromDate !== null &&
      //toDate !== null
    ) {
      const docRef = await addDoc(collection(db, "Seller_posts"), {
        Category: selectedButton,
        City: cateringCity,
        Price: cateringPrice,
        Timing: cateringTiming,
        Description: cateringDescription,
        Image: imageurl,
        timestamp: dateAndTime,
        Name: user.displayName,
        FromDate: fromDate,
        ToDate: toDate,
        Email: user.email,
      }).then(() => {
        //console.log('User account created!');
        setcateringCity("");
        setcateringPrice("");
        setcateringTiming("");
        setcateringDescription(""); // Set the  input to an empty string
        setImageUrl("");
        setFromDate(null);
        setToDate(null);
      });

      //console.log("Document written with ID:", docRef);
      alert("Your Data Uploaded Succussfully");
    } else {
      alert("Kindly enter every Field of form");
    }
  };

  const uploadtransportData = async () => {
    if (
      transportCity != "" &&
      transportPrice != "" &&
      transportTiming != "" &&
      transportDescription != "" &&
      imageurl != ""
      //fromDate !== null &&
      //toDate !== null
    ) {
      const docRef = await addDoc(collection(db, "Seller_posts"), {
        Category: selectedButton,
        City: transportCity,
        Price: transportPrice,
        Timing: transportTiming,
        Description: transportDescription,
        Image: imageurl,
        timestamp: dateAndTime,
        Name: user.displayName,
        FromDate: fromDate,
        ToDate: toDate,
        Email: user.email,
      }).then(() => {
        //console.log('User account created!');
        settransportCity("");
        settransportPrice("");
        settransportTiming("");
        settransportDescription(""); // Set the  input to an empty string
        setImageUrl("");
        setFromDate(null);
        setToDate(null);
      });

      //console.log("Document written with ID:", docRef);
      alert("Your Data Uploaded Succussfully");
    } else {
      alert("Kindly enter every Field of form");
    }
  };

  const uploadsecurityData = async () => {
    if (
      securityCity != "" &&
      securityPrice != "" &&
      securityTiming != "" &&
      securityDescription != "" &&
      imageurl != ""
      //fromDate !== null &&
      //toDate !== null
    ) {
      const docRef = await addDoc(collection(db, "Seller_posts"), {
        Category: selectedButton,
        City: securityCity,
        Price: securityPrice,
        Timing: securityTiming,
        Description: securityDescription,
        Image: imageurl,
        timestamp: dateAndTime,
        Name: user.displayName,
        FromDate: fromDate,
        ToDate: toDate,
        Email: user.email,
      }).then(() => {
        //console.log('User account created!');
        setsecurityCity("");
        setsecurityPrice("");
        setsecurityTiming("");
        setsecurityDescription(""); // Set the  input to an empty string
        setImageUrl("");
        setFromDate(null);
        setToDate(null);
      });

      //console.log("Document written with ID:", docRef);
      alert("Your Data Uploaded Succussfully");
    } else {
      alert("Kindly enter every Field of form");
    }
  };

  const handleLodgingButtonPress = () => {
    setLodgingModalVisible(true);
    setSelectedButton("Lodging");
  };

  const handleCateringButtonPress = () => {
    setCateringModalVisible(true);
    setSelectedButton("Catering");
  };

  const handleTransportButtonPress = () => {
    setTransportModalVisible(true);
    setSelectedButton("Transport");
  };

  const handleSecurityButtonPress = () => {
    setSecurityModalVisible(true);
    setSelectedButton("Security");
  };

  const handleCloseButtonPress = () => {
    setLodgingModalVisible(false);
    setCateringModalVisible(false);
    setTransportModalVisible(false);
    setSecurityModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLodgingButtonPress("lodging")}
      >
        <Text>Lodging</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCateringButtonPress("catering")}
      >
        <Text>Catering</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTransportButtonPress("transport")}
      >
        <Text>Transport</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSecurityButtonPress("security")}
      >
        <Text>Security</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={lodgingModalVisible}
        onRequestClose={() => setLodgingModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Provide details about {selectedButton} services to post
          </Text>
          <View style={styles.modalContent}>
            <ScrollView style={styles.scrollView}>
              <View>
                {/* Select Dates button */}
                <TouchableOpacity
                  onPress={() => setCalendarVisible(!calendarVisible)}
                >
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Select Dates
                  </Text>
                </TouchableOpacity>

                {/* From and To Date selection */}
                {calendarVisible && (
                  <View>
                    {/* Select From Date */}
                    {!fromDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select From Date:
                      </Text>
                    )}
                    {fromDate && !toDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select To Date:
                      </Text>
                    )}

                    {/* Calendar */}
                    <Calendar
                      style={{
                        //color: "white",
                        marginBottom: 11,
                        //fontWeight: "bold",
                      }}
                      onDayPress={(day) => {
                        if (!fromDate) {
                          // If from date is not selected, set it as the selected date
                          setFromDate(day.dateString);
                        } else if (!toDate && day.dateString !== fromDate) {
                          // If from date is already selected but to date is not, and it's not the same as the from date, set it as the selected date
                          setToDate(day.dateString);
                          setCalendarVisible(false); // Close the calendar after selecting both dates
                        } else {
                          // If both from and to dates are already selected or the selected date is the same as the from date, reset the selection
                          setFromDate(day.dateString);
                          setToDate(null);
                        }
                      }}
                      markedDates={{
                        [fromDate]: {
                          startingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        [toDate]: {
                          endingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        // Add additional marked dates if needed
                      }}
                    />
                  </View>
                )}

                {/* Display the selected dates */}

                {/* Alert for selecting same dates */}
                {fromDate &&
                  toDate &&
                  fromDate === toDate &&
                  Alert.alert(
                    "Invalid Date Selection",
                    "You cannot select the same date for 'From' and 'To'."
                  )}

                {/* Alert for selecting invalid date range */}
                {fromDate &&
                  toDate &&
                  toDate < fromDate &&
                  Alert.alert(
                    "Invalid Date Range",
                    "Please select a valid date range."
                  )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter City name"
                onChangeText={(text) => setlodgingCity(text)}
                value={lodgingCity}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                onChangeText={(text) => setlodgingPrice(text)}
                value={lodgingPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Timing"
                onChangeText={(text) => setlodgingTiming(text)}
                value={lodgingTiming}
              />

              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.inputdescription}
                placeholder="Description about your services"
                onChangeText={(text) => setlodgingDescription(text)}
                value={lodgingDescription}
              />
              <View style={styles.containerimage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagge} />
                ) : (
                  <TouchableOpacity style={styles.buttton} onPress={sendImage}>
                    <Text style={styles.butttonText}>
                      Select Image from Gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setLodgingModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadlodgingData()}>
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        visible={cateringModalVisible}
        onRequestClose={() => setCateringModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Provide details about {selectedButton} services to post
          </Text>

          <View style={styles.modalContent}>
            <ScrollView style={styles.scrollView}>
              <View>
                {/* Select Dates button */}
                <TouchableOpacity
                  onPress={() => setCalendarVisible(!calendarVisible)}
                >
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Select Dates
                  </Text>
                </TouchableOpacity>

                {/* From and To Date selection */}
                {calendarVisible && (
                  <View>
                    {/* Select From Date */}
                    {!fromDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select From Date:
                      </Text>
                    )}
                    {fromDate && !toDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select To Date:
                      </Text>
                    )}

                    {/* Calendar */}
                    <Calendar
                      style={{
                        //color: "white",
                        marginBottom: 11,
                        //fontWeight: "bold",
                      }}
                      onDayPress={(day) => {
                        if (!fromDate) {
                          // If from date is not selected, set it as the selected date
                          setFromDate(day.dateString);
                        } else if (!toDate && day.dateString !== fromDate) {
                          // If from date is already selected but to date is not, and it's not the same as the from date, set it as the selected date
                          setToDate(day.dateString);
                          setCalendarVisible(false); // Close the calendar after selecting both dates
                        } else {
                          // If both from and to dates are already selected or the selected date is the same as the from date, reset the selection
                          setFromDate(day.dateString);
                          setToDate(null);
                        }
                      }}
                      markedDates={{
                        [fromDate]: {
                          startingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        [toDate]: {
                          endingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        // Add additional marked dates if needed
                      }}
                    />
                  </View>
                )}

                {/* Display the selected dates */}

                {/* Alert for selecting same dates */}
                {fromDate &&
                  toDate &&
                  fromDate === toDate &&
                  Alert.alert(
                    "Invalid Date Selection",
                    "You cannot select the same date for 'From' and 'To'."
                  )}

                {/* Alert for selecting invalid date range */}
                {fromDate &&
                  toDate &&
                  toDate < fromDate &&
                  Alert.alert(
                    "Invalid Date Range",
                    "Please select a valid date range."
                  )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter City name"
                onChangeText={(text) => setcateringCity(text)}
                value={cateringCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                onChangeText={(text) => setcateringPrice(text)}
                value={cateringPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Food"
                onChangeText={(text) => setcateringTiming(text)}
                value={cateringTiming}
              />
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.inputdescription}
                placeholder="Description about your services"
                onChangeText={(text) => setcateringDescription(text)}
                value={cateringDescription}
              />
              <View style={styles.containerimage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagge} />
                ) : (
                  <TouchableOpacity style={styles.buttton} onPress={sendImage}>
                    <Text style={styles.butttonText}>
                      Select Image from Gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCateringModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadcateringData()}>
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        visible={transportModalVisible}
        onRequestClose={() => setTransportModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Provide details about {selectedButton} services to post
          </Text>
          <View style={styles.modalContent}>
            <ScrollView style={styles.scrollView}>
              <View>
                {/* Select Dates button */}
                <TouchableOpacity
                  onPress={() => setCalendarVisible(!calendarVisible)}
                >
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Select Dates
                  </Text>
                </TouchableOpacity>

                {/* From and To Date selection */}
                {calendarVisible && (
                  <View>
                    {/* Select From Date */}
                    {!fromDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select From Date:
                      </Text>
                    )}
                    {fromDate && !toDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select To Date:
                      </Text>
                    )}

                    {/* Calendar */}
                    <Calendar
                      style={{
                        //color: "white",
                        marginBottom: 11,
                        //fontWeight: "bold",
                      }}
                      onDayPress={(day) => {
                        if (!fromDate) {
                          // If from date is not selected, set it as the selected date
                          setFromDate(day.dateString);
                        } else if (!toDate && day.dateString !== fromDate) {
                          // If from date is already selected but to date is not, and it's not the same as the from date, set it as the selected date
                          setToDate(day.dateString);
                          setCalendarVisible(false); // Close the calendar after selecting both dates
                        } else {
                          // If both from and to dates are already selected or the selected date is the same as the from date, reset the selection
                          setFromDate(day.dateString);
                          setToDate(null);
                        }
                      }}
                      markedDates={{
                        [fromDate]: {
                          startingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        [toDate]: {
                          endingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        // Add additional marked dates if needed
                      }}
                    />
                  </View>
                )}

                {/* Display the selected dates */}

                {/* Alert for selecting same dates */}
                {fromDate &&
                  toDate &&
                  fromDate === toDate &&
                  Alert.alert(
                    "Invalid Date Selection",
                    "You cannot select the same date for 'From' and 'To'."
                  )}

                {/* Alert for selecting invalid date range */}
                {fromDate &&
                  toDate &&
                  toDate < fromDate &&
                  Alert.alert(
                    "Invalid Date Range",
                    "Please select a valid date range."
                  )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter City name"
                onChangeText={(text) => settransportCity(text)}
                value={transportCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                onChangeText={(text) => settransportPrice(text)}
                value={transportPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Vehicle name & no"
                onChangeText={(text) => settransportTiming(text)}
                value={transportTiming}
              />
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.inputdescription}
                placeholder="Description about your services"
                onChangeText={(text) => settransportDescription(text)}
                value={transportDescription}
              />
              <View style={styles.containerimage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagge} />
                ) : (
                  <TouchableOpacity style={styles.buttton} onPress={sendImage}>
                    <Text style={styles.butttonText}>
                      Select Image from Gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setTransportModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadtransportData()}>
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        visible={securityModalVisible}
        onRequestClose={() => setSecurityModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Provide details about {selectedButton} services to post
          </Text>
          <View style={styles.modalContent}>
            <ScrollView style={styles.scrollView}>
              <View>
                {/* Select Dates button */}
                <TouchableOpacity
                  onPress={() => setCalendarVisible(!calendarVisible)}
                >
                  <Text
                    style={{
                      color: "white",
                      marginBottom: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Select Dates
                  </Text>
                </TouchableOpacity>

                {/* From and To Date selection */}
                {calendarVisible && (
                  <View>
                    {/* Select From Date */}
                    {!fromDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select From Date:
                      </Text>
                    )}
                    {fromDate && !toDate && (
                      <Text
                        style={{
                          color: "white",
                          marginBottom: 8,
                          fontWeight: "bold",
                        }}
                      >
                        Select To Date:
                      </Text>
                    )}

                    {/* Calendar */}
                    <Calendar
                      style={{
                        //color: "white",
                        marginBottom: 11,
                        //fontWeight: "bold",
                      }}
                      onDayPress={(day) => {
                        if (!fromDate) {
                          // If from date is not selected, set it as the selected date
                          setFromDate(day.dateString);
                        } else if (!toDate && day.dateString !== fromDate) {
                          // If from date is already selected but to date is not, and it's not the same as the from date, set it as the selected date
                          setToDate(day.dateString);
                          setCalendarVisible(false); // Close the calendar after selecting both dates
                        } else {
                          // If both from and to dates are already selected or the selected date is the same as the from date, reset the selection
                          setFromDate(day.dateString);
                          setToDate(null);
                        }
                      }}
                      markedDates={{
                        [fromDate]: {
                          startingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        [toDate]: {
                          endingDay: true,
                          color: "blue",
                          textColor: "white",
                        },
                        // Add additional marked dates if needed
                      }}
                    />
                  </View>
                )}

                {/* Display the selected dates */}

                {/* Alert for selecting same dates */}
                {fromDate &&
                  toDate &&
                  fromDate === toDate &&
                  Alert.alert(
                    "Invalid Date Selection",
                    "You cannot select the same date for 'From' and 'To'."
                  )}

                {/* Alert for selecting invalid date range */}
                {fromDate &&
                  toDate &&
                  toDate < fromDate &&
                  Alert.alert(
                    "Invalid Date Range",
                    "Please select a valid date range."
                  )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter City name"
                onChangeText={(text) => setsecurityCity(text)}
                value={securityCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                onChangeText={(text) => setsecurityPrice(text)}
                value={securityPrice}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter no of security guards"
                onChangeText={(text) => setsecurityTiming(text)}
                value={securityTiming}
              />
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.inputdescription}
                placeholder="Description about your services"
                onChangeText={(text) => setsecurityDescription(text)}
                value={securityDescription}
              />
              <View style={styles.containerimage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.imagge} />
                ) : (
                  <TouchableOpacity style={styles.buttton} onPress={sendImage}>
                    <Text style={styles.butttonText}>
                      Select Image from Gallery
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSecurityModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadsecurityData()}>
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    //backgroundColor: "#38aaa4",
    //backgroundColor: "#eae9e3",
    marginTop: 7,
  },
  button: {
    backgroundColor: "#dedede",
    //borderColor: "red",
    //borderBottomColor: "red",
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  containerimage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttton: {
    backgroundColor: "#494F55",
    padding: 10,
    borderRadius: 5,
  },
  butttonText: {
    color: "white",
  },
  imagge: {
    width: 200,
    height: 200,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    backgroundColor: "#38aaa4",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    backgroundColor: "#38aaa4",
  },
  closeButton: {
    fontSize: 16,
    color: "#888",
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    backgroundColor: "black",
    //width: 10,
    //height: 10,
  },
  uploadButton: {
    fontSize: 16,
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    backgroundColor: "black",
    //width: 10,
    //height: 10,
  },
  modalContent: {
    borderColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38aaa4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    width: 270,
    //width: "100%",
    height: 35,
    borderColor: "black",
    marginBottom: 13,
    backgroundColor: "white",
  },

  inputdescription: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    //width: "100%",
    //height: 35,
    borderColor: "black",
    marginBottom: 13,
    backgroundColor: "white",
  },

  scrollView: {
    maxHeight: 204,
    //backgroundColor: "#FFFFFF",
  },
});
export default Addpost;
