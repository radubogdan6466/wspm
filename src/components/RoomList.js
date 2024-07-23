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
import { IonList, IonItem, IonLabel, IonInput, IonButton } from "@ionic/react";

const RoomList = ({ displayName, currentView }) => {
  //   const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  //   const handleAddRoom = async (event) => {
  //     event.preventDefault();
  //     if (newRoom.trim() === "") {
  //       alert("Enter a valid room name");
  //       return;
  //     }
  //     try {
  //       const q = query(
  //         collection(db, "rooms"),
  //         where("name", "==", newRoom.trim())
  //       );
  //       const querySnapshot = await getDocs(q);

  //       if (!querySnapshot.empty) {
  //         setError("Room with this name already exists");
  //         return;
  //       }

  //       await addDoc(collection(db, "rooms"), {
  //         name: newRoom.trim(),
  //         createdBy: displayName,
  //         createdAt: serverTimestamp(),
  //       });

  //       setNewRoom("");
  //       setError("");
  //     } catch (e) {
  //       console.error("Error adding room: ", e);
  //       setError("Error adding room");
  //     }
  //   };
  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId);
  };

  useEffect(() => {
    if (currentView === "rooms") {
      const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
        const fetchedRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(fetchedRooms);
      });
      return () => unsubscribe();
    }
  }, [currentView]);

  return (
    <IonList>
      {rooms.length === 0 ? (
        <IonItem>
          <IonLabel>No rooms available</IonLabel>
        </IonItem>
      ) : (
        rooms.map((room) => (
          <IonItem
            key={room.id}
            routerLink={`/room/${room.name}`}
            path={`/room/${room.name}`}
            className={room.id === selectedRoom ? "selected" : ""}
            onClick={() => handleRoomClick(room.id)}
          >
            {room.name}
          </IonItem>
        ))
      )}
      {/* <form onSubmit={handleAddRoom} className="add-room-form">
        <IonItem>
          <IonInput
            type="text"
            placeholder="New Room"
            value={newRoom}
            onIonChange={(e) => setNewRoom(e.detail.value)}
            className="new-room-input"
          />
        </IonItem>
        <IonButton type="submit" expand="block" className="add-room-button">
          Add
        </IonButton>
        {error && <IonLabel color="danger">{error}</IonLabel>}
      </form> */}
    </IonList>
  );
};

export default RoomList;
