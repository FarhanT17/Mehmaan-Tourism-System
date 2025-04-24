import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  createContext,
} from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  // Button,
  Image,
  Modal,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
} from "react-native";
import { Card, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PracticeProvider, PracticeContext } from "../Practicecontext";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  date,
  limit,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../Database/firebase";
import { Calendar } from "react-native-calendars";
import Touristpost from "../Component/touristpost";

const Tab = createBottomTabNavigator();

const handleChatButtonPress = () => {
  Alert.alert(
    "Chat Feature in Progress",
    "Our team is currently working on the chat feature. It will be available soon.",
    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
    { cancelable: false }
  );
};

const MessageModal = ({ onClose, onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    // Perform necessary logic to send the message
    if (selectedItem) {
      const postId = selectedItem.id;

      try {
        // Retrieve the post document
        const postRef = doc(db, "Seller_posts", postId);
        const postSnapshot = await getDoc(postRef);

        if (postSnapshot.exists()) {
          const post = postSnapshot.data();
          const receiver = post.HostId;

          // Encrypt the message
          const encryptedMessage = CryptoJS.AES.encrypt(
            message,
            "mySecretEncryptionKey123987!"
          ).toString();

          // Create a new chat document
          const chatRef = await addDoc(collection(db, "chat"), {
            postId,
            sender,
            receiver,
            message: encryptedMessage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

          console.log("Message sent successfully");
          Alert.alert("Message sent successfully");
          setShowMessageModal(false);
        } else {
          console.log("Post not found");
          Alert.alert("Post not found");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        Alert.alert("Error sending message:", error);
      }
    }

    onSubmit(message);
  };

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          //alignItems: "center",
          //justifyContent: "center",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            marginTop: 40,
          }}
        >
          Send a Message to Your Host
        </Text>
        <TextInput
          style={{
            height: 100,
            width: "100%",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
          }}
          multiline
          placeholder="Type your message here"
          value={message}
          onChangeText={setMessage}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            //justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 8,
              //marginBottom: 10,
            }}
            onPress={handleSendMessage}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Sendd
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "gray",
              padding: 10,
              borderRadius: 8,
              marginLeft: 6,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Cancell
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const BookingModal = ({ selectedItem, onClose, onConfirmBooking }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleCheckInDateSelect = (date) => {
    setCheckInDate(new Date(date));
  };

  const handleCheckOutDateSelect = (date) => {
    setCheckOutDate(new Date(date));
  };

  const handleDayPress = (day) => {
    if (!checkInDate) {
      // If check-in date is not selected, set it as the selected date
      setCheckInDate(day.dateString);
    } else if (!checkOutDate && day.dateString !== checkInDate) {
      // If check-in date is already selected but check-out date is not, and it's not the same as the check-in date, set it as the selected date
      setCheckOutDate(day.dateString);
      setCalendarVisible(false); // Close the calendar after selecting both dates
    } else {
      // If both check-in and check-out dates are already selected or the selected date is the same as the check-in date, reset the selection
      setCheckInDate(day.dateString);
      setCheckOutDate(null);
    }
  };

  const openCheckInDatePicker = () => {
    setCalendarVisible(true);
  };

  const openCheckOutDatePicker = () => {
    // Handle opening the date picker for check-out date
  };

  // const handleConfirmBooking = (totalprice) => {
  //   // Validate the selected dates
  //   if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
  //     // Update the check-out date first
  //     setCheckOutDate(checkOutDate);

  //     // Calculate the total price based on the selected dates and the card's price
  //     const totalPrice = calculateTotalPrice(
  //       checkInDate,
  //       checkOutDate,
  //       selectedItem
  //     );

  //     // Navigate to the payment screen or perform any necessary action
  //     onConfirmBooking(totalPrice);
  //   } else {
  //     // Handle error, the selected dates are invalid
  //     // You can display an error message or perform any necessary action
  //   }

  //   setShowBookingModal(false);
  // };

  const calculateTotalPrice = (checkInDate, checkOutDate, selectedItem) => {
    // console.log("checkInDate:", checkInDate);
    // console.log("checkOutDate:", checkOutDate);
    // console.log("selectedItem:", selectedItem);

    if (!checkInDate || !checkOutDate) {
      return 0;
    }

    // Convert price to a number
    // const price = parseInt(selectedItem.data.price.replace(/,/g, ""));
    //const price = parseInt(selectedItem.data.price);
    const price = selectedItem.data.Price;

    // Calculate the number of days between the check-in and check-out dates
    const oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
    const diffDays = Math.round(
      Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)
    );

    // Calculate the total price based on the number of days and the price of the selected item
    const totalPrice = price * diffDays;

    //console.log("totalPrice:", totalPrice);

    return totalPrice;
  };

  const handleConfirmBooking = () => {
    // Validate the selected dates
    if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
      // Calculate the total price based on the selected dates and the card's price
      const totalPrice = calculateTotalPrice(
        checkInDate,
        checkOutDate,
        selectedItem
      );

      // Show the payment modal
      setShowPaymentModal(true);
    } else {
      // Handle the case when Check-In and Check-Out dates are not selected or invalid
      Alert.alert(
        "Invalid Date Selection",
        "Please select both Check-In and Check-Out dates. Check-Out date should be after the Check-In date.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handlePay = () => {
    // Perform payment logic here

    // Close the payment modal and the booking modal
    setShowPaymentModal(false);
    onClose();
  };

  const handleAccountNumberChange = (text) => {
    setAccountNumber(text);
  };

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {selectedItem && (
          <>
            <Image
              style={[styles.image, { marginTop: -200 }]}
              source={{ uri: selectedItem.data.Image }}
            />
            {/* Display the selected card's details */}
            <Text> Service Provider name: {selectedItem.data.Name}</Text>
            <Text> Price: {selectedItem.data.Price} Rs</Text>
            {/* ...other card details... */}

            {/* Check-In Date */}
            {!checkInDate && (
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={openCheckInDatePicker}
              >
                <Text style={styles.datePickerButtonText}>
                  Select Check-In Date
                </Text>
              </TouchableOpacity>
            )}

            {/* Check-In Date Selected */}
            {checkInDate && !checkOutDate && (
              <>
                <Text>Check-In Date: {checkInDate}</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={openCheckOutDatePicker}
                >
                  <Text style={styles.datePickerButtonText}>
                    Select Check-Out Date
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Check-Out Date Selected */}
            {checkInDate && checkOutDate && (
              <>
                <Text>
                  Selected Dates: {checkInDate} - {checkOutDate}
                </Text>
              </>
            )}

            {calendarVisible && (
              <View>
                {/* Calendar */}
                <Calendar
                  style={{
                    marginBottom: 11,
                  }}
                  onDayPress={handleDayPress}
                  markedDates={{
                    [checkInDate]: {
                      startingDay: true,
                      color: "blue",
                      textColor: "white",
                    },
                    [checkOutDate]: {
                      endingDay: true,
                      color: "blue",
                      textColor: "white",
                    },
                    // Add additional marked dates if needed
                  }}
                />
              </View>
            )}

            {/* Alert for selecting same dates */}
            {checkInDate && checkOutDate && checkInDate === checkOutDate && (
              <Text>
                Invalid Date Selection: You cannot select the same date for
                'Check-In' and 'Check-Out'.
              </Text>
            )}

            {/* Alert for selecting invalid date range */}
            {checkInDate && checkOutDate && checkOutDate < checkInDate && (
              <Text>Invalid Date Range: Please select a valid date range.</Text>
            )}

            {/* Display the calculated total price */}
            <Text style={{ fontWeight: "bold" }}>
              Total Price:{" "}
              {checkInDate && checkOutDate
                ? calculateTotalPrice(
                    checkInDate,
                    checkOutDate,
                    selectedItem
                  ).toLocaleString()
                : 0}{" "}
              Rs
            </Text>

            {/* Buttons for confirming the booking and canceling */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showPaymentModal && (
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.paymentModalContainer}>
            {/* Display total price */}
            <Text style={styles.paymentLabel}>Total Price:</Text>
            <Text style={styles.paymentValue}>
              {calculateTotalPrice(checkInDate, checkOutDate, selectedItem)} Rs
            </Text>
            <Image
              source={require("../screens/images/easypay.png")}
              style={styles.paymentImage}
            />

            {/* Input for EasyPaisa account number */}
            <Text style={styles.paymentLabel}>EasyPaisa Account No:</Text>
            <TextInput
              style={styles.paymentInput}
              value={accountNumber}
              onChangeText={handleAccountNumberChange}
              placeholder="03*********"
            />
            <View
              style={{
                flex: 1,

                borderRadius: 8,
                padding: 8,
                flexDirection: "row",
                marginTop: -205,
                //marginBottom: 5,
                alignItems: "center",
                justifyContent: "space-between",
                //marginLeft: 60,
                //width: 67,
              }}
            >
              {/* Button for making the payment */}
              <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>

              {/* Button for canceling the payment */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const CateringBookingModal = ({ selectedItem, onClose, onConfirmBooking }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [moveToTotalPrice, setMoveToTotalPrice] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const handleConfirmBooking = () => {
    if (!moveToTotalPrice) {
      Alert.alert(
        "Confirmation Required",
        'Please select "Yes" to proceed to payment.'
      );
      return;
    }

    const totalPrice = calculateTotalPrice(selectedItem);
    setShowPaymentModal(true);
  };

  const handlePay = () => {
    // Perform payment logic here

    setShowPaymentModal(false); // Close the payment modal
    onClose(); // Close the booking modal
  };

  const handleAccountNumberChange = (text) => {
    setAccountNumber(text);
  };

  const calculateTotalPrice = (selectedItem) => {
    // const price = parseInt(selectedItem.data.price.replace(/,/g, ""));
    const price = parseInt(selectedItem.data.Price);
    return price;
  };

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {selectedItem && (
          <>
            {/* Display the selected card's details */}
            <Image
              style={[styles.image, { marginTop: -200 }]}
              source={{ uri: selectedItem.data.Image }}
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#333",
              }}
            >
              Dish name: {selectedItem.data.Timing}
            </Text>
            <Text>Service Provider name: {selectedItem.data.Name}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#0066cc",
                marginTop: 10,
              }}
            >
              {selectedItem.data.Price} Rs
            </Text>
            {/* ...other card details... */}

            <Text>Do you want to Order ?</Text>

            {/* Radio buttons for price selection */}
            <View style={{ flexDirection: "row", marginVertical: 20 }}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(true)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  !moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(false)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    !moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display the calculated total price */}
            {moveToTotalPrice && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#0066cc",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Total Price:{" "}
                {calculateTotalPrice(selectedItem).toLocaleString()} Rs
              </Text>
            )}

            {/* Buttons for confirming the booking and canceling */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handleConfirmBooking}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Proceed to Pay{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={onClose}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showPaymentModal && (
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.paymentModalContainer}>
            {/* Display total price */}
            <Text style={styles.paymentLabel}>Total Price:</Text>
            <Text style={styles.paymentValue}>
              {calculateTotalPrice(selectedItem)} Rs
            </Text>
            <Image
              source={require("../screens/images/easypay.png")}
              style={styles.paymentImage}
            />

            {/* Input for EasyPaisa account number */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginTop: 20,
                width: "100%",
              }}
              placeholder="03*********"
              onChangeText={handleAccountNumberChange}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handlePay}
                disabled={!accountNumber}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const TransportBookingModal = ({ selectedItem, onClose, onConfirmBooking }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [moveToTotalPrice, setMoveToTotalPrice] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const handleConfirmBooking = () => {
    if (!moveToTotalPrice) {
      Alert.alert(
        "Confirmation Required",
        'Please select "Yes" to proceed to payment.'
      );
      return;
    }

    const totalPrice = calculateTotalPrice(selectedItem);
    setShowPaymentModal(true);
  };

  const handlePay = () => {
    // Perform payment logic here

    setShowPaymentModal(false); // Close the payment modal
    onClose(); // Close the booking modal
  };

  const handleAccountNumberChange = (text) => {
    setAccountNumber(text);
  };

  const calculateTotalPrice = (selectedItem) => {
    // const price = parseInt(selectedItem.data.price.replace(/,/g, ""));
    const price = parseInt(selectedItem.data.Price);
    return price;
  };

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {selectedItem && (
          <>
            {/* Display the selected card's details */}
            <Image
              style={[styles.image, { marginTop: -200 }]}
              source={{ uri: selectedItem.data.Image }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#333",
              }}
            >
              {selectedItem.data.Description}
            </Text>
            <Text>Service Provider name: {selectedItem.data.Name}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#0066cc",
                marginTop: 10,
              }}
            >
              {selectedItem.data.Price} Rs
            </Text>
            {/* ...other card details... */}

            <Text>Do you want to Book ?</Text>

            {/* Radio buttons for price selection */}
            <View style={{ flexDirection: "row", marginVertical: 20 }}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(true)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  !moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(false)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    !moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display the calculated total price */}
            {moveToTotalPrice && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#0066cc",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Total Price:{" "}
                {calculateTotalPrice(selectedItem).toLocaleString()} Rs
              </Text>
            )}

            {/* Buttons for confirming the booking and canceling */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handleConfirmBooking}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Proceed to Pay{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={onClose}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showPaymentModal && (
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.paymentModalContainer}>
            {/* Display total price */}
            <Text style={styles.paymentLabel}>Total Price:</Text>
            <Text style={styles.paymentValue}>
              {calculateTotalPrice(selectedItem)} Rs
            </Text>
            <Image
              source={require("../screens/images/easypay.png")}
              style={styles.paymentImage}
            />

            {/* Input for EasyPaisa account number */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginTop: 20,
                width: "100%",
              }}
              placeholder="03*********"
              onChangeText={handleAccountNumberChange}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handlePay}
                disabled={!accountNumber}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const SecurityBookingModal = ({ selectedItem, onClose, onConfirmBooking }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [moveToTotalPrice, setMoveToTotalPrice] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");

  const handleConfirmBooking = () => {
    if (!moveToTotalPrice) {
      Alert.alert(
        "Confirmation Required",
        'Please select "Yes" to proceed to payment.'
      );
      return;
    }

    const totalPrice = calculateTotalPrice(selectedItem);
    setShowPaymentModal(true);
  };

  const handlePay = () => {
    // Perform payment logic here

    setShowPaymentModal(false); // Close the payment modal
    onClose(); // Close the booking modal
  };

  const handleAccountNumberChange = (text) => {
    setAccountNumber(text);
  };

  const calculateTotalPrice = (selectedItem) => {
    // const price = parseInt(selectedItem.data.price.replace(/,/g, ""));
    const price = parseInt(selectedItem.data.Price);
    return price;
  };

  return (
    <Modal
      visible={!!selectedItem}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {selectedItem && (
          <>
            {/* Display the selected card's details */}
            <Image
              style={[styles.image, { marginTop: -200 }]}
              source={{ uri: selectedItem.data.Image }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#333",
              }}
            >
              {selectedItem.data.Description}
            </Text>
            <Text>Service Provider name: {selectedItem.data.Name}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#0066cc",
                marginTop: 10,
              }}
            >
              {selectedItem.data.Price} Rs
            </Text>
            {/* ...other card details... */}

            <Text>Do you want to Hire ?</Text>

            {/* Radio buttons for price selection */}
            <View style={{ flexDirection: "row", marginVertical: 20 }}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(true)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  !moveToTotalPrice ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setMoveToTotalPrice(false)}
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    !moveToTotalPrice ? styles.radioButtonTextSelected : null,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display the calculated total price */}
            {moveToTotalPrice && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#0066cc",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Total Price:{" "}
                {calculateTotalPrice(selectedItem).toLocaleString()} Rs
              </Text>
            )}

            {/* Buttons for confirming the booking and canceling */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handleConfirmBooking}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Proceed to Pay{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={onClose}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {showPaymentModal && (
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.paymentModalContainer}>
            {/* Display total price */}
            <Text style={styles.paymentLabel}>Total Price:</Text>
            <Text style={styles.paymentValue}>
              {calculateTotalPrice(selectedItem)} Rs
            </Text>
            <Image
              source={require("../screens/images/easypay.png")}
              style={styles.paymentImage}
            />

            {/* Input for EasyPaisa account number */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginTop: 20,
                width: "100%",
              }}
              placeholder="03*********"
              onChangeText={handleAccountNumberChange}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={handlePay}
                disabled={!accountNumber}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e74739",
                  borderRadius: 4,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 8,
                  flex: 1,
                }}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const LodgingScreen = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleMessagemodal = (message) => {
    // Handle sending the message to the host
    console.log("Sending message:", message);
    setShowMessageModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal without confirming the booking
    setShowBookingModal(false);
  };

  useLayoutEffect(() => {
    const ref = collection(db, "Seller_posts");
    const q = query(
      ref,
      where("Category", "==", "Lodging"),
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

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardContainer}>
          {data.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <Image style={styles.image} source={{ uri: item.data.Image }} />
              <View style={styles.details}>
                <Text style={styles.text}>
                  {item.data.Category},{item.data.City}
                </Text>
                <Text style={styles.text}> {item.data.timestamp}</Text>
                <Text style={styles.text}>{item.data.Price} Rs</Text>
                {/* <Text style={styles.text}>{item.data.Name}</Text>
                <Text style={styles.text}>{item.data.Timing}</Text>
                <Text style={styles.text}>{item.data.Description}</Text>
                <Text style={styles.text}>
                  Available from {item.data.FromDate} to {item.data.ToDate}
                </Text> */}
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="eye-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>View</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              <Card style={{ margin: 10, marginTop: 10, width: "100%" }}>
                {/* Image */}
                <Image
                  style={styles.image}
                  source={{ uri: selectedItem.data.Image }}
                />
                {/* Title */}
                <Card.Title
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  title={`${selectedItem.data.City}, ${selectedItem.data.Category}`}
                />

                <Card.Content>
                  {/* Other Data */}
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#0066cc",
                      marginBottom: 10,
                    }}
                  >
                    {selectedItem.data.Price} Rs
                  </Text>

                  <Text
                    style={{
                      //fontFamily: "Arial",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Posted By: {selectedItem.data.Name}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Timing: {selectedItem.data.Timing}
                  </Text>

                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    {selectedItem.data.Description}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Posted on {selectedItem.data.timestamp}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Available from {selectedItem.data.FromDate} to{" "}
                    {selectedItem.data.ToDate}
                  </Text>
                </Card.Content>

                <Card.Actions style={{ marginRight: 32 }}>
                  <Button
                    mode="contained"
                    onPress={() => setShowBookingModal(true)}
                    style={{ marginRight: 2 }}
                  >
                    Reserve
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleChatButtonPress}
                    //onPress={handleMessagemodal}
                    style={{ backgroundColor: "#009900" }}
                    //onPress={handleSendMessage}
                  >
                    Message Your Host
                  </Button>
                </Card.Actions>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  Close
                </Button>
              </Card>
            </>
          )}
        </View>
      </Modal>
      {showBookingModal && (
        <BookingModal
          selectedItem={selectedItem}
          onClose={() => setShowBookingModal(false)}
          //onConfirmBooking={handleConfirmBooking}
        />
      )}
    </View>
  );
};

