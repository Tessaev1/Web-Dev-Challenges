"use strict";

var signUpForm = document.getElementById("signup-form");
var displayNameInput = document.getElementById("display-name-input");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var confirmPassword = document.getElementById("confirm-password-input");
var matchMessage = document.getElementById("password-message");

confirmPassword.onkeyup = function() {
    if(this.value === passwordInput.value) {
        matchMessage.textContent = "match";
        matchMessage.style.color = "#33cc33";

    } else {
        matchMessage.textContent = "passwords don't match" 
        matchMessage.style.color = "#ff0000";
    }
};

signUpForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    if (passwordInput.value !== confirmPassword.value) {
        return alert("Your passwords do not match");
    }

    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(user) {
            user.sendEmailVerification();
            return user.updateProfile({
                displayName: displayNameInput.value,
                photoURL: "https://www.gravatar.com/avatar/" + md5(emailInput.value.trim().toLowerCase())
            });
        })
        .then(function() {
            window.location = "messages.html";
        })
        .catch(function(err) {
            alert(err.message);
        });

    return false;
});



