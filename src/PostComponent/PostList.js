import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "../styles/PostList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const PostList = ({ onSelectPost, displayName }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, likedBy, dislikedBy) => {
    const postRef = doc(db, "posts", postId);
    try {
      const hasLiked = likedBy?.includes(displayName);
      const hasDisliked = dislikedBy?.includes(displayName);

      if (hasLiked) {
        // Retrage like
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(displayName),
        });
      } else {
        // Adaugă like și retrage dislike dacă era setat
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(displayName),
          dislikedBy: hasDisliked ? arrayRemove(displayName) : arrayUnion(), // Evită efectul secundar asupra dislikedBy
          dislikes: hasDisliked ? increment(-1) : increment(0),
        });
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  const handleDislike = async (postId, dislikedBy, likedBy) => {
    const postRef = doc(db, "posts", postId);
    try {
      const hasDisliked = dislikedBy?.includes(displayName);
      const hasLiked = likedBy?.includes(displayName);

      if (hasDisliked) {
        // Retrage dislike
        await updateDoc(postRef, {
          dislikes: increment(-1),
          dislikedBy: arrayRemove(displayName),
        });
      } else {
        // Adaugă dislike și retrage like dacă era setat
        await updateDoc(postRef, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(displayName),
          likedBy: hasLiked ? arrayRemove(displayName) : arrayUnion(), // Evită efectul secundar asupra likedBy
          likes: hasLiked ? increment(-1) : increment(0),
        });
      }
    } catch (error) {
      console.error("Error updating dislike: ", error);
    }
  };

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <span className="post-header-location">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="post-header-location-icon"
              />
              <span>{post.location}</span>
            </span>
            <span className="post-header-date">
              <span className="post-header-SpanDot">•</span>
              {post.createdAt
                ? formatDistanceToNow(post.createdAt.toDate(), {
                    addSuffix: true,
                  })
                : ""}
            </span>
          </div>
          <div className="post-content" onClick={() => onSelectPost(post.id)}>
            <p>{post.content}</p>
          </div>
          <hr className="hrLine" />
          <div className="post-footer">
            <div className="post-actions" onClick={() => onSelectPost(post.id)}>
              <FontAwesomeIcon icon={faComment} className="post-icon" />
              {post.replies || 0}
            </div>
            <div className="post-reactions">
              <p
                className={`post-icon-button ${
                  post.likedBy?.includes(displayName) ? "active" : ""
                }`}
                onClick={() =>
                  handleLike(post.id, post.likedBy || [], post.dislikedBy || [])
                }
                disabled={post.dislikedBy?.includes(displayName)} // Nu permite like dacă utilizatorul a dat dislike
              >
                <FontAwesomeIcon icon={faThumbsUp} className="post-icon" />
                {post.likes || 0}
              </p>
              <p
                className={`post-icon-button ${
                  post.dislikedBy?.includes(displayName) ? "active" : ""
                }`}
                onClick={() =>
                  handleDislike(
                    post.id,
                    post.dislikedBy || [],
                    post.likedBy || []
                  )
                }
                disabled={post.likedBy?.includes(displayName)} // Nu permite dislike dacă utilizatorul a dat like
              >
                <FontAwesomeIcon icon={faThumbsDown} className="post-icon" />
                {post.dislikes || 0}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
