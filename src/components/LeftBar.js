import React, { useState, useEffect } from "react";
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
import "../styles/LeftBar.css";
import { Link, useNavigate } from "react-router-dom";

const LeftBar = ({ displayName, setCurrentView, currentView }) => {
  const [posts, setPosts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
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
    <div className="LeftBar">
      <div className="tabs">
        <button
          className={`tab ${currentView === "rooms" ? "active" : ""}`}
          onClick={() => setCurrentView("rooms")}
        >
          Rooms
        </button>
        <button
          className={`tab ${currentView === "posts" ? "active" : ""}`}
          onClick={handlePostsView}
        >
          Posts
        </button>
      </div>

      {currentView === "rooms" && (
        <>
          <div className="title">
            <h3>Rooms</h3>
          </div>
          <div className="rooms">
            {rooms.length === 0 ? (
              <p>No rooms available</p>
            ) : (
              rooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/room/${room.name}`}
                  className={`room ${
                    room.id === selectedRoom ? "selected" : ""
                  }`}
                  onClick={() => handleRoomClick(room.id)}
                >
                  {room.name}
                </Link>
              ))
            )}
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
            <span>{error}</span>
          </form>
        </>
      )}

      {/* {currentView === "posts" && (
        <>
          <div className="title">
            <h3>Posts</h3>
            <button
              className="create-post-button"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              {showCreatePost ? "Cancel" : "Create Post"}
            </button>
          </div>
          {showCreatePost && (
            <form onSubmit={handlePostSubmit} className="add-post-form">
              <input
                type="text"
                name="title"
                placeholder="Post Title"
                className="post-title-input"
              />
              <textarea
                name="content"
                placeholder="Post Content"
                className="post-content-input"
              />
              <button type="submit" className="add-post-button">
                Submit
              </button>
            </form>
          )}
          <div className="posts">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </>
      )} */}
    </div>
  );
};

export default LeftBar;
