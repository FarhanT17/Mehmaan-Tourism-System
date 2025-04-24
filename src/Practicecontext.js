import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { db, auth } from "../src/Database/firebase";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

const PracticeContext = React.createContext();

const PracticeProvider = (props) => {
  const [user, setuser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [securepassword, setsecurepassword] = useState(true);
  const [lodgingModalVisible, setLodgingModalVisible] = useState(false);
  const [cateringModalVisible, setCateringModalVisible] = useState(false);
  const [transportModalVisible, setTransportModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");
  const [image, setImage] = useState(null);
  const [imageurl, setImageUrl] = useState("");
  //const [image, setImage] = useState({ uri: "" });
  const [data, setData] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setuser(user);
      setLoader(false);
    });
  }, [user]);
  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setuser(null);
        setLoader(true);
        alert("You have successfully logged out.");
      })
      .catch((error) => {
        // An error happened.
        console.log("Logout error:", error);
      });
  };
  useLayoutEffect(
    (callFunction = () => {
      const ref = collection(db, "picture");
      onSnapshot(ref, (picture) =>
        setData(
          picture.docs.map((category) => ({
            id: category.id,
            data: category.data(),
          }))
        )
      );
    })
  );
  return (
    <PracticeContext.Provider
      value={{
        user,
        logOut,
        callFunction,
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
        imageurl,
        setImageUrl,
        data,
        setData,
      }}
    >
      {props.children}
    </PracticeContext.Provider>
  );
};

export { PracticeContext, PracticeProvider };
