import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import {
  IonModal,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  IonPage,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

const AddRoom = ({ displayName, onClose }) => {
  const [newRoom, setNewRoom] = useState("");
  const [error, setError] = useState("");

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
  return (
    <IonModal isOpen={true} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add a New Room</IonTitle>
          <IonButton slot="end" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleAddRoom} className="add-post-form">
          <IonItem>
            <IonInput
              type="text"
              placeholder="New Room"
              value={newRoom}
              onIonChange={(e) => setNewRoom(e.detail.value)}
              className="new-post-input"
            />
          </IonItem>
          <IonButton type="submit" expand="block" className="add-post-button">
            Add
          </IonButton>{" "}
          <IonButton
            type="button"
            expand="full"
            className="cancel-post-button"
            onClick={onClose}
          >
            Cancel
          </IonButton>
          {error && <IonLabel color="danger">{error}</IonLabel>}
        </form>
      </IonContent>
    </IonModal>
  );
};

export default AddRoom;
