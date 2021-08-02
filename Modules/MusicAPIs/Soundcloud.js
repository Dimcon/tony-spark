const SoundCloud = require('soundcloud-api-client');
const client_id = 'your-client-id';
const soundcloud = new SoundCloud({ client_id });


class soundcloudapi {

    constructor() {
        this.APIstrings = ["soundcloud", "sc", "cloud"]
        this.apiID = "youtube"
    }

    async AddToQueueFromRequest(message,request,callback) {
        if (request.indexOf('www.youtube.com') > -1) {
		} else {
		}
    }
    
    async getOpusStream(url) {
		return ytdldiscord(url)
	}
}

module.exports = soundcloudapi;