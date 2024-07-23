import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import "../styles/LeftBar.css";
import RoomList from "./RoomList";

const LeftBar = ({ displayName, setCurrentView, currentView }) => {
  const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentView !== "rooms" && currentView !== "posts") {
      setCurrentView("rooms");
    }
  }, [currentView, setCurrentView]);

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
    navigate("/posts");
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Navigation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          fill={currentView === "rooms" ? "solid" : "outline"}
          onClick={() => setCurrentView("rooms")}
        >
          Rooms
        </IonButton>
        <IonButton
          fill={currentView === "posts" ? "solid" : "outline"}
          onClick={handlePostsView}
        >
          Posts
        </IonButton>

        {currentView === "rooms" && (
          <>
            <RoomList
              currentView={currentView}
              selectedRoom={selectedRoom}
              handleRoomClick={handleRoomClick}
            />
            <form onSubmit={handleAddRoom} className="add-room-form">
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="New Room"
                  value={newRoom}
                  onIonChange={(e) => setNewRoom(e.detail.value)}
                  className="new-room-input"
                />
              </IonItem>
              <IonButton
                type="submit"
                expand="block"
                className="add-room-button"
              >
                Add
              </IonButton>
              {error && <IonLabel color="danger">{error}</IonLabel>}
            </form>
          </>
        )}
      </IonContent>
    </IonContent>
  );
};

export default LeftBar;
