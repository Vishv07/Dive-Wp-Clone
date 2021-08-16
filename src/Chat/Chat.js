import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import { useHistory, useLocation, useParams } from "react-router-dom";
//importing firebase
import { storage, firebase } from "../firebase";
import db from "../firebase";
//importing components
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import {filter_chat, generateId} from "../utils"
import ChatLandingScreen from "./ChatLandingScreen";
//importing material-ui
import CircularProgress from "@material-ui/core/CircularProgress";
//importing styles
import "react-toastify/dist/ReactToastify.css";
import "./Chat.css";

function Chat({ isRoomExist }) {
  const history = useHistory();
  const location = useLocation()
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const { rec_id } = useParams();
  const [_roomId, set_RoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCreatedBy, setRoomCreatedBy] = useState("");
  const [roomOwner, setRoomOwner] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLandingScreenPhoto, setShowLandingScreenPhoto] = useState(false);

  useEffect(  () => {
    // alert(rec_id);
    if (roomId) {
    const chatID =  db.collection('chat').doc(roomId).set({},{ merge: true });
      db.collection("chat")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot(function (doc) {
        setMessages(doc.docs.map((doc) => doc.data()));
        setLoading(true);
      });

     
      setShowLandingScreenPhoto(false);
    } else {
      setShowLandingScreenPhoto(true);
      history.push("/");
    }
  }, []);
  

  return (
    <div className="chat">
      { roomId ? (
        <>
          <div>
            <ChatHeader
              roomCreatedBy={roomCreatedBy}
              roomOwner={roomOwner}
              roomName={"Start Chating"}
              roomId={roomId}
              _roomId={_roomId}
              messages={messages}
              db={db}
              history={history}
            />
          </div>

          <div className="chat__body">
            {loading ? (
              <ChatBody
                roomId={roomId}
                messages={messages}
                user={user}
                rec_id= {rec_id}
              />
            ) : (
              <div className="chat__body_loading">
                <div>
                  <CircularProgress />
                </div>
              </div>
            )}
          </div>

          <div>
            <ChatFooter
              roomName={roomName}
              roomId={roomId}
              rec_id = {rec_id}
              db={db}
              firebase={firebase}
              storage={storage}
            />
          </div>
        </>
      ) : (
        <ChatLandingScreen showLandingScreenPhoto={showLandingScreenPhoto} />
      )}
    </div>
  );
}

export default Chat;
