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
import LoginScreen from "./login";
import { storage, db, auth } from "../Database/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  date,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import { PracticeContext, PracticeProvider } from "../Practicecontext";
import Addpost from "../Component/Addpost.js";

const Tab = createBottomTabNavigator();

const ChatScreen = () => {
  const chatData = [
    {
      id: "1",
      sender: "Asad",
      message: "Yes, the service is nice?",
      dp: require("../screens/images/usericon.png"),
    },
    {
      id: "2",
      sender: "Kamran",
      message: "I am good, thanks!",
      dp: require("../screens/images/user.png"),
    },
    {
      id: "3",
      sender: "Bilal",
      message: "Thank you, for the services",
      dp: require("../screens/images/user-1.png"),
    },
    {
      id: "4",
      sender: "Naveed",
      message: "The food was very tasty.",
      dp: require("../screens/images/usericon.png"),
    },
    // Add more chat messages here
  ];

  const renderChatItem = ({ item }) => (
    <View style={styles.chatItemContainer}>
      <Image source={item.dp} style={styles.dp} />
      <View style={styles.messageContainer}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const NotificationScreen = () => {
  const notificationData = [
    {
      id: "1",
      message: "Kamran has ordered food.",
      time: "2 hours ago",
      icon: require("../screens/images/user-1.png"),
    },
    {
      id: "2",
      message: "Naveed has requested for guards.",
      time: "4 hours ago",
      con: require("../screens/images/usericon.png"),
    },
    // Add more notification messages here
  ];

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItemContainer}>
      <Image source={item.icon} style={styles.icon} />
      <View style={styles.notificationContent}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notificationData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const UploadScreen = () => (
  <View style={styles.container}>
    <Text style={styles.service}>Choose Service to Provide</Text>
    <Addpost></Addpost>
    <View style={styles.wellcomecontainer}>
      <Text style={styles.heading}>Welcome to Mehmaan App</Text>
      <Text style={styles.subtitle}>
        Where unforgettable memories are made!
      </Text>
      <Text style={styles.description}>
        We're thrilled that you've chosen our app. Discover travel inspiration,
        practical tips, and personalized recommendations to make your next
        adventure unforgettable.
      </Text>
      <Text style={styles.startText}>Let's get started!</Text>
    </View>
    <Swiper style={styles.wrapper} autoplay={true} autoplayTimeout={3}>
      <View style={styles.slide}>
        <Image
          source={require("./images/transport.jpg")}
          style={styles.customimage}
        />
      </View>
      <View style={styles.slide}>
        <Image
          source={require("./images/food.jpg")}
          style={styles.customimage}
        />
      </View>
      <View style={styles.slide}>
        <Image
          source={require("./images/transport.jpg")}
          style={styles.customimage}
        />
      </View>
      <View style={styles.slide}>
        <Image
          source={require("./images/food.jpg")}
          style={styles.customimage}
        />
      </View>
    </Swiper>
  </View>
);

const UserpostsScreen = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});

  const handleOptionsToggle = (itemId) => {
    setSelectedItem((prevItemId) => (prevItemId === itemId ? null : itemId));
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete the post from Firebase Firestore
              await deleteDoc(doc(db, "Seller_posts", itemId));
              // Optional: Show a success message
              Alert.alert("Success", "Post deleted successfully");
              console.log("Success", "Post deleted successfully");
            } catch (error) {
              console.error("Error deleting post:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (itemId) => {
    setShowOptions((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));

    //const item = data.find((i) => i.id === itemId);
    //setEditItem(item);
    //setShowEditModal(true);
    // Handle edit logic here
    console.log("Edit option selected for item:", itemId);
    setShowOptions((prevState) => ({
      ...prevState,
      [itemId]: false,
    }));
  };

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleEditPress = (item) => {
    setEditedItem(item);
    setEditedItemData(item.data);
    setEditModalVisible(true);
  };
  const handleUpdate = async () => {
    try {
      // Extract the edited values from the 'editedItem' and 'editedItemData' state variables
      const { id } = editedItem;

      // Update the Firestore document with the edited values
      const docRef = doc(db, "Seller_posts", id);
      await updateDoc(docRef, editedItemData);

      // Hide the edit modal
      setEditModalVisible(false);

      // Show success alert
      Alert.alert("Success", "Card updated successfully!");
      console.log("Success", "Card updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle the error accordingly (e.g., display an error message)
      Alert.alert("Error", "An error occurred while updating the card.");
    }
  };

  const handleBack = () => {
    setEditModalVisible(false);
  };

  useLayoutEffect(() => {
    const ref = collection(db, "Seller_posts");
    const q = query(
      ref,
      where("Email", "==", firebase.auth().currentUser.email),
      orderBy("timestamp", "desc")
    );

    onSnapshot(q, (props) =>
      setData(
        props.docs.map((category) => ({
          id: category.id,
          data: category.data(),
        }))
      )
    );
  });

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: "red",
          }}
        >
          You haven't posted any posts.
        </Text>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.cardContainer}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleCardPress(item)}
              >
                <Image style={styles.image} source={{ uri: item.data.Image }} />
                <View style={styles.details}>
                  <Text style={styles.text}>
                    {item.data.Category}, {item.data.City}
                  </Text>

                  <Text style={styles.text}>{item.data.timestamp}</Text>
                  <Text style={styles.text}>{item.data.Price} Rs</Text>

                  {/* <Text style={styles.text}>{item.data.Description}</Text>
                <Text style={styles.text}>
                  Available from {item.data.FromDate} to {item.data.ToDate}
                </Text> */}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditPress(item)}
                  >
                    <Ionicons name="create-outline" size={22} color="white" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="white" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.editModalContainer}>
          <ScrollView>
            <Text style={styles.editModalHeader}>Edit your Post</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={editedItemData.Category}
              editable={false}
              selectTextOnFocus={false}
              placeholder="Category"
            />
            <Text
              style={{
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              From Date
            </Text>
            <TextInput
              style={styles.input}
              value={editedItemData.FromDate}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({
                  ...prevData,
                  FromDate: text,
                }))
              }
              placeholder="FromDate"
            />
            <Text
              style={{
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              To Date
            </Text>
            <TextInput
              style={styles.input}
              value={editedItemData.ToDate}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({
                  ...prevData,
                  ToDate: text,
                }))
              }
              placeholder="ToDate"
            />
            <TextInput
              style={styles.input}
              value={editedItemData.City}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({ ...prevData, City: text }))
              }
              placeholder="City"
            />
            <TextInput
              style={styles.input}
              value={editedItemData.Timing}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({
                  ...prevData,
                  Timing: text,
                }))
              }
              placeholder="Timing"
            />
            <TextInput
              style={styles.input}
              value={editedItemData.Price}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({
                  ...prevData,
                  Price: text,
                }))
              }
              placeholder="Price"
            />
            <TextInput
              multiline
              numberOfLines={4}
              style={styles.input}
              value={editedItemData.Description}
              onChangeText={(text) =>
                setEditedItemData((prevData) => ({
                  ...prevData,
                  Description: text,
                }))
              }
              placeholder="Description"
            />

            {/* Repeat the same pattern for other input fields */}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Updatee</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleBack}>
                <Text style={styles.modalButtonText}>Backk</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              <Image
                style={styles.image}
                source={{ uri: selectedItem.data.Image }}
              />
              <Text style={styles.modalText}>
                {selectedItem.data.City}, {selectedItem.data.Category}
              </Text>
              <Text style={styles.modalText}>{selectedItem.data.Name}</Text>
              <Text style={styles.modalText}>{selectedItem.data.price} Rs</Text>
              <Text style={styles.modalText}>{selectedItem.data.Timing}</Text>
              <Text style={styles.modalText}>
                Posted on {selectedItem.data.timestamp}
              </Text>
              <Text style={styles.modalText}>
                {selectedItem.data.Description}
              </Text>

              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => {
                  // Handle reserve button press
                }}
              >
                <Text style={styles.reserveButtonText}>Reserve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                  // Handle message button press
                }}
              >
                <Text style={styles.messageButtonText}>Message Your Host</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal> */}
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user, logOut } = useContext(PracticeContext);

  const Logout = () => {
    // Perform logout logic here
    logOut();
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={styles.profilescreencontainer}>
      <View style={{ backgroundColor: "#eae9e3", marginBottom: 2 }}>
        <Image
          source={require("../screens/images/usericon.png")}
          style={styles.userImage}
        />
      </View>

      <View style={styles.profileContainer}>
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
const HostScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#38aaa4",
        inactiveTintColor: "gray",
        tabStyle: { fontSize: 16 },
        labelStyle: { fontSize: 14 },
        style: { backgroundColor: "#38aaa4" },
      }}
    >
      <Tab.Screen
        name="Notification Screen"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Alerts",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
          headerTitle: "Notification Screen",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#38aaa4", // Set the background color of the headerTitle
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

      <Tab.Screen
        name="Chat Screen"
        component={ChatScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
          headerTitle: "Chat Screen",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#38aaa4", // Set the background color of the headerTitle
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

      <Tab.Screen
        name="Upload Screen"
        component={UploadScreen}
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
          headerTitle: "Upload Screen",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#38aaa4", // Set the background color of the headerTitle
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

      <Tab.Screen
        name="Your Timeline"
        component={UserpostsScreen}
        options={{
          tabBarLabel: "Timeline",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
          headerTitle: "Your Timeline",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#38aaa4", // Set the background color of the headerTitle
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
      <Tab.Screen
        name="Your Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="person-outline" color={color} size={size} />
          ),
          headerTitle: "Profile Screen",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#38aaa4", // Set the background color of the headerTitle
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profilescreencontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#f5f5f5",
    //backgroundColor: "#38aaa4",
    backgroundColor: "#dedede",
  },
  notificationList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  notificationItemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  profileContainer: {
    backgroundColor: "#dedede",
    borderRadius: 10,
    padding: 20,
    marginBottom: -28,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    width: "100%",
    height: "60%",
  },
  profileText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: -10,
  },
  usernameText: {
    marginLeft: -75,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    width: 120,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  editModalContainer: {
    flex: 1,
    backgroundColor: "#dedede",
    padding: 16,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    //width: "95%",
    margin: 7,
  },
  wellcomecontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //padding: 20,
    backgroundColor: "#f8f8f8",
    marginTop: -150,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#444",
  },
  startText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#3f51b5",
    padding: 5,
    marginTop: -25,
    borderRadius: 8,
  },
  editModalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e74739",
    marginTop: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: "top", // Ensure text is aligned from the top
    //height: 50,
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  // container: {
  //   flex: 1,
  //   //justifyContent: "center",
  //   //alignItems: "center",
  //   backgroundColor: "#38aaa4",
  // },
  // modal: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  // },
  // input: {
  //   padding: 10,
  //   marginHorizontal: 10,
  //   marginBottom: 10,
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   borderColor: "#ccc",
  //   width: "90%",
  // },
  // buttonsContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   width: "80%",
  //   marginTop: 20,
  // },
  optionsIcon: {
    position: "absolute",
    bottom: 10,
    right: 5,
    //backgroundColor: "white",
    //borderRadius: 20,
    //padding: 10,
    //elevation: 2,
  },
  // optionsContainer: {
  //   position: "absolute",
  //   bottom: 60,
  //   right: 20,
  //   backgroundColor: "#fff",
  //   borderRadius: 4,
  //   padding: 10,
  //   elevation: 2,
  // },
  // optionItem: {
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  // },
  container: {
    flex: 1,
    paddingTop: 10,
    //backgroundColor: "#38aaa4",
    //backgroundColor: "#eae9e3",
    backgroundColor: "#dedede",
  },
  chatList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chatItemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dp: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },

  reserveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  reserveButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  messageButton: {
    backgroundColor: "#FF9500",
    borderRadius: 8,
    padding: 10,
  },
  messageButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  // buttonContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginTop: 5,
  //   marginBottom: 5,
  //   marginLeft: 5,
  //   marginRight: 5,
  // },
  // deleteButton: {
  //   backgroundColor: "#3a8abe",
  //   borderRadius: 5,
  //   padding: 8,
  // },
  // editButtonText: {
  //   color: "white",
  //   fontWeight: "bold",
  // },
  // deleteButtonText: {
  //   color: "white",
  //   fontWeight: "bold",
  // },
  // editButton: {
  //   backgroundColor: "#e74739",
  //   borderRadius: 5,
  //   padding: 8,
  // },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
    marginRight: 11,
  },
  editButton: {
    backgroundColor: "#5482bc",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 11,
  },
  deleteButton: {
    backgroundColor: "#e74739",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
  },
  card: {
    width: "100%",
    //width: 340,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  cardMargin: {
    marginBottom: 20, // Increase the value to add more spacing between rows
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  details: {
    flex: 1,
    alignItems: "center",
    //alignItems: "stretch",
    paddingTop: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "400",
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },

  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customimage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderWidth: 7,
    borderColor: "#d5d0c0",
    // padding: 10,
  },
  closeButton: {
    fontSize: 16,
    //color: "#888",
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    backgroundColor: "black",
    //width: 10,
    //height: 10,
    marginTop: 10,
  },
  // editmodalContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // Other modal container styles...
  // },

  // modalButtons: {
  //   flexDirection: "row",
  //   marginTop: 20,
  // },
  // modalButton: {
  //   backgroundColor: "#7e7d79",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginHorizontal: 10,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    //backgroundColor: "red",
    //borderColor: "black",
    //width: 340,
    backgroundColor: "#f8f8f8",
    //backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    margin: 7,
  },
  // wellcometext: {
  //   marginTop: -160,
  //   marginBottom: 6,
  //   borderColor: "black",
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   fontSize: 14,
  //   marginLeft: 5,
  //   marginRight: 5,
  //   backgroundColor: "white",
  //   padding: 5,
  // },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  service: {
    marginTop: -5,
    marginLeft: 35,
    fontSize: 16,
    fontWeight: "bold",
    //backgroundColor: "#38aaa4",
  },
});
export default HostScreen;
