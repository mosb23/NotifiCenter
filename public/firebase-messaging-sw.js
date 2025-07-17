importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAmyY2H9l7_4-vRJ1dNVl91CgZVVPfEMTY",
  authDomain: "notificenter-72e30.firebaseapp.com",
  projectId: "notificenter-72e30",
  messagingSenderId: "260126271800",
  appId: "1:260126271800:web:665d34d58904ae343879cd"
});

const messaging = firebase.messaging();
