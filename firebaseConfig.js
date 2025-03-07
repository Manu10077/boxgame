const firebaseConfig = {
    apiKey: "AIzaSyDc8CNPoq-mm60KA-G_VGu76hV111kzZ1g",
  authDomain: "clickthebox-52b4c.firebaseapp.com",
  projectId: "clickthebox-52b4c",
  storageBucket: "clickthebox-52b4c.firebasestorage.app",
  messagingSenderId: "996177915867",
  appId: "1:996177915867:web:b6fc6ebf9e728e49fdc1fe",
  measurementId: "G-6FECCP02T9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
