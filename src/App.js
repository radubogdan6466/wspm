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
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
