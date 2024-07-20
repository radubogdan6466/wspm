import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useParams } from "react-router-dom"; // Adăugăm useParams pentru a extrage roomId
import "../styles/NavBar.css";

const NavBar = () => {
  const [user] = useAuthState(auth);
  const { roomId } = useParams(); // Extragem roomId din URL

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <nav className="NavBar">
      <h1>Wespam</h1>
      {roomId && <p className="current-room">Current room: {roomId}</p>}
      {user ? (
        <button onClick={signOut} className="sign-out" type="button">
          Sign Out
        </button>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google"
            type="button"
          />
        </button>
      )}
    </nav>
  );
};

export default NavBar;
