import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";

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
  const history = useHistory();
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
    history.push(`/post/${postId}`);
  };

  const handleCloseAddPost = () => {
    setIsAddingPost(false);
  };

  return (
    <IonReactRouter>
      <IonPage className="PostBox">
        <IonContent className="PostBox">
          {!isAddingPost && (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={handleAddPostClick}>
                <IonIcon icon={addIcon} />
              </IonFabButton>
            </IonFab>
          )}
          <Switch>
            <Route path="/">
              <PostList
                onSelectPost={handlePostSelect}
                displayName={displayName}
              />
            </Route>
            <Route path="/post/:postId">
              <PostDetails displayName={displayName} />
            </Route>
          </Switch>
          {isAddingPost && (
            <AddPost displayName={displayName} onClose={handleCloseAddPost} />
          )}
        </IonContent>
      </IonPage>
    </IonReactRouter>
  );
};

export default PostBox;
