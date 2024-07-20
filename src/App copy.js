import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import LeftBar from "./components/LeftBar";
import Post from "./PostComponent/Post"; // Asigură-te că acest import este corect
import Posts from "./PostComponent/Posts";
function App() {
  const [user] = useAuthState(auth);
  const [currentView, setCurrentView] = useState("rooms"); // Default view

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
                setCurrentView={setCurrentView} // Transmite setCurrentView
                currentView={currentView} // Transmite currentView
              />
              <div className="content">
                <Routes>
                  <Route
                    path="/room/:roomId"
                    element={
                      currentView === "rooms" ? (
                        <ChatBox />
                      ) : (
                        <Posts displayName={user.displayName} />
                      )
                    }
                  />
                  <Route
                    path="/"
                    element={
                      currentView === "rooms" ? (
                        <div className="WelcomeDiv">
                          <h2 className="WelcomeMessage">
                            Welcome to Wespam. Select a room to start chatting.
                          </h2>
                        </div>
                      ) : (
                        <Post displayName={user.displayName} />
                      )
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
