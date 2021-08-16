import firebase from 'firebase';	

const firebaseConfig = {	
    apiKey: "AIzaSyBCyei4knmVWmDaK3z342dUAlrAO1ju3eg",
    authDomain: "chat-app-6fa20.firebaseapp.com",
    databaseURL: "https://chat-app-6fa20-default-rtdb.firebaseio.com",
    projectId: "chat-app-6fa20",
    storageBucket: "chat-app-6fa20.appspot.com",
    messagingSenderId: "654826040444",
    appId: "1:654826040444:web:879ae95ca8a7d29ca7adf9",
    measurementId: "G-DV2P14QVD2"
};	

const firebaseApp = firebase.initializeApp(firebaseConfig);	

const db = firebaseApp.firestore();	
const auth = firebase.auth();	
const provider = new firebase.auth.GoogleAuthProvider();	
const realDB = firebase.database();
const storage = firebase.storage();

export { auth, provider, storage, firebase,realDB };	
export default db;  