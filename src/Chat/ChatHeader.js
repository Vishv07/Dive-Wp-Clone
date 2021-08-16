import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing components
import DropdownMenu from "../shared/DropdownMenu";
import DrawerRightSearch from "./DrawerRightSearch";
import DrawerRightInfo from "./DrawerRightInfo";
import TooltipCustom from "../shared/TooltipCustom";
import { toastInfo } from "../shared/toastInfo";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
//importing material-ui-icons
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//importing styles
import "./ChatHeader.css";

function ChatHeader({
  roomCreatedBy,
  roomOwner,
  roomName,
  roomId,
  _roomId,
  messages,
  db,
  history,
}) {
  const [{ user }] = useStateValue();
  const [role, setRole] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [isLastMessage, setIsLastMessage] = useState(false);

  useEffect(() => {
    const errorAbout = "errorAbout";
    if (user.uid) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setRole(doc.data().role);
          }
        })
        .catch(function (error) {
          toastInfo(`${error}`, errorAbout, "top-center");
        });
    }

    if (messages[messages.length - 1]?.timestamp) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }

    if (messages[messages.length - 1]) {
      setIsLastMessage(true);
    } else {
      setIsLastMessage(false);
    }
  }, [user.uid, user.displayName, user.isAnonymous, db, messages, roomId]);

  console.log("ROOOM ID", roomId);
  console.log("__ROOOM ID", _roomId);

  const getDateFromMessage = () => {
    return new Date(
      messages[messages.length - 1]?.timestamp?.toDate()
    ).toLocaleTimeString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  const getDateLocal = () => {
    return new Date().toLocaleTimeString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  const deleteRoom = () => {
    const roomDeleted = "roomDeleted";

    if (roomOwner === user.uid || role === "admin") {
      db.collection("rooms")
        .doc(roomId)
        .delete()
        .then(function () {
          toastInfo("Room successfully deleted!", roomDeleted, "top-center");
        })
        .catch(function (error) {
          toastInfo(`Error removing room! ${error}`, roomDeleted, "top-center");
        });
      history.push("/");
    } else {
      toastInfo(
        `You are not allowed to delete room ${roomName}. Only the admin or room owner ${roomCreatedBy}`,
        roomDeleted,
        "top-center"
      );
    }
  };
  return (
    <div className="chat__header">
  
      <Hidden smUp>
        <Link to="/">
          <div className="chat__back_button">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </div>
        </Link>
      </Hidden>

      <Avatar>{}</Avatar>
      <div className="chat__headerInfo">
        <h3>{roomName}</h3>
        <Hidden only={["xs"]}>
          {isLastMessage ? (
            <>
              {showDate ? (
                <p>Last seen {getDateFromMessage()}</p>
              ) : (
                <p>Last seen {getDateLocal()}</p>
              )}
            </>
          ) : null}
        </Hidden>
      </div>
    </div>
  );
}

export default ChatHeader;
