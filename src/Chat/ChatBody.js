import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
// importing component
import { storage, firebase } from "../firebase";
import db from "../firebase";
//importing material-ui-icon
import NoEncryptionIcon from "@material-ui/icons/NoEncryption";
import AlarmIcon from "@material-ui/icons/Alarm";
import DoneIcon from "@material-ui/icons/Done";
//importing styles
import "./ChatBody.css";

function ChatBody({
  messages,
  user,
  roomId,
  rec_id
}) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (roomId) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };
  useEffect(() => {

   async function MsgRead(){ 
         await db.collection("chat").doc(roomId).collection("messages").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({
                    read: true
                });
            });
        });
   }
   if(messages.length>0){

   if(user.uid == messages[0].receiver_id){
     MsgRead();
   }
  }
  },[messages]);

  return (
    <div>
      <p className="chat__message_reminder">
        <NoEncryptionIcon /> This is a whatsapp clone. Messages are not
        encrpyted.
      </p>
      <p className="chat__message_reminder chat__createdBy">
        {"You created this group"}
      </p>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat__message 
                    ${message.sender_id === user.uid && "chat__sender"} 
                    ${message.photo && "chat__message_media_image"}
                    ${message.video && "chat__message_media_video"}
                    ${
                      message.video &&
                      !message.caption &&
                      "chat__message_media_video_noCaption"
                    } `}
        >
          <span
            className={`chat__name ${
              message.uid === user.uid && "chat__name_sender"
            }`}
          >
            {message.name}
          </span>

          <div className="chat__message_box">
            <div
              className={`chat__message_box_text ${
                message.uid === user.uid && "chat__message_box_text_sender"
              }
              ${
                message.photo &&
                !message.caption &&
                "chat__message_box_text_no_caption"
              } `}
            >
              {message.msg ? message.msg : null}
              {message.caption ? message.caption : null}
              {message.url ? (
                <a
                  target="_blank"
                  href={`${message.url}`}
                  rel="noopener noreferrer"
                >
                  {message}
                </a>
              ) : null}

              <div
                className={`chat__timestamp_container ${
                  message.sender_id === user.uid && "chat__timestamp_container_sender"
                }`}
              >
                {message.timestamp ? (
                  <div
                    className={`chat__timestamp 
                                    ${
                                      message.photo &&
                                      !message.caption &&
                                      "chat__timestamp_media_photo"
                                    }  
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      "chat__timestamp_media_video"
                                    }
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      "chat__timestamp_media_displayNone"
                                    }`}
                  >
                    <span>
                      {new Date(message.timestamp.toDate()).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          hour12: true,
                          minute: "numeric",
                        }
                      )}
                      {message.sender_id === user.uid ? 
                      <DoneIcon style = {{color: message.read ? "blue":"black"}} /> : null}
                      {message.sender_id === user.uid ? 
                      <DoneIcon style ={{marginLeft:"-8px",color: message.read ? "blue":"black"}} /> : null}
                    </span>
                  </div>
                ) : (
                  <div className="chat__timestamp">
                    <span>
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric",
                      })}
                      {message.sender_id === user.uid ? <AlarmIcon /> : null}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* it will automatically scroll drown everytime the user enters new chat message */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatBody;
