"use strict"

var signInForm = document.getElementById("signin-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");

signInForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function() {
            window.location = "messages.html";
        })
        .catch(function(err) {
            //for now, just show the error message in an alert
            //but you should do something more user-friendly
            //like display this in the page with appropriate styling
            alert(err.message);
        });

    return false;
});
