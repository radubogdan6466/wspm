import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Message.css";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const Message = ({ message, onDelete }) => {
  const [user] = useAuthState(auth);
  const timeAgo = message.createdAt
    ? formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true })
    : "";

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <span className="message-time">{timeAgo}</span>
        <p className="user-message">{message.text}</p>
        {message.uid === user.uid && (
          <button onClick={handleDelete} className="delete-button">
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
