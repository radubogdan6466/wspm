import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faThumbsUp,
  faThumbsDown,
  faChevronDown,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import "../styles/CommentSection.css";
import RepliesList from "./RepliesList"; // Importăm componenta RepliesList

const CommentSection = ({ postId, displayName, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // Stare pentru reply-uri

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!displayName || newComment.trim() === "") {
      return;
    }

    try {
      const commentData = {
        content: newComment.trim(),
        createdBy: displayName,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts", postId, "comments"), commentData);

      setNewComment("");

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        replies: increment(1),
      });

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (e) {
      console.error("Error adding comment: ", e);
    }
  };

  const handleAddReply = async (event) => {
    event.preventDefault();
    if (!displayName || newComment.trim() === "" || !replyTo) {
      return;
    }

    try {
      const replyData = {
        content: newComment.trim(),
        createdBy: displayName,
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "posts", postId, "comments", replyTo, "replies"),
        replyData
      );

      setNewComment("");
      setReplyTo(null);

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        replies: increment(1),
      });

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (e) {
      console.error("Error adding reply: ", e);
    }
  };

  return (
    <div className="CommentSection">
      <h4>
        All Comments
        <FontAwesomeIcon icon={faChevronDown} className="comment-icon" />{" "}
      </h4>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="Comment-content-actions">
              <div className="content-Comment">
                <p className="comment">{comment.content}</p>
              </div>
              <div className="Comment-actions-Div">
                <FontAwesomeIcon icon={faThumbsUp} className="comment-icon" />0
                <FontAwesomeIcon icon={faThumbsDown} className="comment-icon" />
                0
                <FontAwesomeIcon
                  icon={faReply}
                  className="comment-icon"
                  onClick={() => setReplyTo(comment.id)} // Setăm ID-ul comentariului pentru reply
                />
              </div>
            </div>
            <div className="Comment-Time-Div">
              <span className="comment-date">
                {comment.createdAt
                  ? formatDistanceToNow(comment.createdAt.toDate(), {
                      addSuffix: true,
                    })
                  : "Unknown date"}
              </span>
              <div className="replies-number-div">
                <span className="replies-number-span">9 replies</span>
              </div>
            </div>
            <RepliesList postId={postId} commentId={comment.id} />
          </div>
        ))}
      </div>
      <form
        onSubmit={replyTo ? handleAddReply : handleAddComment}
        className="comment-form"
      >
        <input
          placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="comment-button">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        {replyTo && (
          <button
            type="button"
            className="cancel-reply-button"
            onClick={() => setReplyTo(null)}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentSection;
