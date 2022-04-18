import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAa0eg73Q_CY9jqOBthOeoIMls8jr3riUc",
  authDomain: "admin-dashboard-24260.firebaseapp.com",
  projectId: "admin-dashboard-24260",
  storageBucket: "admin-dashboard-24260.appspot.com",
  messagingSenderId: "354919225821",
  appId: "1:354919225821:web:6ffcce5b364b142a75be34",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const collectionRef = collection(db, "Categories");
export default app;
