const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const namegen = require('./src/namegenerator');

// set pug as the template engine for express
app.set('view engine', 'pug')

// const fs = require('fs');

let sessionUsers = [];

// Limit global connection maximum to server
const connectionsLimit = 3

// Serve index page
app.get('/', (req, res) => {
  res.render('index');
});

// Serve about page
app.get('/about', (req, res) => {
  res.render('about');
});

// Serve ban page -- implement properly
app.get('/ban', (req, res) => {
  res.render('ban', {
    title: '😨',
    status: 'You have been banned'
  });
});

// Serve static files from public directory
app.use(express.static(__dirname + '/public'));

// Redirect to 404.html
app.use(function(req, res) {
  res.status(400);
  res.render('404', {
    title: '404!',
    status: 'The content you were looking for does not exist.'
  });
});

// Redirect to 500.html
app.use(function(error, req, res, next) {
  res.status(500);
  res.render('500', {
    title: '500!',
    status: 'Someone unplugged the mainframe.'
  });
});

io.sockets.on('connection', function (socket) {

  // Check room capacity and eject connecting user
  if (io.engine.clientsCount > connectionsLimit) {
    socket.emit('err', {message: 'room full'});
    var firehazard = '/full.html';
    socket.emit('fullredirect', firehazard);
    socket.disconnect();
    return
  };

  // Get connected users and refresh room counter
  const userCount = io.sockets.server.engine.clientsCount;
  io.emit('userCount', userCount);

  const thisUser = {
    userID : '',
    userIP : '',
    userCL : '',
    userGN : ''
  };

  // Get connecting socket information
  const userAddress = socket.handshake;

  thisUser['userID'] = socket.id;
  thisUser['userIP'] = userAddress.address;
  thisUser['userGN'] = namegen.randomNameGenerator();
  thisUser['userCL'] = namegen.randomColourGrabber();
  
  // Give client a random username
  const nickname = thisUser.userGN;

  // Give client a random username colour
  const nicknamecolour = thisUser.userCL;

  // Handle connected client list for session
  sessionUsers.push(thisUser);
  
  // Notify room of new user
  socket.broadcast.emit('notice message', '> ' + nickname + ' has entered the chat...');

  // Push message to chat
  socket.on('chat message', (msg) => {
    io.emit('chat message', {'msg': msg, 'nickname': nickname, 'nicknamecolour': nicknamecolour[0]});
  });

  // Notify room as server
  socket.on('notice message', (noticemsg) => {
    io.emit('notice message', {'noticemsg': noticemsg});
  });

  // Clean up after client leaves
  socket.on('disconnect', () => {
    removeUserlist(thisUser);
    socket.broadcast.emit('notice message', '> ' + nickname + ' has left the chat...');
    const userCount = io.sockets.server.engine.clientsCount;
    io.emit('userCount', userCount);
  });

});

// Removes users from the session on disconnect
function removeUserlist(thisUser) {
  for (let i =0; i < sessionUsers.length; i++)
   if (sessionUsers[i].userID === thisUser.userID) {
      sessionUsers.splice(i,1);
      break;
   }
}

// Check if username is taken before assignment
function checkNameExists(generatedName) {
  for (let i =0; i < sessionUsers.length; i++)
   if (sessionUsers[i].userGN === generatedName) {
      return randomNameGenerator();
    } else {
      break;
   }
}

// Rate limit per sessionID
// Limit sessions per IP to 1

/*
// clean this up and move it to an external module
${}
<div><p class="text-sm text-gray-600">w</p><p class="inline text-left text-xs text-gray-400 mt-1">4:03:13 PM</p><p class="inline ml-2 mr-2 text-xs text-gray-400">|</p><div class="inline rounded-full py-0 px-2 bg-green-500 text-gray-200 text-xs">nickname</div><p></p></div>
*/

http.listen(3000, () => {
  console.log('Server Started: Listening on port *:3000');
});
