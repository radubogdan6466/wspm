import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import "../styles/PostList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faShare,
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const PostList = ({ onSelectPost }) => {
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
              <span className="">{post.location}</span>
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
              <FontAwesomeIcon icon={faThumbsUp} className="post-icon" />
              {post.likes || 0}
              <FontAwesomeIcon icon={faThumbsDown} className="post-icon" />
              {post.dislikes || 0}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
