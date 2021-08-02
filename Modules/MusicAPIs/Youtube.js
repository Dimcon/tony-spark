const ytdldiscord = require("ytdl-core-discord")
const ytdlcore = require("ytdl-core")
const ytSearch = require('yt-search')

class youtubeapi {

    constructor() {
        this.APIstrings = ["youtube","yt","ute"]
        this.apiID = "youtube"
    }

    async AddToQueueFromRequest(message,request,callback) {
        if (request.indexOf('www.youtube.com') > -1){
			var songInfo = await ytdlcore.getInfo(request)
			let song = {
				title: songInfo.title,
				url: songInfo.video_url,
            };
            callback(message,song.url, song.title, this.apiID)
		} else {
			//search for vidoes from request
			ytSearch( request, async  (err, r) => {
				if ( err ) throw err
				//taking the first result
				let videos = r.videos;
				if (videos[0] == undefined) {
					message.reply("Even the internet doesn't know what you're tryna say.")
					return "null"
				} else {
					let link = `https://www.youtube.com${videos[0].url}`
                    let title = videos[0].title
                    callback(message,link,title,this.apiID)
				}
			})
		}
    }
	
	
    async getOpusStream(url) {
		return ytdldiscord(url)
	}
}

module.exports = youtubeapi;