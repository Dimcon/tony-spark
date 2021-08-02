const SerpWow = require('google-search-results-serpwow')

class factchecker {
    constructor() {
        console.log("Factchecker initialised")

        this.serpwow = new SerpWow('demo')
        this.displayName = "FactChecker"

        this.commands = {}
        let commands = this.commands
        
		commands["factcheck"] = {
			functor: this.factcheck,
            helptext: "Fact check a message",
            additionalHelp: "EDIT"
		}
    }

    Main (message, msg) {
        this.factcheck(message,msg)
    }

    async factcheck(message,msg){
        let request = msg.substr("factcheck".length)
        let srequest = request
        if (!request) {
            if (!global.last5msgs.length > 2) {
                message.reply("We need more info...")
                return
            }
            srequest = global.last5msgs[global.last5msgs.length-2]
        }
        let result = await this.serpwow.json({
            q: srequest
        }).catch(error => {
            console.log(error);
            message.reply("We cun't find ot baas")
            return
        });
        let reply =    `\nTitle: ${result.organic_results[1].title}`
            reply +=   `\nResult: ${result.organic_results[1].snippet}`
            reply +=   `\nLink: <${result.organic_results[1].link}>`
        message.reply(reply)
    }
}
module.exports = {
    objMain: new factchecker()
  };