const CateringScreen = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleCloseModal = () => {
    // Close the modal without confirming the booking
    setShowBookingModal(false);
  };

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useLayoutEffect(() => {
    const ref = collection(db, "Seller_posts");
    const q = query(
      ref,
      where("Category", "==", "Catering"),
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
    <View style={{ marginTop: 10 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardContainer}>
          {data.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <Image style={styles.image} source={{ uri: item.data.Image }} />
              <View style={styles.details}>
                <Text style={styles.text}>
                  {item.data.Category},{item.data.City}
                </Text>
                <Text style={styles.text}>{item.data.timestamp}</Text>
                <Text style={styles.text}>{item.data.Price} Rs</Text>
                {/* <Text style={styles.text}>{item.data.Name}</Text>
                <Text style={styles.text}>{item.data.Timing}</Text>
                <Text style={styles.text}>{item.data.Description}</Text>
                <Text style={styles.text}>
                  Available from {item.data.FromDate} to {item.data.ToDate}
                </Text> */}
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="eye-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>View</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              <Card style={{ margin: 10, marginTop: 10, width: "100%" }}>
                {/* Image */}
                <Image
                  style={styles.image}
                  source={{ uri: selectedItem.data.Image }}
                />
                {/* Title */}
                <Card.Title
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  title={`${selectedItem.data.City}, ${selectedItem.data.Category}`}
                />

                <Card.Content>
                  {/* Other Data */}
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#0066cc",
                      marginBottom: 10,
                    }}
                  >
                    {selectedItem.data.Price} Rs
                  </Text>

                  <Text
                    style={{
                      //fontFamily: "Arial",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Posted By: {selectedItem.data.Name}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Dish name: {selectedItem.data.Timing}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Description: {selectedItem.data.Description}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Posted on {selectedItem.data.timestamp}
                  </Text>
                </Card.Content>

                <Card.Actions style={{ marginRight: 32 }}>
                  <Button
                    mode="contained"
                    onPress={() => setShowBookingModal(true)}
                    style={{ marginRight: 2 }}
                  >
                    Order
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleChatButtonPress}
                    //onPress={handleMessagemodal}
                    style={{ backgroundColor: "#009900" }}
                    //onPress={handleSendMessage}
                  >
                    Message Your Host
                  </Button>
                </Card.Actions>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  Close
                </Button>
              </Card>
            </>
          )}
        </View>
      </Modal>
      {showBookingModal && (
        <CateringBookingModal
          selectedItem={selectedItem}
          onClose={() => setShowBookingModal(false)}
          //onConfirmBooking={handleConfirmBooking}
        />
      )}
    </View>
  );
};

