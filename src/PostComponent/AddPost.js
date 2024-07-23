import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
      onClose(); // Close the AddPost button
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  };

  return (
    <IonModal isOpen={true} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add a New Post</IonTitle>
          <IonButton slot="end" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleAddPost} className="add-post-form">
          <IonItem>
            <IonLabel position="floating">Your Post</IonLabel>
            <IonInput
              placeholder="Write a post..."
              value={newPost}
              onIonInput={(e) => setNewPost(e.detail.value)}
              className="new-post-input"
            />
          </IonItem>
          <IonButton type="submit" expand="full" className="add-post-button">
            Post
          </IonButton>
          <IonButton
            type="button"
            expand="full"
            className="cancel-post-button"
            onClick={onClose}
          >
            Cancel
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default AddPost;
