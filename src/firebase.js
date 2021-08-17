import firebase from 'firebase';	

const firebaseConfig = {
    apiKey: "AIzaSyBCyei4knmVWmDaK3z342dUAlrAO1ju3eg",
    authDomain: "chat-app-6fa20.firebaseapp.com",
    projectId: "chat-app-6fa20",
    databaseURL: "https://chat-app-6fa20-default-rtdb.firebaseio.com/",
    storageBucket: "chat-app-6fa20.appspot.com",
    messagingSenderId: "654826040444",
    appId: "1:654826040444:web:879ae95ca8a7d29ca7adf9",
    measurementId: "G-DV2P14QVD2"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);	

const db = firebaseApp.firestore();	
 const realDB = firebase.database();
const auth = firebase.auth();	
const provider = new firebase.auth.GoogleAuthProvider();	
const storage = firebase.storage();

export { auth, provider, storage, firebase,realDB };	

export default db;  