// const HomeScreen = () => {
//   const [data, setData] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedCity, setSelectedCity] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isCityModalVisible, setIsCityModalVisible] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isFilteredDataVisible, setIsFilteredDataVisible] = useState(false);

//     const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setIsCityModalVisible(false);
//   };

//   const handleBackButton = () => {
//     setSelectedCity("");
//     setIsCityModalVisible(false);
//   };

//   const cityOptions = [
//     "Naran",
//     "Lahore",
//     "Swat",
//     "Kumrat",
//     "Mansehra",
//     "Murree",
//     "Hunza",
//   ];

//   const handleCardPress = (item) => {
//     //setSelectedItem(item);
//     //setModalVisible(true);
//     const selectedItem = filteredData.find(
//       (dataItem) => dataItem.id === item.id
//     );
//     setSelectedItem(selectedItem || item);
//     setModalVisible(true);
//   };

//   useLayoutEffect(() => {
//     const ref = collection(db, "Seller_posts");
//     const q = query(
//       ref,
//       //where("Category", "==", "Lodging"),
//       orderBy("timestamp", "desc")
//     );
//     onSnapshot(q, (props) =>
//       setData(
//         props.docs.map((category) => ({
//           id: category.id,
//           data: category.data(),
//         }))
//       )
//     );
//   });

