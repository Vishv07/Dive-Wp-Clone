import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import db from '../firebase';
import './SidebarChat.css';
import { useStateValue } from '../StateProvider';

function SidebarChat({ id, name, isOnline }) {
    const [messages, setMessages] = useState([]);
    const [{ user }] = useStateValue();
    useEffect(() => {
        if(id){
          db.collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) =>
                doc.data()))
            ));
        }
    }, [id]);

    function chatID() {
        if(user.uid < id){

            return user.uid+id;  
        }
        else{
            return id+user.uid;
        }
            
    }
    
    return (
       <> 
       { name ? (<Link 
            to={`/rooms/${chatID()}/${id}`}
           className="sidebarChat__link">
            <div className="sidebarChat">
                <Avatar>{name[0]}</Avatar>
                <div className="sidebarChat__info">
                    <h2 style ={{color: isOnline ? " green" : "black"}}>{name}</h2> 
                    {messages[0]?.photo?
                        <div className="sideChat__photo">
                            <PhotoCameraIcon /> <span>Photo</span>
                        </div>
                    :null}
                    {messages[0]?.video?
                        <div className="sideChat__photo">
                            <VideocamIcon /> <span>Video</span>
                        </div>
                    :null}
                    <p>{messages[0]?.message}</p>
                    <p>{messages[0]?.url}</p>
                </div>
            </div>
        </Link>):(
            <></>
        )}
      </>  
    );   
}

export default SidebarChat
