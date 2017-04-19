// TMI options and client connect fucntion

var tmi = require("tmi.js");

var options = {
    
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "nncbot_",
        password: "oauth:key"
    },
    channels: ["channelname"]
};

var client = new tmi.client(options);

client.connect();


// Games global variables

var playername = "";
var gameactive = 0;
var dragonhp = 0;
var playerhp = 0;
var dragonroll = 0;
var playerroll = 0;


// Game functions

var gamestart = function(name) {
    
    playername = name;
    gameactive = 1;
    dragonhp = 5;
    playerhp = 3;
}

var gameend = function() {
    gameactive = 0;
    dragonhp = 0;
    playerhp = 0;
    playername = "";
    
}

var rollDie = function() {
    
    return Math.floor(Math.random() * 20 + 1);
}


// Bot responses start here


// Look for RevloBot reward redeemed message and start the game for that specific user

client.on("chat", function (channel, userstate, message, self) {

    if (self) return;
    
    var msg = message.split(" ");
    console.log(msg);
    
    if (userstate['username'] === "revlobot" && msg[1] === "spent" && msg[msg.length-1] === "Dragon!'.") {
        client.say(channel, "Rejoice people of Nerdonia! A champion has answeared our call. " + msg[0] + " shall battle the evil Dragon in our name.");
        gamestart(msg[0]);
    }

});


// Just a debug feature

client.on("chat", function (channel, userstate, maessage, self) {
    
    if (self) return;
    
    if(userstate['username'] === "hadean_" && maessage === "!gamestart"){
        gamestart(userstate['username']);
    }
});


// Look for the users command that redeemed the reward and generate a result

client.on("chat", function (channel, userstate, message, self) {
    
    if (self) return;
    
    if(message === "!rd20" && userstate['username'] === playername) {
        playerroll = rollDie();
        dragonroll = rollDie();
        
        if(playerhp > 0 && dragonhp > 0 && gameactive > 0){
            
            if(playerroll > dragonroll) {
                dragonhp--;
                client.say(channel, playername + " rolled a " + playerroll + " and the Dragon rolled a " + dragonroll);
                client.say(channel, playername + " deals a mighty blow to the Dragon, leaving it with " + dragonhp + " HP");
                
                if(dragonhp < 1) {
                    client.say(channel, playername + " has slain the beast and claimed its treasures!");
                    client.say(channel, "!bonus " + playername + " 2000");
                    gameend();
                }
            } else if(dragonroll > playerroll) {
                playerhp--;
                client.say(channel, playername + " has rolled a " + playerroll + " and the Dragon has rolled a " + dragonroll);
                client.say(channel, "The Dragon spews forth a torrent of fire, leaving our hero with " + playerhp + " HP");
                
                if(playerhp < 1) {
                    client.say(channel, playername + " bit the dust!");
                    client.say(channel, "Shamefur dispray!");
                    gameend();
                }
            } else {
                client.say(channel, playername + " has rolled a " + playerroll + " and the Dragon has rolled a " + dragonroll + ". The fight continues!");
            }
            
        } else {}
    }
    
});
