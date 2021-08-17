import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing firebase
import db from "../firebase";
import { auth, storage, firebase } from "../firebase";
//importing components
import UserAvatar from "./UserAvatar";
import NewChat from "./NewChat";
import Status from "./Status";
import DrawerLeft from "./DrawerLeft";
import SearchBar from "../shared/SearchBar";
import SidebarChat from "./SidebarChat";
import TooltipCustom from "../shared/TooltipCustom";
//importing material-ui
import CircularProgress from "@material-ui/core/CircularProgress";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//importing styles
import "./Sidebar.css";

function Sidebar({ rooms, setIsRoomExist, isRoomExist }) {
  const history = useHistory();
  const { roomId } = useParams();
  const [{ user }] = useStateValue();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState(null);
  const [isSearchFound, setIsSetSearchFound] = useState(false);


  // useEffect(() => {

  //   // checks if room exists, else will be redirect to landing screen
  //   var roomList = rooms;
  //   if (roomList) {
  //     //checks if the current route(roomId) exists in roomList(array)
  //     const index = roomList.findIndex(function (id, index) {
  //       return id.id === roomId;
  //     });

  //     if (index >= 0) {
  //       setIsRoomExist(index);
  //       // console.log("ROOM EXISTS");
  //     } else if (index === -1) {
  //       setIsRoomExist(index);
  //       history.push("/");
  //       // console.log("ROOM DOES NOT EXIST");
  //     }
  //   }
  // }, [search, rooms, roomId, history, setIsRoomExist]);

  // useEffect(() => {
  //   if (rooms) {
  //     if (rooms.length > 0) {
  //       setNoRooms(false);
  //       setLoading(true);
  //     } else if (rooms.length === 0 && isRoomExist === -1) {
  //       setNoRooms(true);
  //       setLoading(true);
  //     }
  //   }
  // }, [rooms]);



  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <UserAvatar
          id="UserProfile"
          photoURL={user.photoURL}
        />
        <DrawerLeft
          drawerLeft={drawerLeft}
          setDrawerLeft={setDrawerLeft}
          db={db}
          auth={auth}
          storage={storage}
        />

        <div className="sidebar__headerRight">
          <Status />
          <NewChat db={db} user={user} firebase={firebase} />
          <TooltipCustom
            name="Menu"
            icon={<MoreVertIcon />}
          />
        </div>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search or start new chat"
      />

      <div className="sidebar__chats">
        {loading ? (
        <div className="sidebar__chatsContainer_loading">
            <div>
              <CircularProgress />
            </div>
        </div>
        ) : (
              <>
                {rooms.map((room) => (
                  <SidebarChat
                    key={room.id}
                    id={room.id}
                    name={room.name}
                  />
                ))}
              </>
            )}

        {noRooms && loading ? (
          <div className="sidebar__chatsContainer_empty">
            <span>No chats</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
