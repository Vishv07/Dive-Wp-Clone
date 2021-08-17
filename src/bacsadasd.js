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
import { auth, firebase } from "./firebase";
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
        console.log(authUser.uid);
        dispatch(setUser(authUser));
        setLoading(true);


        


        getUsers(authUser);

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
          alert("dek");
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
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              console.log();
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
  }, []);



  function getUsers(authuser){
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach(element => {
          var data = element.data();
          data.id = element.id;
          console.log(data);
          if(element.id != authuser.uid){
            setUsers(arr => [...arr , data]);
          }
      });
  })
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
