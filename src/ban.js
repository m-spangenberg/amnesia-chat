// module.exports.x = x;
// module.exports.x = x;

/*
BANHAMMER
---
manually target session id for ban

function banUser(userName, banTime) {
    if (// if usernamme is in active user list) {
        //append or push ip associtated to username to banlist along with bantime
    }
}
*/

/*
BANTOME
---
ban list on fs with ip and cooldown condition
a list of key-value objects should be fine
eg: {ip: 127.0.0.1, jailtime: 720 }
*/

/*
BANTIMER
---
checks lapsed bans and clear banlist every 5 minutes

bantome.forEach(prisoner => {
    if ( // cooldown is more than zero ) {
        // reduce timer by 5 points
    } else {
        // delete ip from bantome
    }   
});
*/

/*
BANSIPHON
---
checks if session-id ip is banned and executes redirect

// Check banlist and eject connecting user

if (ban.banlist.includes(thisUser.userIP)) {
    socket.emit('err', {message: 'banned'})
    // fetch bantimer from banlist
    var healthhazard = '/ban.html';
    socket.emit('banredirect', healthhazard);
    socket.disconnect();
    return
}
*/

/*
SMITE
---
assigns point based weighting to individual user id's based on offensive behaviour

if word in chat message contains vulgarity in list add banpoint to user in active user-list
if user in active user-list emits message faster than rate limit, add banpoint to user
if chat message contains x-rule-breaker, add banpoint to user
*/