import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/TypingIndicator.css";

const TypingIndicator = ({ roomId }) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "typingStatus", roomId, "users"),
      where("isTyping", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.displayName !== currentUser.displayName) {
          users.push(data.displayName);
        }
      });
      setTypingUsers(users);
    });

    return () => unsubscribe();
  }, [roomId, currentUser.displayName]);
  return (
    <div className="typing-indicator">
      {typingUsers.length > 0 && (
        <p>
          {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
          typing
          <span className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </p>
      )}
    </div>
  );
};

export default TypingIndicator;
