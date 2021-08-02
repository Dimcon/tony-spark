const prefix = "!"; // Set bot prefix here

const auth = require("./auth.json"); // Load token
global.Discord = require("discord.js"); // Load discord.js

global.client = new Discord.Client();
var client = global.client

client.once("ready", () => {
    console.log("Aye aye Captain!")
})
client.login(auth.token) // Sign in and use token

const stdin = process.stdin; // Use the terminal to run JS code like an interpreter
stdin.on("data", function(input) {
    input = input.toString();
    try { // Attempt to run input
        let output = eval(input);
        console.log(output);
    } catch (e) { // Failed
        console.log("Error in eval.\n"+e.stack);
    }
});
/***************************************************************************/
// Putting global variables here
global.last5msgs = []
global.method = []
/***************************************************************************/
// Add new files with modules here
const listModules = []
listModules.push(require("./Modules/Miscelaneous.js").pinger)
listModules.push(require("./Modules/FactChecker.js").objMain)
listModules.push(require("./Modules/MusicPlayer.js").musicplayer)
/***************************************************************************/

client.on("message", message => {

    // keep track of the last few messages
    let msg = message.content
    global.last5msgs.push(message.content)
    if (global.last5msgs.length > 5) {
        global.last5msgs.shift()
    }

    // Loop through file modules and select the appropriate one for the command.
    if (msg.length > 1 && msg.substr(0, prefix.length) == prefix) {
        console.log(prefix + " " + msg.substr(prefix.length))
        msg = message.content.substr(prefix.length)
        let words = msg.split(" ")
        let cmd1 = words[0].toLowerCase()
        let sout = `Welcome to Tony Spark's blueprint guide.\n\n`
        sout += `Use ${prefix}help [category] to get additional info about each category.\n`
        sout += `Use ${prefix}help [command] to get additional info about each command.\n`
        sout += `Use ${prefix}helpall to show a brief overview of all avalible commands.\n`

        if (cmd1 == "help") {
            if (words.length > 1) {
                sout = "Not a Command"
                cmd2 = words[1]

                for (let mod in listModules) {
                    let module = listModules[mod]
                    if (cmd2.toLowerCase() in module.commands) {
                        //This will show just the command.
                        if ("additionalHelp" in module.commands[cmd2.toLowerCase()]) {
                            sout = `> ${prefix}${cmd2.toLowerCase()} -- ${module.commands[cmd2.toLowerCase()].additionalHelp}`
                        } else {
                            sout = `> ${prefix}${cmd2.toLowerCase()} -- ${module.commands[cmd2.toLowerCase()].helptext}`
                        }
                    } else if(cmd2.toLowerCase() == module.displayName.toLowerCase()) {
                        //This will show the commands for a module.
                        sout = `\n====== ${module.displayName} ======\n`
                        for (let cmd in module.commands) {
                            sout += `> ${prefix}${cmd} -- ${module.commands[cmd].helptext}\n`
                        }
                    }
                }  
            } else {
                //This will show just the modules.
                sout += `\nCategories:\n`
                for (let mod in listModules) {
                    let module = listModules[mod]
                    sout += `       *${module.displayName}\n`
                }
            }
            sout = "```"+sout+"```"
            message.channel.send(sout)
            return
        } else if (cmd1 == "helpall") {
            //This will show everything
            for (let mod in listModules) {
                let module = listModules[mod]
                sout += `\n====== ${module.displayName} ======\n`
                for (let cmd in module.commands) {
                    sout += `> ${prefix}${cmd} -- ${module.commands[cmd].helptext}\n`
                }
            }
            sout = "```"+sout+"```"
            message.channel.send(sout)
            return
        }
        for (mod in listModules) {
            if (msg.split(" ")[0].toLowerCase() in listModules[mod].commands) {
                listModules[mod].Main(message,msg)
            }
        }
    }
    
})

