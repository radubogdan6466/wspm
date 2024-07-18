import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import "../styles/LeftBar.css";
import { Link } from "react-router-dom";

const LeftBar = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const fetchedRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(fetchedRooms);
    });
    return () => unsubscribe();
  }, []);

  const handleAddRoom = async (event) => {
    event.preventDefault();
    if (newRoom.trim() === "") {
      alert("Enter a valid room name");
      return;
    }
    try {
      await addDoc(collection(db, "rooms"), {
        name: newRoom,
      });
      setNewRoom("");
    } catch (e) {
      console.error("Error adding room: ", e);
    }
  };

  return (
    <div className="LeftBar">
      <div className="title">
        <h3>Rooms</h3>
      </div>
      <div className="rooms">
        {rooms.map((room) => (
          <Link key={room.id} to={`/room/${room.id}`} className="room">
            {room.name}
          </Link>
        ))}
      </div>
      <form onSubmit={handleAddRoom} className="add-room-form">
        <input
          type="text"
          placeholder="New Room"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="new-room-input"
        />
        <button type="submit" className="add-room-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default LeftBar;
