import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "../styles/PostDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faShare,
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";
import CommentSection from "./CommentSection";

const PostDetails = ({ displayName }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        }
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }
  //   console.log("Display Name in PostDetails:", displayName);

  return (
    <div className="Post-Container">
      <div className="PostInner">
        <div className="Post-Head">
          <span className="post-head-location">
            <FontAwesomeIcon icon={faLocationDot} className="post-icon" />
            <p className="PostLocationSpan"> {post.location}</p>
          </span>
          <span className="post-head-date">
            <span>•</span>
            {post.createdAt
              ? formatDistanceToNow(post.createdAt.toDate(), {
                  addSuffix: true,
                })
              : ""}
          </span>
        </div>
        <div className="PostContent">
          <p>{post.content}</p>
        </div>
        <hr className="HLine" />
        <div className="postFooter">
          <div className="Post-Tools">
            <FontAwesomeIcon icon={faComment} className="post-icon-replies" />
            {post.replies}
          </div>
          <div className="Post-Activity">
            <FontAwesomeIcon icon={faThumbsUp} className="post-icon-actions" />
            {post.likes}
            <FontAwesomeIcon
              icon={faThumbsDown}
              className="post-icon-actions"
            />
            {post.dislikes}
          </div>
        </div>
        <hr className="HLine" />
      </div>
      <CommentSection postId={postId} displayName={displayName} />{" "}
    </div>
  );
};

export default PostDetails;
