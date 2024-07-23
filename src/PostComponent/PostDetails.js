import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faShare,
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import CommentSection from "./CommentSection";
import "../styles/PostDetails.css";

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

  return (
    <IonPage>
      <IonContent className="Post-Container">
        <IonCard className="PostInner">
          <IonCardHeader className="Post-Head">
            <IonItem lines="none" className="post-head-location">
              <FontAwesomeIcon icon={faLocationDot} className="post-icon" />
              <IonLabel className="PostLocationSpan">{post.location}</IonLabel>
              <IonLabel className="post-head-date">
                <span>•</span>
                {post.createdAt
                  ? formatDistanceToNow(post.createdAt.toDate(), {
                      addSuffix: true,
                    })
                  : ""}
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <IonCardContent className="PostContent">
            <IonText>{post.content}</IonText>
          </IonCardContent>

          <hr className="HLine" />

          <IonCardContent className="postFooter">
            <IonItem lines="none" className="Post-Tools">
              <FontAwesomeIcon icon={faComment} className="post-icon-replies" />
              {post.replies}
            </IonItem>
            <IonItem lines="none" className="Post-Activity">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className="post-icon-actions"
              />
              {post.likes}
              <FontAwesomeIcon
                icon={faThumbsDown}
                className="post-icon-actions"
              />
              {post.dislikes}
            </IonItem>
          </IonCardContent>
          <hr className="HLine" />
        </IonCard>
        <CommentSection postId={postId} displayName={displayName} />
      </IonContent>
    </IonPage>
  );
};

export default PostDetails;
