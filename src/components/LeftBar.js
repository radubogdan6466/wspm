import React from "react";
import "../styles/LeftBar.css";

const rooms = ["Room1", "Room2", "Room3", "Room4", "Room5"];

const LeftBar = () => {
  return (
    <div className="LeftBar">
      <div className="title">
        <h3>Rooms</h3>
      </div>
      <div className="rooms">
        {rooms.map((room, index) => (
          <p key={index} className="room">
            {room}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