//   const handleSearchButton = () => {
//     let newFilteredData = data;

//     if (selectedCity && searchQuery) {
//       newFilteredData = data.filter((item) => {
//         return (
//           item.data.City === selectedCity &&
//           item.data.Category.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       });
//     } else if (selectedCity) {
//       newFilteredData = data.filter((item) => {
//         return item.data.City === selectedCity;
//       });
//     } else if (searchQuery) {
//       newFilteredData = data.filter((item) => {
//         return item.data.Category.toLowerCase().includes(
//           searchQuery.toLowerCase()
//         );
//       });
//     }

//     setFilteredData(newFilteredData);
//     setSelectedItem(null);
//     setModalVisible(false);
//     setIsFilteredDataVisible(searchQuery !== "" || selectedCity !== "");
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollViewContent}
//       >
//         <View style={styles.searchBarContainer}>
//           <TouchableOpacity
//             style={styles.citySelectContainer}
//             onPress={() => setIsCityModalVisible(true)}
//           >
//             <Text style={styles.citySelectText}>
//               {selectedCity || "Select City"}
//             </Text>
//           </TouchableOpacity>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search Service..."
//             onChangeText={(text) => setSearchQuery(text)}
//             value={searchQuery}
//           />

//           <TouchableOpacity
//             style={styles.searchIconContainer}
//             onPress={handleSearchButton}
//           >
//             <Ionicons
//               name="search"
//               size={24}
//               color="#000"
//               style={{ padding: 7 }}
//             />
//           </TouchableOpacity>
//         </View>

//         {isFilteredDataVisible && (
//           <TouchableOpacity
//             style={{
//               position: "absolute",
//               top: 61,
//               left: 20,
//               zIndex: 2,
//               marginRight: 5,
//             }}
//             onPress={() => {
//               setIsFilteredDataVisible(false);
//               setSearchQuery(""); // Clear search query
//               setSelectedCity(""); // Clear selected city
//             }}
//           >
//             <Ionicons name="arrow-back" size={25} color="#000" />
//           </TouchableOpacity>
//         )}

