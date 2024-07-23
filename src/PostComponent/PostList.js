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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faThumbsUp,
  faThumbsDown,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonItem,
  IonContent,
  IonLabel,
  IonButton,
  IonText,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import "../styles/PostList.css";

const PostList = ({ onSelectPost, displayName }) => {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasMore, setHasMore] = useState("");

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
      setDisplayedPosts(fetchedPosts.slice(0, 10));
      setHasMore(fetchedPosts.length > 10);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId, likedBy, dislikedBy) => {
    const postRef = doc(db, "posts", postId);
    try {
      const hasLiked = likedBy?.includes(displayName);
      const hasDisliked = dislikedBy?.includes(displayName);

      if (hasLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(displayName),
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(displayName),
          dislikedBy: hasDisliked ? arrayRemove(displayName) : arrayUnion(),
          dislikes: hasDisliked ? increment(-1) : increment(0),
        });
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes + (hasLiked ? -1 : 1),
                likedBy: hasLiked
                  ? post.likedBy.filter((user) => user !== displayName)
                  : [...post.likedBy, displayName],
                dislikes: hasDisliked ? post.dislikes - 1 : post.dislikes,
                dislikedBy: hasDisliked
                  ? post.dislikedBy.filter((user) => user !== displayName)
                  : post.dislikedBy,
              }
            : post
        )
      );

      setDisplayedPosts((prevDisplayedPosts) =>
        prevDisplayedPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes + (hasLiked ? -1 : 1),
                likedBy: hasLiked
                  ? post.likedBy.filter((user) => user !== displayName)
                  : [...post.likedBy, displayName],
                dislikes: hasDisliked ? post.dislikes - 1 : post.dislikes,
                dislikedBy: hasDisliked
                  ? post.dislikedBy.filter((user) => user !== displayName)
                  : post.dislikedBy,
              }
            : post
        )
      );
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
        await updateDoc(postRef, {
          dislikes: increment(-1),
          dislikedBy: arrayRemove(displayName),
        });
      } else {
        await updateDoc(postRef, {
          dislikes: increment(1),
          dislikedBy: arrayUnion(displayName),
          likedBy: hasLiked ? arrayRemove(displayName) : arrayUnion(),
          likes: hasLiked ? increment(-1) : increment(0),
        });
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                dislikes: post.dislikes + (hasDisliked ? -1 : 1),
                dislikedBy: hasDisliked
                  ? post.dislikedBy.filter((user) => user !== displayName)
                  : [...post.dislikedBy, displayName],
                likes: hasLiked ? post.likes - 1 : post.likes,
                likedBy: hasLiked
                  ? post.likedBy.filter((user) => user !== displayName)
                  : post.likedBy,
              }
            : post
        )
      );

      setDisplayedPosts((prevDisplayedPosts) =>
        prevDisplayedPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                dislikes: post.dislikes + (hasDisliked ? -1 : 1),
                dislikedBy: hasDisliked
                  ? post.dislikedBy.filter((user) => user !== displayName)
                  : [...post.dislikedBy, displayName],
                likes: hasLiked ? post.likes - 1 : post.likes,
                likedBy: hasLiked
                  ? post.likedBy.filter((user) => user !== displayName)
                  : post.likedBy,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error updating dislike: ", error);
    }
  };

  const loadMorePosts = (event) => {
    setTimeout(() => {
      const newPostsCount = displayedPosts.length + 10;
      setDisplayedPosts(posts.slice(0, newPostsCount));
      setHasMore(newPostsCount < posts.length);
      event.target.complete();
    }, 500);
  };

  return (
    <IonContent>
      <IonList className="posts-list">
        {displayedPosts.map((post) => (
          <IonCard key={post.id} className="post-item">
            <IonCardHeader className="PostList-Ion-Card-Header">
              <IonItem lines="none" className="Post-List-post-header">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="post-header-location-icon"
                />
                <span className="Post-List-Ion-Label">6 km away</span>
                <IonLabel className="post-header-date">
                  <span className="post-header-SpanDot">•</span>
                  {post.createdAt
                    ? formatDistanceToNow(post.createdAt.toDate(), {
                        addSuffix: true,
                      })
                    : ""}
                </IonLabel>
              </IonItem>
            </IonCardHeader>
            <IonCardContent
              className="Post-List-post-content"
              onClick={() => onSelectPost(post.id)}
            >
              <IonText className="Post-List-Content">{post.content}</IonText>
            </IonCardContent>
            <hr className="hrLine" />

            <IonCardContent className="post-footer">
              <IonItem
                className="post-actions"
                onClick={() => onSelectPost(post.id)}
                lines="none"
              >
                <FontAwesomeIcon icon={faComment} className="post-icon" />
                {post.replies || 0}
              </IonItem>
              <IonItem className="post-reactions" lines="none">
                <IonButton
                  fill="clear"
                  className={`post-icon-button ${
                    post.likedBy?.includes(displayName) ? "active" : ""
                  }`}
                  onClick={() =>
                    handleLike(
                      post.id,
                      post.likedBy || [],
                      post.dislikedBy || []
                    )
                  }
                  disabled={post.dislikedBy?.includes(displayName)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="post-icon" />
                  {post.likes || 0}
                </IonButton>
                <IonButton
                  fill="clear"
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
                  disabled={post.likedBy?.includes(displayName)}
                >
                  <FontAwesomeIcon icon={faThumbsDown} className="post-icon" />
                  {post.dislikes || 0}
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>
      <IonInfiniteScroll
        onIonInfinite={loadMorePosts}
        threshold="100px"
        disabled={!hasMore}
      >
        <IonInfiniteScrollContent loadingText="Loading more posts..."></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  );
};

export default PostList;
