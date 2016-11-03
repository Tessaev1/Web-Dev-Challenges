"use strict";

var channelMessagesLimit = 100;
var general = document.querySelector("#general-channel");
var random = document.querySelector("#random-channel");
var currentChannel, currentChannelLimited;
changeChannel(general, "general messages");
var messageForm = document.querySelector("#new-message-form");
var messageInput = messageForm.querySelector(".new-message");
var messageBoard = document.querySelector(".message-board");
var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        if (!currentUser.emailVerified) {
            var messageInput = document.querySelector(".input-group");
            messageInput.style.display = "none";
            var verificationMessage = document.createElement("p");
            verificationMessage.textContent = "You must verify your email address before you can post messages. Follow the email verification link sent to your inbox. You must sign out and back in to complete the process.";
            verificationMessage.style.color = "#ff0000";
            messageForm.appendChild(verificationMessage);
        }
    } else { 
        window.location = "index.html";
    }
});

general.addEventListener("click", function() {
    changeChannel(general, "general messages");
});

random.addEventListener("click", function() {
    changeChannel(random, "random messages");
});

function changeChannel(channel, refName) {
    channel.style.fontWeight = 900;
    setSpinnerHidden(false);
    currentChannel = firebase.database().ref(refName);
    currentChannelLimited = currentChannel.limitToLast(channelMessagesLimit);
    currentChannelLimited.on("value", render);
}

messageForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    var message = {
        content: messageInput.value,
        createdOn: firebase.database.ServerValue.TIMESTAMP,
        createdBy: {
            uid: currentUser.uid,                   
            displayName: currentUser.displayName,  
            photoURL: currentUser.photoURL        
        },
        isEdited: false,
        editedOn: ""
    };

    currentChannel.push(message);
    messageInput.value = "";

    return false;
});

// https://github.com/info343-a16/info343-in-class/blob/completed/firebase/js/app.js
function renderMessage(snapshot) {
    var message = snapshot.val();
    var div = document.createElement("div"); 

    var userPhoto = document.createElement("img");
    userPhoto.src = message.createdBy.photoURL;
    userPhoto.alt = "gravatar photo of user";
    userPhoto.classList.add("user-photo");
    div.appendChild(userPhoto);

    var spanMessage = document.createElement("span");
    spanMessage.textContent = message.content;
    spanMessage.classList.add("message-content");
    div.appendChild(spanMessage);

    var spanCreation = document.createElement("span");
    spanCreation.textContent = moment(message.createdOn).fromNow() + 
        " by " + 
        (message.createdBy.displayName);

    spanCreation.classList.add("message-creation");
    div.appendChild(spanCreation);

    if (currentUser.uid === message.createdBy.uid) {
        var spanEdit = document.createElement("span");
        spanEdit.classList.add("glyphicon", "glyphicon-pencil");

        spanEdit.addEventListener("click", function() {
            var input = showEditTextbox(spanMessage);
            input.addEventListener("keyup", function(e) {
                if (e.keyCode == 13) {
                    spanMessage.parentNode.removeChild(input);
                    spanMessage.innerHTML = input.value;
                    spanMessage.style.display = "";

                    // finds the message to be edited using its unique key and the current channel's ref name
                    var messageContentRef = firebase.database().ref(currentChannelLimited.path.o[0] + "/" + snapshot.key);
                    messageContentRef.update({content: input.value});

                    snapshot.ref.update({
                        isEdited: true,
                        editedOn: firebase.database.ServerValue.TIMESTAMP
                    });
                }
            })
        }); 

        if (message.isEdited) {
            var spanEditCreation = document.createElement("span");
            spanEditCreation.textContent = "(edited " + moment(message.editedOn).fromNow() + ")";
            spanEditCreation.classList.add("message-edit-creation");
            div.appendChild(spanEditCreation);
        }

        div.appendChild(spanEdit);

        var spanDelete = document.createElement("span");
        spanDelete.classList.add("glyphicon", "glyphicon-trash");
        spanDelete.addEventListener("click", function() {
            var confirmDelete = confirm("Are you sure you want to permanately delete this message?");
            if (confirmDelete) {
                snapshot.ref.remove();
            } else {
                alert("You do not have authorization to delete this message");
            }
        });

        div.appendChild(spanDelete);
    }    

    messageBoard.appendChild(div);
}

// http://stackoverflow.com/questions/6814062/using-javascript-to-change-some-text-into-an-input-field-when-clicked-on
function showEditTextbox(content) {
    content.style.display = "none";

    var input = document.createElement("input");
    input.type = "text";
    input.value = content.textContent;
    content.parentNode.insertBefore(input, content);

    return input;
}

// render() renders the entire ref snapshot whenever the data under that ref changes
function render(snapshot) {
    messageBoard.innerHTML = "";
    snapshot.forEach(renderMessage);
    setSpinnerHidden(true);
}

// signs the user out, calling the onAuthStateChanged function above
document.getElementById("sign-out-button").addEventListener("click", function() {
    firebase.auth().signOut();
});