import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import LeftBar from "./components/LeftBar";

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <div className="App">
        {!user ? (
          <>
            <Welcome />
          </>
        ) : (
          <div className="AppContainer">
            <NavBar />
            <div className="AppBody">
              <LeftBar />
              <Routes>
                <Route path="/room/:roomId" element={<ChatBox />} />
                <Route
                  path="/"
                  element={
                    <h2>
                      Welcome to the chat app! Select a room to start chatting.
                    </h2>
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
