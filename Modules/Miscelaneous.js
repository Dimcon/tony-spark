class obj {
    constructor() {
        console.log("Miscelaneous initialised")
        this.displayName = "PingTester"

        this.commands = {}
        let commands = this.commands
        
		commands["ping"] = {
			functor: this.ping,
			helptext: "I just wanna have fun",
            additionalHelp: "EDIT"
        }
        commands["annoy"] = {
			functor: this.annoy,
			helptext: "I just wanna have fun",
            additionalHelp: "EDIT"
		}
    }

    Main (message,msg) {
		try {
        	let words = msg.split(" ")
			let cmd1 = words[0].toLowerCase()
			
			if (cmd1 in this.commands) {
				let method = this.commands[cmd1].functor
				// Functors store the context of the commands array, 
				//	need to change the context to this to function properly
				method.call(this,message,msg)
			} else {
				message.reply("Not entirely sure what you're on about there m9.")
			}
			
		}
		catch(err) {
			message.channel.send("MR STARK, I DON'T FEEL SO GOOD ... woosh")
			console.log(err)
		}
    }
    
    ping(message,msg){
        message.reply("Pong - From the other side")
    }

    annoy(message,msg){
		//gonna come back to this later
		message.reply("This don't do nutting right now men")
    }
}

module.exports = {
    pinger: new obj()
  };
