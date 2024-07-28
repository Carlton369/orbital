// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,  signInWithEmailAndPassword } from 'firebase/auth';
import { doc,getDoc, getFirestore, getDocs, collection, onSnapshot, query, where, orderBy, setDoc, Timestamp, updateDoc, deleteDoc} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyC9yK9Uv911HE0vZx-_aK8e51IxtS4EyFA",
   authDomain: "onboard-be6e6.firebaseapp.com",
   projectId: "onboard-be6e6",
   storageBucket: "onboard-be6e6.appspot.com",
   messagingSenderId: "19927913249",
   appId: "1:19927913249:web:4d32b3f5420ef863392460"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
// Export firestore database
// It will be imported into your react app whenever it is needed

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged,
   doc, getDoc, db, getDocs, query,orderBy, where , ref, getDownloadURL, setDoc, Timestamp, updateDoc, deleteDoc,
   storage, collection, onSnapshot,  signInWithEmailAndPassword, uploadBytes};