import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonNav,
} from "@ionic/react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import PostBox from "../PostComponent/PostBox";

const Header = ({ displayName, setCurrentView, currentView }) => {
  const [posts, setPosts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentView === "rooms") {
        const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
          const fetchedRooms = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRooms(fetchedRooms);
        });
        return () => unsubscribe();
      } else if (currentView === "posts") {
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        });
        return () => unsubscribe();
      }
    };

    fetchData();
  }, [currentView]);

  const handleAddRoom = async (event) => {
    event.preventDefault();
    if (newRoom.trim() === "") {
      alert("Enter a valid room name");
      return;
    }
    try {
      const q = query(
        collection(db, "rooms"),
        where("name", "==", newRoom.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Room with this name already exists");
        return;
      }

      await addDoc(collection(db, "rooms"), {
        name: newRoom.trim(),
        createdBy: displayName,
        createdAt: serverTimestamp(),
      });

      setNewRoom("");
      setError("");
    } catch (e) {
      console.error("Error adding room: ", e);
      setError("Error adding room");
    }
  };

  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId);
  };
  const handlePostsView = () => {
    setCurrentView("posts");
    navigate("/posts"); // Navighează la /posts
  };

  return (
    <>
      <IonNav root={() => <PostBox />}></IonNav>
    </>
  );
};

export default Header;
