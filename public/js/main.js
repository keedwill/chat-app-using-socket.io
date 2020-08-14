const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessages = document.querySelector(".chat-messages");

//get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//join chat room
socket.emit('joinRoom',{username,room})


//message from server
socket.on("message", (message) => {
  outputMessage(message);

  //scroll down anytime we get a message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get the message from the input field by its id
  const msg = e.target.elements.msg.value;

  //emit message to the server
  socket.emit("chatMessage", msg);

  //clear input field
  e.target.elements.msg.value = "";

  //and after clearing focus on the field
  e.target.elements.msg.focus();
});

//output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  //add a message class
  div.classList.add("message");
  //set the innerhtml
  div.innerHTML = `	<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
