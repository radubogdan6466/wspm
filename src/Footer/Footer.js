import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import PostBox from "../PostComponent/PostBox";
import RoomList from "../components/RoomList";
import ChatMainBox from "../components/ChatMainBox";
const Tabs = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/posts">
        <PostBox />
      </Route>
      <Route exact path="/rooms">
        <ChatMainBox displayName />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="Posts" href="/posts">
        <IonIcon icon={triangle} />
        <IonLabel>Posts</IonLabel>
      </IonTabButton>
      <IonTabButton tab="rooms" href="/rooms">
        <IonIcon icon={ellipse} />
        <IonLabel>Rooms</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
