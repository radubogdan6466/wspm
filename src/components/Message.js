import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/ChatBox.css";
import { formatDistanceToNow } from "date-fns"; // Importă funcția necesară din date-fns

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  // Extrage și formatează timpul relativ
  const timeAgo = message.createdAt
    ? formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true })
    : "";

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <span className="message-time">{timeAgo}</span>{" "}
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
