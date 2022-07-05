import { initializeApp } from "firebase/app";
import {
    getFirestore
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBRmYvszncC15rdKxg1s7sfKTuQcLul1T4",
    authDomain: "websit-ngetik-cepat.firebaseapp.com",
    projectId: "websit-ngetik-cepat",
    storageBucket: "websit-ngetik-cepat.appspot.com",
    messagingSenderId: "788971784720",
    appId: "1:788971784720:web:5f720496304008854ad895",
    measurementId: "G-V90X9M4EC2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
};
// export const yes = " yes"