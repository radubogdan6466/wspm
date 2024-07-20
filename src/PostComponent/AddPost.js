// AddPost.js
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../styles/AddPost.css";

const AddPost = ({ displayName, onClose }) => {
  const [newPost, setNewPost] = useState("");

  const handleAddPost = async (event) => {
    event.preventDefault();
    if (newPost.trim() === "") {
      alert("Enter a valid post content");
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        content: newPost.trim(),
        createdBy: displayName,
        createdAt: serverTimestamp(),
        location: "Unknown",
        replies: 0,
        likes: 0,
        dislikes: 0,
      });
      setNewPost("");
      onClose();
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  };

  return (
    <div className="AddPost">
      <h3>Add a New Post</h3>
      <form onSubmit={handleAddPost} className="add-post-form">
        <textarea
          placeholder="Write a post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="new-post-input"
        />
        <button type="submit" className="add-post-button">
          Post
        </button>
        <button type="button" className="cancel-post-button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPost;
