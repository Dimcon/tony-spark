const playlist = require('./PlayList.js')
const youtubeapi = require('./MusicAPIs/Youtube.js')

class musicplayer {
    constructor() {
		this.apis = []
		this.apis.push(new youtubeapi())
		this.playlist = new playlist();  

		console.log("Musicplayer initialised")
		this.displayName = "MusicPlayer"
		this.queue = [] //{URL, Title, apiID}
        this.queueposition = 0
        this.voiceChannel = 0
        this.connection = 0
		this.dispatcher = 0		
		this.repeatQueue = false
		this.repeatSong = false			
		this.delOnPlay = false 
		this.curSong = 'Your Mom'
		this.ytdl = require('ytdl-core');

		this.timeoutHandle
		
		this.commands = {}
		let commands = this.commands


		commands["del"] = {
			functor: this.delFile,
			helptext: "[playlistName] Delete a playlist from storage.",
			additionalHelp: "EDIT"
		}
		commands["load"] = {
			functor: this.load,
			helptext: "[playlistname] Load a playlist from storage.",
			additionalHelp: "EDIT"
		}
		commands["save"] = {
			functor: this.save,
			helptext: "[playlistname] Store the current queue.",
			additionalHelp: "EDIT"
		}
		commands["settings"] = {
			functor: this.settings,
			helptext: "Display settings for the toggleable options.",
			additionalHelp: "EDIT"
		}
		commands["delonplay"] = {
			functor: this.delonplay,
			helptext: "Toggle delete-On-Play.",
			additionalHelp: "EDIT"
		}
		commands["repeat"] = {
			functor: this.repeatqueue,
			helptext: "Toggle repeat-queue.",
			additionalHelp: "EDIT"
		}
		commands["repeatsong"] = {
			functor: this.repeatsong,
			helptext: "Toggle repeat-song.",
			additionalHelp: "EDIT"
		}
		commands["skip"] = {
			functor: this.skip,
			helptext: "Skip to current song.",
			additionalHelp: "EDIT"
		}
		commands["remove"] = {
			functor: this.remove,
			helptext: "[#] Reomove from Queue.",
			additionalHelp: "EDIT"
		}
		commands["clear"] = {
			functor: this.clearqueue,
			helptext: "Clear queue.",
			additionalHelp: "EDIT"
		}
		commands["list"] = {
			functor: this.list,
			helptext: "List queue.",
			additionalHelp: "EDIT"
		}
		commands["add"] = {
			functor: this.add,
			helptext: "[song name] Add song.",
			additionalHelp: "EDIT"
		}
		commands["skipto"] = {
			functor: this.skipto,
			helptext: "[#] Skip to postiton in queue.",
			additionalHelp: "EDIT"
		}
		commands["play"] = {
			functor: this.play,
			helptext: "Play a song or start queue.",
			additionalHelp:"EDIT"
		}
		commands["pause"] = {
			functor: this.pause,
			helptext: "Pause current song.",
			additionalHelp: "EDIT"
		}
		commands["resume"] = {
			functor: this.resume,
			helptext: "Resume paused song.",
			additionalHelp: "EDIT"
		}
		commands["stop"] = {
			functor: this.reset,
			helptext: "Use if something breaks.",
			additionalHelp: "EDIT"
		}
		commands["listplaylists"] = {
			functor: this.listPlaylists,
			helptext: "Shows availible playlists.",
			additionalHelp: "EDIT"
		}
		commands["current"] = {
			functor: function(message,msg) {message.reply(`You are currently playing ${this.curSong}`)},
			helptext: "Shows current song",
			additionalHelp: "EDIT"
		}
		commands["pos"] = {
			functor: function(message,msg) {message.reply(`You are currently at position ${this.queueposition+1}`)},
			helptext: "Shows position in queue.",
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
			this.reset()
			console.log(err)
		}
	}

/**************************************************************************************************************************/
/*	
	Stuff thats being worked on:
		sometimes the bot just doesnt play for whatever reason?? should try find out why!.
		Working on a timout feature since we lazy and don't stop the bot when we leave :/.
		Thinking save and stuffs works well enough to use for short nows.					
*/
/**************************************************************************************************************************/
/*	
	Main functions that all work as intented. 
	NOTE: The dispacter sometimes doesnt work as intended, not sure if thats the api?										
*/

	async end(message) {
		//This function is just to keep the workings of .end in the PlayURL function seperate for easy use and readability
		this.queueposition += 1
		if (this.repeatSong)
			this.queueposition -= 1
			 
		if (this.queue.length < 1) {
			this.reset(message)
			return message.reply('Theres no queue left....')
		}
			if (this.queueposition >= this.queue.length) {	
				if (this.repeatQueue) {	
					this.queueposition = 0
					message.reply('The queue is starting over')
				} else {
					this.reset(message)
					return message.reply("Man. repeat no on :/")
				}
			}

		let song = await this.queue[this.queueposition]
		this.playURL(message,song.url,song.title)
	}

