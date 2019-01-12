var Discord = require('discord.io');
var auth = require('./auth.json');
var roller = require('./roller.js');
var fs = require('fs');
console.log("Initializing Discord Bot");
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function () {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, event) {
    try {
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];

            args = args.splice(1);
            switch (cmd.toLowerCase()) {
                case 'roll':
                    bot.sendMessage({
                        to: channelID,
                        message: roller.eval_roll(message.substring(5, message.length).replace(/\s*\[.*?\]\s*/g, ''))
                    });
                    break;
                case 'help':
                    var message = "Try using '!roll 1d20 + 5' :)"
                    bot.sendMessage({
                        to: channelID,
                        message: message
                    });
                    break;
                default:
                    console.log("Unknown argument: " + cmd);
            }
        }
    } catch (err) {
        console.log("Error caught:");
        console.log(err.message);
        console.log("\n\n");
    }
});
console.log("loaded");
