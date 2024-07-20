import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage } from "@fortawesome/free-solid-svg-icons";
import "../styles/SendMessage.css";

const SendMessage = ({ scroll, roomId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [spamError, setSpamError] = useState("");
  const [emptyError, setEmptyError] = useState("");
  const typingTimeoutRef = useRef(null);
  const user = auth.currentUser;

  const messageCountRef = useRef(0);
  const lastResetTimeRef = useRef(Date.now());

  useEffect(() => {
    const typingDocRef = doc(db, "typingStatus", roomId, "users", user.uid);
    if (isTyping) {
      setDoc(
        typingDocRef,
        { isTyping: true, displayName: user.displayName },
        { merge: true }
      );
    } else {
      setDoc(typingDocRef, { isTyping: false }, { merge: true });
    }

    return () => {
      setDoc(typingDocRef, { isTyping: false }, { merge: true });
    };
  }, [isTyping, roomId, user.uid]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setSpamError(""); // Reset spam error on new input
    setEmptyError(""); // Reset empty message error on new input

    if (e.target.value) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000); // 3 secunde de inactivitate
    } else {
      setIsTyping(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastResetTimeRef.current;

    // Reset the message count every 20 seconds
    if (elapsedTime > 20000) {
      messageCountRef.current = 0;
      lastResetTimeRef.current = currentTime;
    }

    if (messageCountRef.current >= 5) {
      setSpamError(
        "You are sending messages too quickly. Please wait 20 seconds"
      );
      return;
    }

    if (message.trim() === "") {
      setEmptyError("Enter a valid message");
      return;
    }

    const { uid, displayName, photoURL } = user;
    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
      roomId,
    });

    messageCountRef.current += 1;
    setMessage("");
    setIsTyping(false);
    setSpamError(""); // Reset spam error after successful send
    setEmptyError(""); // Reset empty message error after successful send
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={sendMessage} className="send-message">
      <label htmlFor="messageInput" className="visually-hidden">
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className={`form-input__input ${
          spamError || emptyError ? "error" : ""
        }`}
        placeholder={spamError || emptyError || "Type message..."}
        value={message}
        onChange={handleInputChange}
      />
      <label htmlFor="fileInput" className="file-input-label">
        <FontAwesomeIcon icon={faImage} />
        <input
          id="fileInput"
          name="fileInput"
          type="file"
          className="file-input"
        />
      </label>
      <button type="submit" className="send-button">
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default SendMessage;
