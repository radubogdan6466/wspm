import { setupIonicReact } from "@ionic/react";
import React, { useState } from "react";
import {
  IonApp,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenu,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Route, Redirect, Switch } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import LeftBar from "./components/LeftBar";
import PostBox from "./PostComponent/PostBox";
import PostDetails from "./PostComponent/PostDetails";
import RoomList from "./components/RoomList";
import "@ionic/react/css/core.css";
import Tabs from "./Footer/Footer";
import ChatMainBox from "./components/ChatMainBox";
setupIonicReact();

const App = () => {
  const [user] = useAuthState(auth);
  const [currentView, setCurrentView] = useState("");

  return (
    <IonApp>
      <IonRouterOutlet>
        {" "}
        <IonReactRouter>
          <IonPage>
            {!user ? (
              <Welcome />
            ) : (
              <>
                <IonMenu contentId="main-content">
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Wespam</IonTitle>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className="ion-padding">
                    <LeftBar
                      displayName={user.displayName || ""}
                      setCurrentView={setCurrentView}
                      currentView={currentView}
                    />
                  </IonContent>
                </IonMenu>

                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Menu</IonTitle>
                  </IonToolbar>
                </IonHeader>

                <IonContent id="main-content">
                  <div className="AppBody">
                    <Switch>
                      <Route path="/rooms" exact>
                        <ChatMainBox
                          currentView={currentView}
                          displayName={user.displayName || ""}
                        />
                      </Route>
                      <Route path="/room/:roomId" exact>
                        <ChatBox displayName={user.displayName || ""} />
                      </Route>
                      <Route path="/posts" exact>
                        <PostBox
                          displayName={user.displayName || ""}
                          currentView={currentView}
                        />
                      </Route>
                      <Route path="/post/:postId" exact>
                        <PostDetails displayName={user.displayName || ""} />
                      </Route>
                      {/* <Route path="/" exact>
                      <Redirect to="/posts" />
                    </Route> */}
                    </Switch>
                  </div>
                </IonContent>
              </>
            )}
            <Tabs displayName />
          </IonPage>
        </IonReactRouter>
      </IonRouterOutlet>
    </IonApp>
  );
};

export default App;
