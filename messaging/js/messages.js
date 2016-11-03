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

function createUserPhotoElement(photoURL) {
    var userPhoto = document.createElement("img");
    userPhoto.src = photoURL;
    userPhoto.alt = "gravatar photo of user";
    userPhoto.classList.add("user-photo");
    return userPhoto;
}

function createImageColumn(photoURL) {
    var col = document.createElement("div");
    col.classList.add("col");
    col.appendChild(createUserPhotoElement(photoURL));

    return col;
}

function createContentColumn(message) {
    var col = document.createElement("div");
    col.classList.add("col");
    col.classList.add("message-content-col");

    var title = document.createElement("h4");
    var messageSentOn = document.createElement("span");

    title.classList.add("name");
    title.textContent = message.createdBy.displayName;
    messageSentOn.textContent = moment(message.createdOn).fromNow();

    if (message.isEdited) {
        messageSentOn.textContent += " (edited " + moment(message.editedOn).fromNow() + ")";
    }

    title.appendChild(messageSentOn);

    var messageText = document.createElement("p");
    messageText.textContent = message.content;

    col.appendChild(title);
    col.appendChild(messageText);
    
    return col;
}

function createEditColumn(message, messageElement) {
    var col = document.createElement("div");
    col.classList.add("col");
    col.classList.add("edit-icons-col");

    if (currentUser.uid === message.createdBy.uid) {
        var spanEdit = document.createElement("span");
        spanEdit.classList.add("glyphicon", "glyphicon-pencil");

        spanEdit.addEventListener("click", function() {
            var input = showEditTextbox(messageElement);
            input.addEventListener("keyup", function(e) {
                if (e.keyCode == 13) {
                    messageElement.parentNode.removeChild(input);
                    messageElement.innerHTML = input.value;
                    messageElement.style.display = "";

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

        col.appendChild(spanEdit);

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

        col.appendChild(spanDelete);
    }    

    return col;
}

// https://github.com/info343-a16/info343-in-class/blob/completed/firebase/js/app.js
function renderMessage(snapshot) {
    var message = snapshot.val();

    var row = document.createElement("div"); 
    row.classList.add("row");
    row.appendChild(createImageColumn(message.createdBy.photoURL));
    row.appendChild(createContentColumn(message));
    var messageElement = row.querySelector("p");
    row.appendChild(createEditColumn(message, messageElement));

    messageBoard.appendChild(row);
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