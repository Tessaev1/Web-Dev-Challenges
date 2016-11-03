"use strict"; 

var spinner = document.querySelector(".glyphicon-refresh");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJ_JSgcheno4OcE_LAkFDAx6-zwcCLu3Q",
    authDomain: "slam-8558e.firebaseapp.com",
    databaseURL: "https://slam-8558e.firebaseio.com",
    storageBucket: "slam-8558e.appspot.com",
    messagingSenderId: "69189010832"
};
firebase.initializeApp(config);

function toggleFeedback() {
    spinner.classList.toggle("hidden");
}