//         {searchQuery !== "" && selectedCity !== "" && (
//           <Text
//             style={{
//               fontSize: 18,
//               fontWeight: "bold",
//               textAlign: "center",
//               marginVertical: 10,
//             }}
//           >
//             Results for "{searchQuery}" in {selectedCity}
//           </Text>
//         )}

//         <View style={styles.cardContainer}>
//           {isFilteredDataVisible
//             ? filteredData.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.card}
//                   onPress={() => handleCardPress(item)}
//                 >
//                   <Image
//                     style={styles.image}
//                     source={{ uri: item.data.Image }}
//                   />
//                   <View style={styles.details}>
//                     <Text style={styles.text}>
//                       {item.data.Category}, {item.data.City}
//                     </Text>
//                     <Text style={styles.text}> {item.data.timestamp}</Text>
//                     <Text style={styles.text}>{item.data.Price} Rs</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.buttonContainer}
//                     onPress={() => handleCardPress(item)}
//                   >
//                     <View style={styles.buttonContent}>
//                       <Ionicons name="eye-outline" size={20} color="white" />
//                       <Text style={styles.buttonText}>View</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               ))
//             : data.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.card}
//                   onPress={() => handleCardPress(item)}
//                 >
//                   <Image
//                     style={styles.image}
//                     source={{ uri: item.data.Image }}
//                   />
//                   <View style={styles.details}>
//                     <Text style={styles.text}>
//                       {item.data.Category}, {item.data.City}
//                     </Text>
//                     <Text style={styles.text}> {item.data.timestamp}</Text>
//                     <Text style={styles.text}>{item.data.Price} Rs</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.buttonContainer}
//                     onPress={() => handleCardPress(item)}
//                   >
//                     <View style={styles.buttonContent}>
//                       <Ionicons name="eye-outline" size={20} color="white" />
//                       <Text style={styles.buttonText}>View</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               ))}
//         </View>
//       </ScrollView>

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           {selectedItem && (
//             <>
//               <Image
//                 style={styles.image}
//                 source={{ uri: selectedItem.data.Image }}
//               />
//               <Text style={styles.modalText}>
//                 {selectedItem.data.City}, {selectedItem.data.Category}
//               </Text>
//               <Text style={styles.modalText}>{selectedItem.data.Name}</Text>
//               <Text style={styles.modalText}>{selectedItem.data.Price} Rs</Text>
//               <Text style={styles.modalText}>{selectedItem.data.Timing}</Text>
//               <Text style={styles.modalText}>
//                 Posted on {selectedItem.data.timestamp}
//               </Text>
//               <Text style={styles.modalText}>
//                 {selectedItem.data.Description}
//               </Text>
//               <Text style={styles.text}>
//                 Available from {selectedItem.data.FromDate} to{" "}
//                 {selectedItem.data.ToDate}
//               </Text>

//               <TouchableOpacity
//                 style={styles.reserveButton}
//                 onPress={() => {
//                   // Handle reserve button press
//                 }}
//               >
//                 <Text style={styles.reserveButtonText}>Reserve</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.messageButton}
//                 onPress={() => {
//                   // Handle message button press
//                 }}
//               >
//                 <Text style={styles.messageButtonText}>Message Your Host</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={styles.closeButton}>Close</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </Modal>

//       <Modal visible={isCityModalVisible}>
//         <View style={styles.citymodalContainer}>
//           <TouchableOpacity onPress={handleBackButton}>
//             <Ionicons
//               name="arrow-back"
//               size={28}
//               color="black"
//               style={styles.backButton}
//             />
//           </TouchableOpacity>
//           <FlatList
//             style={{ width: "100%" }}
//             data={cityOptions}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.option}
//                 onPress={() => handleCitySelect(item)}
//               >
//                 <Text style={styles.optionText}>{item}</Text>
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item) => item}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const searchPlaceholderByCity = "Search By City";
  const searchPlaceholderByPrice = "Search By Price";
  const searchPlaceholderByCategory = "Search By Category";
  const [alertVisible, setAlertVisible] = useState(false);
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Set the number of items to fetch per page
  useEffect(() => {
    // Function to fetch data from the server based on the current page and page size
    const fetchData = async () => {
      try {
        const ref = collection(db, "Seller_posts");
        const q = query(
          ref,
          orderBy("timestamp", "desc"),
          limit(pageSize * currentPage)
        );
        const dataSnapshots = await getDocs(q);
        const newData = dataSnapshots.docs.map((category) => ({
          id: category.id,
          data: category.data(),
        }));
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handleLoadMore = () => {
    // Increase the currentPage by 1 to fetch the next page of data
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const clearFilters = () => {
    setIsFilterApplied(false);
    setSelectedCity("");
    setSelectedPrice("");
    setSelectedCategory("");
    setSearchQuery("");
    setSearchButtonPressed(false);
  };

  const handleCardPress = (item) => {
    // Call handleCardPress with the item parameter
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSearchButton = () => {
    if (!searchQuery.trim()) {
      // Check if searchQuery is empty or contains only spaces
      Alert.alert("Please enter a search query");
      return;
    }

    if (
      !selectedFilter ||
      (selectedFilter !== "City" &&
        selectedFilter !== "Price" &&
        selectedFilter !== "Category")
    ) {
      // Check if none of the checkboxes is checked
      Alert.alert("Please select a filter");
      return;
    }

    setSearchButtonPressed(true);
    setIsFilterApplied(true);

    // Filter the data based on the selected filter and search query
    let filteredData = data.filter((item) => {
      if (selectedFilter === "City") {
        return item.data.City.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (selectedFilter === "Price") {
        // Convert Price to integer using parseInt()
        const price = parseInt(item.data.Price);
        return (
          !isNaN(price) && price.toString().includes(searchQuery.toLowerCase())
        );
      } else if (selectedFilter === "Category") {
        return item.data.Category.toLowerCase().includes(
          searchQuery.toLowerCase()
        );
      } else {
        return (
          item.data.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.data.Price &&
            parseInt(item.data.Price)
              .toString()
              .includes(searchQuery.toLowerCase())) ||
          item.data.Category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    });

    // If a city filter is selected, filter the data further based on the selected city
    if (selectedFilter === "City" && selectedCity !== "") {
      filteredData = filteredData.filter(
        (item) => item.data.City.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // If a price filter is selected, filter the data further based on the selected price
    if (selectedFilter === "Price" && selectedPrice !== "") {
      filteredData = filteredData.filter(
        (item) =>
          item.data.Price &&
          parseInt(item.data.Price).toString() === selectedPrice.toLowerCase()
      );
    }

    // If a category filter is selected, filter the data further based on the selected category
    if (selectedFilter === "Category" && selectedCategory !== "") {
      filteredData = filteredData.filter(
        (item) =>
          item.data.Category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Update the filteredData state with the filtered data
    setFilteredData(filteredData);
    console.log(filteredData);

    // Reset the currentPage state to 1 to show the first page of the filtered data
    setCurrentPage(1);
  };

  const handleCheckboxChange = (checkbox) => {
    // If the same filter is clicked again, reset the selection
    if (selectedFilter === checkbox) {
      setSelectedFilter("");
      setSelectedCity("");
      setSelectedPrice("");
      setSelectedCategory("");
      setSearchQuery("");
    } else {
      setSelectedFilter(checkbox);
      setSelectedCity(checkbox === "City" ? "" : selectedCity);
      setSelectedPrice(checkbox === "Price" ? "" : selectedPrice);
      setSelectedCategory(checkbox === "Category" ? "" : selectedCategory);

      // Call the handleSearchButton function to trigger filtering
      handleSearchButton();
    }
  };

  // useLayoutEffect(() => {
  //   const ref = collection(db, "Seller_posts");
  //   const q = query(
  //     ref,
  //     //where("Category", "==", "Lodging"),
  //     orderBy("timestamp", "desc")
  //   );
  //   onSnapshot(q, (props) =>
  //     setData(
  //       props.docs.map((category) => ({
  //         id: category.id,
  //         data: category.data(),
  //       }))
  //     )
  //   );
  //   // console.log("Data:", data);
  // });

  // useLayoutEffect(() => {
  //   // Function to fetch data from the server based on the current page and page size
  //   const fetchData = async () => {
  //     try {
  //       const ref = collection(db, "Seller_posts");
  //       const q = query(
  //         ref,
  //         orderBy("timestamp", "desc"),
  //         limit(pageSize * currentPage) // Set the limit based on current page and page size
  //       );
  //       const dataSnapshots = await getDocs(q);
  //       const newData = dataSnapshots.docs.map((category) => ({
  //         id: category.id,
  //         data: category.data(),
  //       }));

  //       // Update the data with the new fetched data
  //       setData(newData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [currentPage, pageSize]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={
              selectedFilter === "City"
                ? searchPlaceholderByCity
                : selectedFilter === "Price"
                ? searchPlaceholderByPrice
                : selectedFilter === "Category"
                ? searchPlaceholderByCategory
                : "Search Service..."
            }
            placeholderTextColor="#999"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
          <TouchableOpacity
            style={styles.searchIconContainer}
            onPress={handleSearchButton}
            // onPressIn={() => {
            //   console.log("Farhan Tariq");
            // }}
          >
            <Ionicons
              name="search"
              size={24}
              color="#000"
              style={{ padding: 7 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          {isFilterApplied && (
            <TouchableOpacity
              onPress={clearFilters}
              style={{ marginLeft: -4, marginTop: -1, marginRight: 10 }}
            >
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
          )}
          <Text style={styles.filterText}>Filter By:</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={
                selectedFilter === "City"
                  ? styles.activeCheckbox
                  : styles.checkbox
              }
              onPress={() => handleCheckboxChange("City")}
            >
              <View
                style={
                  selectedFilter === "City"
                    ? styles.activeInnerCheckbox
                    : styles.innerCheckbox
                }
              />
              <Text style={styles.checkboxText}>City</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                selectedFilter === "Price"
                  ? styles.activeCheckbox
                  : styles.checkbox
              }
              onPress={() => handleCheckboxChange("Price")}
            >
              <View
                style={
                  selectedFilter === "Price"
                    ? styles.activeInnerCheckbox
                    : styles.innerCheckbox
                }
              />
              <Text style={styles.checkboxText}>Price</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                selectedFilter === "Category"
                  ? styles.activeCheckbox
                  : styles.checkbox
              }
              onPress={() => handleCheckboxChange("Category")}
            >
              <View
                style={
                  selectedFilter === "Category"
                    ? styles.activeInnerCheckbox
                    : styles.innerCheckbox
                }
              />
              <Text style={styles.checkboxText}>Category</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.citySelectContainer}>
          <TouchableOpacity
            style={styles.citySelectButton}
            onPress={() => setIsCityModalVisible(true)}
          >
            <Text style={styles.citySelectText}>
              {selectedCity || "Select City"}
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* <View style={styles.cardContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              //onPress={() => handleCardPress(item)}
            >
              <Image style={styles.image} source={{ uri: item.data.Image }} />
              <View style={styles.details}>
                <Text style={styles.text}>
                  {item.data.Category}, {item.data.City}
                </Text>
                <Text style={styles.text}> {item.data.timestamp}</Text>
                <Text style={styles.text}>{item.data.Price} Rs</Text>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCardPress(item)}
                //onPress={handleViewButtonPress} // Add a separate onPress for the "View" button
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="eye-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>View</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View> */}

        <View style={styles.cardContainer}>
          {searchButtonPressed
            ? filteredData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => handleCardPress(item)}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: item.data.Image }}
                  />
                  <View style={styles.details}>
                    <Text style={styles.text}>
                      {item.data.Category}, {item.data.City}
                    </Text>
                    <Text style={styles.text}> {item.data.timestamp}</Text>
                    <Text style={styles.text}>{item.data.Price} Rs</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleCardPress(item)}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons name="eye-outline" size={20} color="white" />
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            : // Render the original data when searchButton is not pressed
              data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => handleCardPress(item)}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: item.data.Image }}
                  />
                  <View style={styles.details}>
                    <Text style={styles.text}>
                      {item.data.Category}, {item.data.City}
                    </Text>
                    <Text style={styles.text}> {item.data.timestamp}</Text>
                    <Text style={styles.text}>{item.data.Price} Rs</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleCardPress(item)}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons name="eye-outline" size={20} color="white" />
                      <Text style={styles.buttonText}>View</Text>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          {/* Render this card if there is no search or filter */}
          {!isFilterApplied &&
            searchButtonPressed &&
            filteredData.length === 0 && (
              <View style={styles.card}>
                <Image
                  style={styles.image}
                  source={{ uri: "YOUR_DEFAULT_IMAGE_URL" }}
                />
                <View style={styles.details}>
                  <Text style={styles.text}>
                    Default Category, Default City
                  </Text>
                  <Text style={styles.text}>Default Timestamp</Text>
                  <Text style={styles.text}>Default Price Rs</Text>
                </View>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => handleCardPress(null)}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="eye-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>View</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </ScrollView>

      <Modal
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
              <Text style={styles.modalText}>{selectedItem.data.Price} Rs</Text>
              <Text style={styles.modalText}>{selectedItem.data.Timing}</Text>
              <Text style={styles.modalText}>
                Posted on {selectedItem.data.timestamp}
              </Text>
              <Text style={styles.modalText}>
                {selectedItem.data.Description}
              </Text>
              <Text style={styles.text}>
                Available from {selectedItem.data.FromDate} to{" "}
                {selectedItem.data.ToDate}
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
      </Modal>

      {/* <Modal visible={isCityModalVisible}>
        <View style={styles.citymodalContainer}>
          <TouchableOpacity onPress={handleBackButton}>
            <Ionicons
              name="arrow-back"
              size={28}
              color="black"
              style={styles.backButton}
            />
          </TouchableOpacity>
          <FlatList
            style={{ width: "100%" }}
            data={cityOptions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleCitySelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </Modal> */}
    </View>
  );
};

const TransportScreen = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleCloseModal = () => {
    // Close the modal without confirming the booking
    setShowBookingModal(false);
  };

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useLayoutEffect(() => {
    const ref = collection(db, "Seller_posts");
    const q = query(
      ref,
      where("Category", "==", "Transport"),
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              //onPress={() => handleCardPress(item)}
            >
              <Image style={styles.image} source={{ uri: item.data.Image }} />
              <View style={styles.details}>
                <Text style={styles.text}>
                  {item.data.Category}, {item.data.City}
                </Text>
                <Text style={styles.text}>{item.data.timestamp}</Text>
                <Text style={styles.text}>{item.data.Price} Rs</Text>
                {/* <Text style={styles.text}>{item.data.Timing}</Text>
                <Text style={styles.text}>{item.data.Name}</Text>
                <Text style={styles.text}>{item.data.Description}</Text>
                <Text style={styles.text}>
                  Available from {item.data.FromDate} to {item.data.ToDate}
                </Text> */}
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCardPress(item)}
              >
                <View
                  style={styles.buttonContent}
                  onPress={() => handleCardPress(item)}
                >
                  <Ionicons name="eye-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>View</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              <Card style={{ margin: 10, marginTop: 5, width: "100%" }}>
                {/* Image */}
                <Image
                  style={styles.image}
                  source={{ uri: selectedItem.data.Image }}
                />
                {/* Title */}
                <Card.Title
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  title={`${selectedItem.data.City}, ${selectedItem.data.Category}`}
                />

                <Card.Content>
                  {/* Other Data */}
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#0066cc",
                      marginBottom: 10,
                    }}
                  >
                    {selectedItem.data.Price} Rs
                  </Text>

                  <Text
                    style={{
                      //fontFamily: "Arial",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Posted By: {selectedItem.data.Name}
                  </Text>
                  {/* <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Timing: {selectedItem.data.Timing}
                  </Text> */}

                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Description: {selectedItem.data.Description}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Posted on {selectedItem.data.timestamp}
                  </Text>
                  {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Available from {selectedItem.data.FromDate} to{" "}
                    {selectedItem.data.ToDate}
                  </Text> */}
                </Card.Content>

                <Card.Actions style={{ marginRight: 32 }}>
                  <Button
                    mode="contained"
                    onPress={() => setShowBookingModal(true)}
                    style={{ marginRight: 2 }}
                  >
                    Book
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleChatButtonPress}
                    //onPress={handleMessagemodal}
                    style={{ backgroundColor: "#009900" }}
                    //onPress={handleSendMessage}
                  >
                    Message Your Rider
                  </Button>
                </Card.Actions>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  Close
                </Button>
              </Card>
            </>
          )}
        </View>
      </Modal>
      {showBookingModal && (
        <TransportBookingModal
          selectedItem={selectedItem}
          onClose={() => setShowBookingModal(false)}
          //onConfirmBooking={handleConfirmBooking}
        />
      )}
    </View>
  );
};

