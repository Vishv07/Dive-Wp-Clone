import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
//importing firebase
import db from "./firebase";
import { auth, firebase, realDB } from "./firebase";
//importing actions
import { setUser } from "./actions/userAction";
//importing components
import Login from "./Login";
import Sidebar from "../src/Sidebar/Sidebar";
import Chat from "../src/Chat/Chat";
import { ToastContainer } from "react-toastify";
import { toastInfo } from "./shared/toastInfo";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
//importing styles
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [isRoomExist, setIsRoomExist] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
        setLoading(true);
        getUsers(authUser);
        let RTDBref = realDB.ref("/useronlineSet");
        RTDBref.on('value', snapshot => {

          RTDBref
            .onDisconnect() // Set up the disconnect hook
            .update({[authUser.uid]:"offline"}) // The value to be set for this key when the client disconnects
            .then(() => {
                // Set the Firestore User's online status to true
                db.collection("users")
                  .doc(authUser.uid)
                  .set({
                    online: true,
                  }, { merge: true});

                // Let's also create a key in our real-time database
                // The value is set to 'online'
                RTDBref.update({[authUser.uid]:"online"});
            });

        });

        if (authUser.isAnonymous === true && authUser.displayName === null) {
          var anonymousName =
            "Anonymous" + " " + Math.floor(Math.random() * 1000000);

          auth.currentUser.updateProfile({
            displayName: anonymousName,
            photoURL: "",
          });

          db.collection("users")
            .doc(authUser.uid)
            .set({
              name: anonymousName,
              about: "Hey there! I am using WhatsApp.",
              photoURL: "",
              role: "anonymous",
              online: true,
              dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function () {
              console.log("Document successfully updated!");
            })
            .catch(function (error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        }

        if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL !== null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                // console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  name: authUser.displayName,
                  about: "Hey there! I am using WhatsApp.",
                  photoURL: user.photoURL,
                  role: "regular",
                  online: true,
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        } else if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL === null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  name: authUser.displayName,
                  about: "Hey there! I am using WhatsApp.",
                  photoURL: "",
                  role: "regular",
                  online: true,
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        }
      } else {
        dispatch(setUser(null));
        setLoading(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch,user]);
  function getUsers(authuser) {
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          data.id = element.id;
          console.log(data);
          if (element.id != authuser.uid) {
            setUsers((arr) => [...arr, data]);
          }
        });
      });
  }
  return (
    <div className={`app ${loading === false && "app-no-bg"}`}>
      {loading ? (
        <>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
          {!user ? (
            <Login />
          ) : (
            <div className="app__body">
              <Router>
                <Switch>
                  <Route exact path="/">
                    <Sidebar
                      rooms={users}
                      setIsRoomExist={setIsRoomExist}
                      isRoomExist={isRoomExist}
                    />
                    <Hidden only={["xs"]}>
                      {" "}
                      {/* Chat component will be hidden in mobile view */}
                      <Chat isRoomExist={isRoomExist} />
                    </Hidden>
                  </Route>

                  <Route exact path="/rooms/:roomId/:rec_id">
                    <Hidden only={["xs"]}>
                      {" "}
                      {/* Sidebar component will be hidden in mobile view */}
                      <Sidebar
                        rooms={users}
                        setIsRoomExist={setIsRoomExist}
                        isRoomExist={isRoomExist}
                      />
                    </Hidden>
                    <Chat isRoomExist={isRoomExist} />
                  </Route>

                  <Route path="*">
                    <Redirect to="/" />
                  </Route>
                </Switch>
              </Router>
            </div>
          )}
        </>
      ) : (
        <div className="app__loading">
          <div>
            <div className="app__loading_circular">
              <CircularProgress />
            </div>
            <div className="app__loading_linear">
              <LinearProgress />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
