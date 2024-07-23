import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "@ionic/react-router";
import { IonContent, IonButton, IonRouterOutlet, IonPage } from "@ionic/react";
import { Route, Redirect } from "@ionic/react-router";
import PostList from "./PostList";
import AddPost from "./AddPost";
import PostDetails from "./PostDetails";
import "../styles/PostBox.css";

const PostBox = ({ displayName }) => {
  const [isAddingPost, setIsAddingPost] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Verifică dacă URL-ul s-a schimbat și setează starea corespunzătoare
    if (location.pathname === "/posts") {
      setIsAddingPost(false);
    }
  }, [location.pathname]);

  const handleAddPostClick = () => {
    setIsAddingPost(true);
  };

  const handlePostSelect = (postId) => {
    history.push(`/post/${postId}`);
  };

  const handleCloseAddPost = () => {
    setIsAddingPost(false);
  };

  return (
    <IonPage>
      <IonContent className="PostBox">
        {!isAddingPost && (
          <IonButton className="add-post-button" onClick={handleAddPostClick}>
            Add Post
          </IonButton>
        )}
        {isAddingPost && (
          <AddPost displayName={displayName} onClose={handleCloseAddPost} />
        )}
        <IonRouterOutlet>
          <Route
            path="/posts"
            exact
            render={() => (
              <PostList
                onSelectPost={handlePostSelect}
                displayName={displayName}
              />
            )}
          />
          <Route
            path="/post/:postId"
            exact
            render={() => <PostDetails displayName={displayName} />}
          />
          <Redirect from="/" to="/posts" exact />
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

export default PostBox;
