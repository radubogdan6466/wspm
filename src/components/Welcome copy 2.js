import React, { useState } from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

const Welcome = () => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in with Google: ", result.user);
      })
      .catch((error) => {
        console.error("Error during Google sign-in: ", error);
      });
  };

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then((result) => {
        console.log("User signed in anonymously: ", result.user);
        return updateProfile(result.user, {
          displayName: username,
        });
      })
      .then(() => {
        console.log("Username set to: ", username);
      })
      .catch((error) => {
        console.error("Error during anonymous sign-in: ", error);
      });
  };

  return (
    <main className="welcome">
      <h2>Welcome to React Chat.</h2>
      <img src="/logo512.png" alt="ReactJs logo" width={50} height={50} />
      <p>Sign in with Google to chat with your fellow React Developers.</p>
      <button className="sign-in" onClick={googleSignIn}>
        <img src={GoogleSignin} alt="sign in with google" type="button" />
      </button>
      <p>Or continue as an anonymous user.</p>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleUsernameChange}
      />
      <button className="sign-in-anonymous" onClick={anonymousSignIn}>
        Continue as Guest
      </button>
    </main>
  );
};

export default Welcome;
