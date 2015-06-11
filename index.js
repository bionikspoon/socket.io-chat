var express = require('express');
var http = require('http');
var app = express();

var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('index    ', 'A user connected');
  io.emit('CHAT_MESSAGE', {
    date: Date.now(),
    message: 'A user connected'
  });

  socket.on('disconnect', function () {
    console.log('index    ', 'user disconnected');
    io.emit('CHAT_MESSAGE', {
      date: Date.now(),
      message: 'A user disconnected'
    });
  });

  socket.on('CHAT_MESSAGE', function (message) {
    if (message && message.user && message.message) {
      message.date = Date.now();
      console.log('index    ', 'message: ', message);

      io.emit('CHAT_MESSAGE', message);
    }
  });

  socket.on('IS_TYPING', function (data) {
    io.emit('IS_TYPING', data);
  })

});

server.listen(port, function () {
  console.log('listening on *:%d', port);
});
