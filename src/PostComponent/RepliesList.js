import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "../styles/RepliesList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
const RepliesList = ({ postId, commentId }) => {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const repliesQuery = query(
      collection(db, "posts", postId, "comments", commentId, "replies"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
      const fetchedReplies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplies(fetchedReplies);
    });

    return () => unsubscribe();
  }, [postId, commentId]);

  return (
    <div className="replies-list">
      {replies.map((reply) => (
        <div key={reply.id} className="reply-item">
          <div className="reply-content">
            <div className="reply-content-only">
              <div className="content-Comment">
                <p className="reply">{reply.content}</p>
              </div>
              <div className="reply-content-icons">
                <FontAwesomeIcon icon={faThumbsUp} className="comment-icon" />
                <FontAwesomeIcon icon={faThumbsDown} className="comment-icon" />
              </div>
            </div>
          </div>
          <span className="reply-date">
            {reply.createdAt
              ? formatDistanceToNow(reply.createdAt.toDate(), {
                  addSuffix: true,
                })
              : "Unknown date"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RepliesList;
