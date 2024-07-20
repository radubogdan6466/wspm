import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import TypingIndicator from "./TypingIndicator";
import "../styles/ChatBox.css";

const ChatBox = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleDeleteMessage = async (messageId) => {
    const messageRef = doc(db, "messages", messageId);
    try {
      await deleteDoc(messageRef);
      console.log("Message deleted successfully.");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <main className="chat-box">
      <div>
        <input className="SearchInChat" placeholder="Search" />
      </div>
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            onDelete={handleDeleteMessage}
          />
        ))}
        <TypingIndicator roomId={roomId} />
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} roomId={roomId} />
    </main>
  );
};

export default ChatBox;
