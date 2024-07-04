const socket = io();
const totalClients = document.getElementById('total-client');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
})
const messageTone = new Audio('/messagetone.mp3');
socket.on('client-total', (data)=>{
    totalClients.innerText = `Total Clients : ${data}`
})
function sendMessage (){
    if(messageInput.value == '') return
    // console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
      }
      socket.emit('message', data);
      addMessageToUi(true, data);
      messageInput.value='';
}
socket.on('chat-message', (data) => {
    // console.log(data)
    messageTone.play();
    addMessageToUi(false,data);
})
function addMessageToUi(isOwnMessage,data){
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message">${data.message}<span>  ${data.name} ● ${moment(data.dateTime).fromNow()}</span></p>
            </li>
    `
    messageContainer.innerHTML += element;
    scrolToBottom();
};
function scrolToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback',{
        feedback: `✍️ ${nameInput.value} is typing a message ...`
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback',{
        feedback: `✍️ ${nameInput.value} is typing a message ...`
    })
})

messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback',{
        feedback: ``
    })
})

socket.on('feedback', (data)=>{
    clearFeedback();
    const element = `
    <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
    `
    messageContainer.innerHTML += element;
})

function clearFeedback (){
    document.querySelectorAll('li.message-feedback').forEach((element)=>{
        element.parentNode.removeChild(element);
    })
}