	async playURL(message, url, title, apiID) {
		//This plays the URL provided to it

		this.curSong = title
		if(this.delOnPlay){
			this.del(message,this.queueposition)
		}

    	if (!message.member.voiceChannel)  {
			message.channel.send("You need to be in a voice channel to play music!")
			this.reset(message)
    		return;
		}
		this.voiceChannel = message.member.voiceChannel

    	const permissions = this.voiceChannel.permissionsFor(message.client.user);
    	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    	 	message.channel.send("I need the permissions to join and speak in your voice channel!")
    		return;
    	}
    	// Channel.join returns a promise. So we can't use the connection until the promise is completed.
		// The word await tells JS to block the code until the promise is completed and a result is returned.
		this.connection = await this.voiceChannel.join();
	
    	console.log(`Playing URL: ${url}`)
		message.channel.send(`Playing ${title}`)

		// So. needs to be connection.playOpusStream, or it won't work. 
		// Needs to be ytdl-Discord, or it won't work

		let stream = null

		for (let i = 0; i < this.apis.length;i++) {
			let api = this.apis[i]
			if (apiID == api.apiID) {
				stream = api.getOpusStream(url)
			}
		}
		if (stream == null) {
			message.reply("There was a failure")
			return
		}

		this.dispatcher = this.connection.playOpusStream(await stream)
		.on('end', (reason) => {
			if (reason === 'reset'){
				return
			} else {
				this.end(message)
			}
		})
		.on('error', error => {
			message.reply(error)
			console.error(error);
		});
		this.dispatcher.setVolumeLogarithmic(5 / 5);
	}

	async play(message,msg){
		//This is how the users intiates playing their stuffs
		let request = msg.substr("play".length)
		if (request){
			console.log(`request: ${request}`)

			//Adding the request to the queue
			this.resolveAndAddToQueue(message, request, true)
			this.timeOut(message)
		} else {
			//plays the first song in queue
			this.skipto(message,"skipto 1")
		}	
	}

	async playQueueItem(message, queuenum) {
		//This is what tells the playURL function to play
		if (!(queuenum < this.queue.length && queuenum >= 0)) {
			message.reply("Not part of the queue!!")
			return 
		}
		this.queueposition = queuenum
		let song = await this.queue[this.queueposition]
		if (!this.dispatcher) {
			this.playURL(message, song.url, song.title, song.apiID)
		} else {
			this.queueposition -=  1 // This is because it always adds one when dispatcher ends!!
			this.dispatcher.end()
		}
	}

	add(message,msg){
		//this is just to add without playing
		let request = msg.substr("add".length)
		this.resolveAndAddToQueue(message, request, false)
	}

	async resolveAndAddToQueue(message, request, shouldPlay) {
		//This is where the URL string is created
		let api = this.apis[0]
		for (let i = 1; i < this.apis.length;i++) {
			for (let s = 0; s < this.apis[i].APIstrings.length;s++) {
				if (request.indexOf(this.apis[i].APIstrings[s]) > -1) {
					api = this.apis[i]
				}
			}
		}
		api.AddToQueueFromRequest(message,request,(message,URL,Title,apiID) => {
			this.addToQueue(message,URL,Title,apiID)
			if (shouldPlay) {
				this.playQueueItem(message,this.queue.length - 1)
			}
		})


		//if (request.indexOf('www.youtube.com') > -1){
		//	var songInfo = await ytdlcore.getInfo(request)
		//	let song = {
		//		title: songInfo.title,
		//		url: songInfo.video_url,
		//	};
		//	this.addToQueue(message,song.url, song.title)
		//	if (shouldPlay) {
		//		this.playQueueItem(message, this.queue.length - 1)
		//	}
		//} else {
		//	//search for vidoes from request
		//	ytSearch( request, async  (err, r) => {
		//		if ( err ) throw err
		//		//taking the first result
		//		let videos = r.videos;
		//		if (videos[0] == undefined) {
		//			message.reply("Even the internet doesn't know what you're tryna say.")
		//			return "null"
		//		} else {
		//			let link = `https://www.youtube.com${videos[0].url}`
		//			let title = videos[0].title
		//			this.addToQueue(message,link,title)
		//			if (shouldPlay) {
		//				this.playQueueItem(message,this.queue.length - 1)
		//			}
		//		}
		//	})
		//}
	}

	addToQueue(message,url,SongTitle,apiID) {
		//This is where the songs are added to the queue
		let song = {
			"title":SongTitle,
			"url":url,
			"apiID":apiID
		}
		this.queue.push(song)
		message.reply(`${SongTitle} Has been added to the queue!`)
	}

	skip(message,msg) {
		//This skips to the next song in the queue. Note that is is done in a round robin fashion
		if (this.queue.length <= 0) {
			this.reset(message)
			return message.reply("You cant skip in an empty queue.")
		} else {
			if (!this.dispatcher) {
				return message.reply('What you tryna skip?')
			} else {	
				// Dispatcher will increment the queue on end.
				this.dispatcher.end()
			}
		}
	}

	skipto(message,msg) {
		//This is what the users uses to skip to a song in the list
		let request = msg.substr("skipto".length)
		msg = parseInt(request, 10)
		
		if(msg){
			this.playQueueItem(message, (msg-1))
			this.timeOut(message)
		}else{
			message.reply("You needs to give a number man")
			return
		}
	
    }

	pause(message) {
		//This pauses the current song playing
        if (!(message.member.voiceChannel && this.dispatcher)) 
        	return message.reply("Pause what? you're not even in a voice channel bro.");
        this.dispatcher.pause();
        message.reply("Bruh");
    }

	resume(message) {
		//This resumes the song that was paused
        if (!(message.member.voiceChannel && this.dispatcher)) 
        	return message.reply("Listen we've been over this. Join a voice channel (and play some music), then you can start bossing me around.");
        this.dispatcher.resume();
        message.reply("nssssdg");
	}
	
	list(message){
		//This lists all the songs in the queue
		if(this.queue.length == 0)
			return message.reply("Gotta some stuffs first");
		let i = 0
		let sout = "```";
		this.queue.forEach((item)=>{sout += (`[${(++i)}] ${item.title}\n`)});
		sout += "```";
		message.channel.send(sout)
	}

	clearqueue(message) {
		//This empties the queue
		this.queue = []
		return message.reply("Queue has been deleted");
	}

	remove(message,msg) {
		//This is for the user to remove from the queue
		let request = msg.substr("remove".length)
		msg = parseInt(request, 10)
			
		if (msg) {
			if (msg <= this.queue.length + 1 && msg > 0) {
				this.queue.splice((msg - 1), 1)
				message.reply("Deleted song from queue at position: " + (msg));
			}
		} else message.reply("You needs to give a number man");
	}
	
	del(message,pos) {
		//This is for the functions to remove from the queue,, not sure if this is how Im gonna go it but eh??
		this.queue.splice(pos, 1)
		this.queueposition--
	}

	settings(message) {
		//This shows the current settings that you can toggle
		let d = (this.delOnPlay)? 'on':'off'
		let r = (this.repeatQueue)? 'on':'off'
		let s = (this.repeatSong)? 'on':'off'
		message.channel.send( `\nCurrent settings: \n\nRepeat Queue: ${r} \nDelete on play: ${d} \nRepeat Song: ${s}`)
	}

	delonplay(message) {
		//This will toggle delonplay
		this.delOnPlay = (this.delOnPlay == true)? false:true
		let tmp = (this.delOnPlay)? 'on':'off'
		message.reply(`Delete on play is now ${tmp}`)
	}

	repeatqueue(message) {
		//This will toggle repeat queue
		this.repeatQueue = (this.repeatQueue == true)? false:true
		let tmp = (this.repeatQueue)? 'on':'off'
		message.reply(`RepeatQueue is now ${tmp}`)
	}

	repeatsong(message) {
		//This will toggle repeat song
		this.repeatSong = (this.repeatSong == true)? false:true
		let tmp = (this.repeatSong)? 'on':'off'
		message.reply(`RepeatSong is now ${tmp}`)
	}

	async reset(message) {
		// //This resets the music dispatcher from !stop or if needed elsewhere
		clearTimeout(this.timeoutHandle)
		this.curSong = 'Your Mom'
		if (!(this.dispatcher))
			return

		await this.dispatcher.end('reset')
		this.dispatcher = null

		if (!(this.voiceChannel))
			return

		await this.voiceChannel.leave();
		this.voiceChannel = null
		
		return
	}

	timeOut(message){
		//This controlls the timout feature
		console.log('timeOut started')
		clearTimeout(this.timeoutHandle)
		this.timeoutHandle = setTimeout( () => {
			if (!(this.voiceChannel))
				return this.reset(message)
			if (this.voiceChannel.members.size > 1) 
				return this.timeOut(message)
			this.reset(message)
			console.log('timeOut ended')
		}, 900000); //3600000 = 60 minutes
					//900000 = 15 minutes
	}

	save(message,msg){
		//This will save the current queue to a playlist
		msg = msg.substr("save".length)
		this.playlist.playlistfiles = this.queue
		this.playlist.write(message,msg)
	}

	async load(message,msg){
		//This will load the from a playlist to the queue
		msg = msg.substr("load".length)
		await this.playlist.read(message,msg)
		this.queue = this.playlist.playlistfiles
	}

	delFile(message,msg){
		//This will delete the playlist from a playlists folder
		msg = msg.substr("del".length)
		this.playlist.del(message,msg)
	}

	listPlaylists(message,msg){
		//This will list the current playlists stored
		msg = msg.substr("listplaylists".length)
		this.playlist.list(message,msg)
	}

}

module.exports = {
    musicplayer: new musicplayer()
};
