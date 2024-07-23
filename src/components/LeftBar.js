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
  const navigate = useNavigate();

  useEffect(() => {
    if (currentView !== "rooms" && currentView !== "posts") {
      setCurrentView("rooms");
    }
  }, [currentView, setCurrentView]);

  const handlePostsView = () => {
    setCurrentView("posts");
    navigate("/posts");
  };
  const handleRoomsView = () => {
    setCurrentView("rooms");
    navigate("/rooms");
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
          onClick={handleRoomsView}
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
            <RoomList currentView={currentView} displayName={displayName} />
          </>
        )}
      </IonContent>
    </IonContent>
  );
};

export default LeftBar;
