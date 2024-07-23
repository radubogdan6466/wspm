import React, { useEffect } from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";

const Welcome = () => {
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await Browser.open({
      url: `https://your-auth-domain.firebaseapp.com/__/auth/handler`,
    });
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    const checkRedirect = async () => {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        console.log("User signed in: ", user);
        await Browser.close();
      }
    };

    App.addListener("appUrlOpen", (event) => {
      // This event fires when the app is opened via a custom URL scheme.
      checkRedirect();
    });

    checkRedirect();
  }, []);

  return (
    <main className="welcome">
      <h2>Welcome to React Chat.</h2>
      <img src="/logo512.png" alt="ReactJs logo" width={50} height={50} />
      <p>Sign in with Google to chat with your fellow React Developers.</p>
      <button className="sign-in" onClick={googleSignIn}>
        <img src={GoogleSignin} alt="sign in with google" type="button" />
      </button>
    </main>
  );
};

export default Welcome;