const SecurityScreen = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useLayoutEffect(() => {
    const ref = collection(db, "Seller_posts");
    const q = query(
      ref,
      where("Category", "==", "Security"),
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              //onPress={() => handleCardPress(item)}
            >
              <Image style={styles.image} source={{ uri: item.data.Image }} />
              <View style={styles.details}>
                <Text style={styles.text}>
                  {item.data.Category}, {item.data.City}
                </Text>
                <Text style={styles.text}>Posted on {item.data.timestamp}</Text>
                <Text style={styles.text}>{item.data.Price} Rs</Text>
                {/* <Text style={styles.text}>{item.data.Timing}</Text>
                <Text style={styles.text}>{item.data.Name}</Text>
                <Text style={styles.text}>{item.data.Description}</Text>
                <Text style={styles.text}>
                  Available from {item.data.FromDate} to {item.data.ToDate}
                </Text> */}
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="eye-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>View</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              <Card style={{ margin: 10, marginTop: 10, width: "100%" }}>
                {/* Image */}
                <Image
                  style={styles.image}
                  source={{ uri: selectedItem.data.Image }}
                />
                {/* Title */}
                <Card.Title
                  titleStyle={{ fontWeight: "bold", fontSize: 20 }}
                  title={`${selectedItem.data.City}, ${selectedItem.data.Category}`}
                />

                <Card.Content>
                  {/* Other Data */}
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#0066cc",
                      marginBottom: 10,
                    }}
                  >
                    {selectedItem.data.Price} Rs
                  </Text>

                  <Text
                    style={{
                      //fontFamily: "Arial",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Posted By: {selectedItem.data.Name}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Availability: {selectedItem.data.Timing}
                  </Text>

                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Description: {selectedItem.data.Description}
                  </Text>
                  <Text style={{ fontSize: 18, marginBottom: 5 }}>
                    Posted on {selectedItem.data.timestamp}
                  </Text>
                </Card.Content>

                <Card.Actions style={{ marginRight: 32 }}>
                  <Button
                    mode="contained"
                    onPress={() => setShowBookingModal(true)}
                    style={{ marginRight: 2 }}
                  >
                    Hire
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleChatButtonPress}
                    //onPress={handleMessagemodal}
                    style={{ backgroundColor: "#009900" }}
                    //onPress={handleSendMessage}
                  >
                    Message Your Guard
                  </Button>
                </Card.Actions>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  Close
                </Button>
              </Card>
            </>
          )}
        </View>
      </Modal>
      {showBookingModal && (
        <SecurityBookingModal
          selectedItem={selectedItem}
          onClose={() => setShowBookingModal(false)}
          //onConfirmBooking={handleConfirmBooking}
        />
      )}
    </View>
  );
};

const TouristScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#38aaa4",
        inactiveTintColor: "gray",
        tabStyle: { fontSize: 16 },
        labelStyle: { fontSize: 14 },
        // style: { marginHorizontal: 20, marginBottom: 10 },
      }}
    >
      <Tab.Screen
        name="Lodging"
        component={LodgingScreen}
        options={{
          tabBarLabel: "Lodging",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="bed-outline" color={color} size={size} />
          ),
          headerTitle: "Lodging Screen",
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
        name="Catering"
        component={CateringScreen}
        options={{
          tabBarLabel: "Catering",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="restaurant-outline" color={color} size={size} />
          ),
          headerTitle: "Catering Screen",
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerTitle: "HomeScreen",
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
        name="Transport"
        component={TransportScreen}
        options={{
          tabBarLabel: "Transport",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <Ionicons name="car-outline" color={color} size={size} />
          ),
          headerTitle: "Transport Screen",
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
        name="Security"
        component={SecurityScreen}
        options={{
          tabBarLabel: "Security",
          tabBarIcon: ({ color, size }) => (
            //<Image source={require("../screens/images/user.png")} />
            <MaterialIcons name="security" size={size} color={color} />
          ),
          headerTitle: "Security Screen",
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
  /* container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  }, */
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  radioButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 10,
  },
  // confirmBookingButton: {
  //   backgroundColor: "#38aaa4",
  //   padding: 10,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginRight: 10,
  // },
  // confirmBookingButtonText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },
  // cancelButton: {
  //   backgroundColor: "red",
  //   padding: 8,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginLeft: 3,
  // },
  // cancelButtonText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },
  radioButton: {
    width: "15%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginLeft: 7,
  },
  radioButtonSelected: {
    backgroundColor: "#000",
  },
  radioButtonText: {
    color: "#000",
  },
  radioButtonTextSelected: {
    color: "#fff",
  },
  service: {
    marginTop: 10,
    marginLeft: 35,
    fontSize: 16,
    fontWeight: "bold",
  },

  // paymentModalContainer: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  //   paddingHorizontal: 20,
  // },
  // paymentLabel: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  //   marginTop: 27,
  // },
  // payButton: {
  //   backgroundColor: "#4CAF50",
  //height: 60,
  //width: 70,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   // marginBottom: 10,
  // },
  // payButtonText: {
  //   color: "#fff",
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
  // confirmbooking: {
  //   backgroundColor: "white",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginLeft: 5,
  // },
  // confirmbookingText: {
  //   //backgroundColor: "black",
  //   Color: "white",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginLeft: 5,
  // },
  // cancelButton: {
  //   backgroundColor: "black",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginLeft: 5,
  // },
  // cancelButtonText: {
  //   //backgroundColor: "white",
  //   color: "white",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginLeft: 5,
  // },
  // buttonsContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginTop: 10,
  // },
  // paymentValue: {
  //   fontSize: 24,
  //   marginBottom: 20,
  // },
  // paymentinput: {
  //   height: 40,
  //   width: "100%",
  //   borderColor: "#ccc",
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   //marginBottom: 20,
  //   paddingHorizontal: 10,
  // },

  // container: {
  //   flex: 1,
  //   paddingTop: 10,
  //   //backgroundColor: "#38aaa4",
  //   backgroundColor: "#dedede",
  // },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
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
    // Increase the value to add more spacing between rows
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 5,
    // Remove marginLeft to center the search bar horizontally
    marginLeft: 2,
    width: "99%",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginLeft: 22,
    marginBottom: 2,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  innerCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 5,
  },
  activeInnerCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#000",
    marginRight: 5,
  },
  activeCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    color: "#000",
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 22, // Add marginLeft back to create some space between the search bar and filters
    marginBottom: 5,
  },
  filteredText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 6,
  },
  backButton: {
    marginLeft: 16,
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 18,
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  selectedDateText: {
    fontSize: 18,
    marginBottom: 10,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 11,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  totalPriceText: {
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    //marginBottom: 10,
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  // modalContainer: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   padding: 20,
  // },
  // text: {
  //   fontSize: 16,
  //   marginBottom: 10,
  // },
  // datePickerButton: {
  //   backgroundColor: "blue",
  //   padding: 10,
  //   borderRadius: 5,
  //   marginBottom: 10,
  //   marginTop: 10,
  // },
  // datePickerButtonText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },
  // confirmButton: {
  //   backgroundColor: "green",
  //   padding: 10,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginRight: 5,
  // },
  // confirmButtonText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },
  // cancelButton: {
  //   backgroundColor: "red",
  //   padding: 10,
  //   borderRadius: 5,
  //   flex: 1,
  //   marginLeft: 5,
  // },
  // cancelButtonText: {
  //   color: "white",
  //   textAlign: "center",
  //   fontSize: 16,
  // },

  // Styles for the payment modal
  paymentModalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  paymentLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentImage: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  payButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  citySelectContainer: {
    flex: 1,
    marginRight: 10,
  },
  citySelectText: {
    fontSize: 16,
  },
  categorySelectContainer: {
    flex: 1,
  },
  categorySelectText: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    //borderLeftWidth: 4,
    //borderLeftColor: "grey",
    //paddingLeft: 2,
    backgroundColor: "#eae9e3",
    //marginLeft: -175,
    //paddingLeft: 15,
  },
  searchIconContainer: {
    // marginLeft: 10,
    backgroundColor: "#ff9921",
    height: 40,
    width: 39,
    marginRight: -10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  citymodalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
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
    paddingTop: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    //backgroundColor: "red",
    //borderColor: "black",
    //width: 340,
    backgroundColor: "#eae9e3",
    //backgroundColor: "#fff",
    //borderRadius: 25,
    //borderWidth: 2,
    borderColor: "black",
    //marginTop: 7,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
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
  buttonContainer: {
    backgroundColor: "#409969",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 317,
    width: 67,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
});
export default TouristScreen;
