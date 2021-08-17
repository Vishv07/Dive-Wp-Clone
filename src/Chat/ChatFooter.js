import React, { useState } from "react";
import { useStateValue } from "../StateProvider";

//importing styles
import "emoji-mart/css/emoji-mart.css";
import "./ChatFooter.css";

function ChatFooter({ roomName, roomId, db, firebase, storage, rec_id }) {
  const [{ user }] = useStateValue();
  const [input, setInput] = useState("");
  const [emoji, setEmoji] = useState(false);


  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault()

      if (roomId && input.trim() != "") {
        db.collection("chat")
        .doc(roomId)
        .collection("messages")
        .add({
          msg: input,
          receiver_id: rec_id,
          read:false,
          sender_id: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function (docRef) {
          // console.log("Document written with ID: ", docRef.id);
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .doc(docRef.id)
            .set(
              {
                id: docRef.id,
              },
              { merge: true }
            );
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
       
        }
        setInput("");
        setEmoji(false);
      }

    };


  return (
    <div className="chat__footer">
      <form>
        <textarea
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          type="text"
          rows="1"
          onKeyDown={onEnterPress}
        />
      </form>
    </div>
  );
}

export default ChatFooter;
