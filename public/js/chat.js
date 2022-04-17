$(function () {

   // strongly consider using tokens for security!

   const socket = io({secure: true},{transports: ['websocket']});

   $('form').submit(function(e) {
      e.preventDefault();
      socket.emit('chat message', $('#chatBar').val());
      $('#chatBar').val('');
      return false;
   });

   socket.on('chat message', function (msg){
      const thisnickname = msg.nickname;
      const thisnicknamecolour = msg.nicknamecolour;
      const thismessage = msg.msg;
      const now = new Date();
      const thismoment = now.toLocaleTimeString();
      // handle this server side
      $("#chatroom").append("<div class=\"flex mx-4 mb-1\"><div><p class=\"text-sm text-gray-600\">" + thismessage + "</p><p class=\"inline text-left text-xs text-gray-500 mt-1\">" + thismoment + "<p class=\"inline ml-2 mr-2 text-xs text-gray-500\">|</p><div class=\"inline rounded-full py-0 px-2 " + thisnicknamecolour + " text-gray-800 text-xs\">" + thisnickname + "</div>" + "</p></div></div>");
   });

   socket.on('notice message', function(noticemsg){
      const now = new Date();
      const thismoment = now.toLocaleTimeString();
      // handle this server side
      $("#chatroom").append("<div class=\"flex mx-4 mb-1\"><div><p class=\"text-sm text-gray-600\">" + noticemsg + "</p><p class=\"inline text-left text-xs text-gray-500 mt-1\">" + thismoment + "<p class=\"inline ml-2 mr-2 text-xs text-gray-500\">|</p><div class=\"inline rounded-full py-0 px-2 bg-gray-800 text-gray-200 text-xs\"> room </div></p></div></div>");
   })

   socket.on('userCount', function(data){
      $('#userCounter').text(data);
   });

   socket.on('fullredirect', function(firehazard) {
      window.location.href = firehazard;
   });

   socket.on('banredirect', function(healthhazard) {
      window.location.href = healthhazard;
   });
});
