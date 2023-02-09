import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD8suPN2zgeHy2JskBszDJ6grqAdNesuoM",
    authDomain: "whatsapp-424fc.firebaseapp.com",
    projectId: "whatsapp-424fc",
    storageBucket: "whatsapp-424fc.appspot.com",
    messagingSenderId: "925588485703",
    appId: "1:925588485703:web:cbf64d51202fdf4f612362"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();

const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
