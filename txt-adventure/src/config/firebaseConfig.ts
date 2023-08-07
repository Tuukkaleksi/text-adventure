import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD3Sa-BBAzes5K_dPS3hLa8YiiHpW0HSoM",
    authDomain: "text-adv-game.firebaseapp.com",
    databaseURL: "https://text-adv-game-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "text-adv-game",
    storageBucket: "text-adv-game.appspot.com",
    messagingSenderId: "1071501620416",
    appId: "1:1071501620416:web:4e141f1a04f02b17d52925",
    measurementId: "G-N0VN9C2YN3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { analytics, db };
export const auth = getAuth(app);
export default app;