import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import PostList from "./PostList";
import AddPost from "./AddPost";
import PostDetails from "./PostDetails";
import { add as addIcon } from "ionicons/icons";
import "../styles/PostBox.css";
const PostBox = ({ displayName }) => {
  const [isAddingPost, setIsAddingPost] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/posts") {
      setIsAddingPost(false);
    }
  }, [location.pathname]);

  const handleAddPostClick = () => {
    setIsAddingPost(true);
  };

  const handlePostSelect = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleCloseAddPost = () => {
    setIsAddingPost(false);
  };

  return (
    <IonPage className="PostBox">
      <IonContent className="PostBox">
        {!isAddingPost && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleAddPostClick}>
              <IonIcon icon={addIcon} />
            </IonFabButton>
          </IonFab>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <PostList
                onSelectPost={handlePostSelect}
                displayName={displayName}
              />
            }
          />
          <Route
            path="/post/:postId"
            element={<PostDetails displayName={displayName} />}
          />
        </Routes>
        {isAddingPost && (
          <AddPost displayName={displayName} onClose={handleCloseAddPost} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default PostBox;
