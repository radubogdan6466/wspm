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

function App() {
  const [user] = useAuthState(auth);
  const [currentView, setCurrentView] = useState("");

  return (
    <Router>
      <div className="App">
        {!user ? (
          <Welcome />
        ) : (
          <div className="AppContainer">
            <NavBar />
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
                />{" "}
                <Route
                  path="/posts"
                  element={<PostBox displayName={user.displayName} />}
                />
                <Route
                  path="/post/:postId/*"
                  element={<PostDetails displayName={user.displayName} />}
                />
                <Route
                  path="*"
                  element={
                    currentView === "rooms" ? (
                      <div className="WelcomeDiv">
                        <h2 className="WelcomeMessage">
                          Welcome to Wespam. Select a room to start chatting.
                        </h2>
                      </div>
                    ) : (
                      <PostBox displayName={user.displayName} />
                    )
                  }
                />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
