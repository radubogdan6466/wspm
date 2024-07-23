import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonImg,
  IonLabel,
  IonItem,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import "../styles/Welcome.css"; // Import your custom CSS

const Welcome = () => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google: ", result.user);
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
    }
  };

  const anonymousSignIn = async () => {
    try {
      const result = await signInAnonymously(auth);
      await updateProfile(result.user, {
        displayName: username,
      });
      console.log("User signed in anonymously and username set to: ", username);
    } catch (error) {
      console.error("Error during anonymous sign-in: ", error);
    }
  };

  return (
    <IonPage>
      <IonContent className="welcome-content">
        <IonCard className="welcome-card">
          <IonCardContent>
            <IonImg src="/logo512.png" alt="ReactJs logo" className="logo" />
            <IonText className="welcome-description">
              Sign in with Google to chat with your fellow React Developers.
            </IonText>
            <IonButton
              expand="full"
              className="google-signin-button"
              onClick={googleSignIn}
            >
              <IonImg
                src={GoogleSignin}
                alt="Sign in with Google"
                className="google-signin-img"
              />
            </IonButton>
            <IonText className="or-continue-text">
              Or continue as an anonymous user.
            </IonText>
            <IonItem className="username-input-item">
              <IonLabel position="floating">Enter your username</IonLabel>
              <IonInput
                type="text"
                value={username}
                onIonInput={handleUsernameChange}
                placeholder="Enter your username"
              />
            </IonItem>
            <IonButton
              expand="full"
              className="guest-button"
              onClick={anonymousSignIn}
            >
              Continue as Guest
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
