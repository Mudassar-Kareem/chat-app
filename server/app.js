const express= require('express');
const app = express();
const path =  require('path');
const port = 4000;
const server = app.listen(port,()=>{console.log(`Server is runnning on port ${port}`)});
const io = require('socket.io')(server)
app.use(express.static(path.join(__dirname, 'public')));
let socketConnected = new Set();
io.on('connection', onConnected);
function onConnected (socket){
    console.log("Socket connnected ",socket.id);
    socketConnected.add(socket.id);
    io.emit('client-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketConnected.delete(socket.id);
        io.emit('client-total', socketConnected.size);
      })
      socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
      })

      socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
      })
}