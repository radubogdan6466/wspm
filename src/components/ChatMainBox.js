import React, { useState, useEffect } from "react";
import {
  Route,
  Redirect,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import RoomList from "./RoomList";
import AddRoom from "./AddRoom";
import ChatBox from "./ChatBox";
import { add as addIcon } from "ionicons/icons";
import "../styles/PostBox.css";
const ChatMainBox = ({ displayName }) => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/rooms") {
      setIsAddingRoom(false);
    }
  }, [location.pathname]);

  const handleAddRoomClick = () => {
    setIsAddingRoom(true);
  };

  const handleRoomSelect = (roomId) => {
    history.push(`/room/${roomId}`);
  };

  const handleCloseAddRoom = () => {
    setIsAddingRoom(false);
  };

  return (
    <IonPage className="PostBox">
      <IonContent className="PostBox">
        {!isAddingRoom && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleAddRoomClick}>
              <IonIcon icon={addIcon} />
            </IonFabButton>
          </IonFab>
        )}
        <Switch>
          <Route
            path="/"
            element={
              <RoomList
                onSelectRoom={handleRoomSelect}
                displayName={displayName}
              />
            }
          />
          <Route
            path="/room/:roomId"
            element={<ChatBox displayName={displayName} />}
          />
        </Switch>
        {isAddingRoom && (
          <AddRoom displayName={displayName} onClose={handleCloseAddRoom} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChatMainBox;
