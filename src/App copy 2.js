import { setupIonicReact } from "@ionic/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import LeftBar from "./components/LeftBar";
import PostBox from "./PostComponent/PostBox";
import PostDetails from "./PostComponent/PostDetails";
import "@ionic/react/css/core.css";
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

setupIonicReact();

function App() {
  const [user] = useAuthState(auth);
  const [currentView, setCurrentView] = useState("");

  return (
    <IonApp>
      <Router>
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
                    displayName={user.displayName}
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
                  <LeftBar
                    displayName={user.displayName}
                    setCurrentView={setCurrentView}
                    currentView={currentView}
                  />
                  <Routes>
                    <Route
                      path="/room/:roomId/*"
                      element={
                        currentView === "rooms" ? (
                          <ChatBox />
                        ) : (
                          <PostBox displayName={user.displayName} />
                        )
                      }
                    />
                    <Route
                      path="/posts"
                      element={<PostBox displayName={user.displayName} />}
                    />
                    <Route
                      path="/post/:postId/*"
                      element={<PostDetails displayName={user.displayName} />}
                    />
                    <Route
                      path="/post/postId"
                      element={
                        currentView === "rooms" ? (
                          <div className="WelcomeDiv">
                            <h2 className="WelcomeMessage">
                              Welcome to Wespam. Select a room to start
                              chatting.
                            </h2>
                          </div>
                        ) : (
                          <PostBox displayName={user.displayName} />
                        )
                      }
                    />
                  </Routes>
                </div>
              </IonContent>
            </>
          )}
        </IonPage>
      </Router>
    </IonApp>
  );
}

export default App;
