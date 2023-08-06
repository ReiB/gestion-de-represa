// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgS5kfkL7SQE_g4H8xwJV8K6ppNRTeMQ0",
    authDomain: "gestion-de-represa.firebaseapp.com",
    databaseURL: "https://gestion-de-represa-default-rtdb.firebaseio.com",
    projectId: "gestion-de-represa",
    storageBucket: "gestion-de-represa.appspot.com",
    messagingSenderId: "932039907295",
    appId: "1:932039907295:web:da593b6b92fc77f51b166a",
    measurementId: "G-EWC1WLQDGQ"
  };
  
  firebase.initializeApp(firebaseConfig);


  // Initialize Cloud Firestore and get a reference to the service
  const db = firebase.firestore();
  