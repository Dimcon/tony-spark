const fs = require("fs")

class playlist {
/****************************************************************************************************************/
/*
Stuff thats being worked on:
    Maybe have a max of 100 playlists for now? suuuure
 */
/**************************************************************************************************************************/
    constructor() {
        this.playlistfiles = []
    }

    write (message,msg) {
        //This is where the playlist will be saved
        let fileName = msg
        fileName = fileName.replace(/ +/g, "");
        console.log(fileName)
        let file = JSON.stringify(this.playlistfiles)
        if (fileName) {
            let folder = `playlists/${fileName}.json`
            console.log(folder)
            fs.writeFileSync(folder, file)
            message.reply(`Tis saved as: ${fileName}`)
        }else{
            return message.reply('There is no filename bruh!')
        }
    }

    read (message,msg){
        //This is where the playlist will loaded from
        let fileName = msg
        fileName = fileName.replace(/ +/g, "");
        let folder = `playlists/${fileName}.json`
        try {
            let data = fs.readFileSync(folder, 'utf8');
            this.playlistfiles = JSON.parse(data)
            return message.reply('All loaded. good ta go men')
        } catch {
            return message.reply('YOu wot file m8?')
        }
    }

    del (message,msg){
        //This is where the playlist will deleted
        let fileName = msg
        fileName = fileName.replace(/ +/g, "");
        let folder = `playlists/${fileName}.json`
        console.log(folder)
        try{
            fs.unlinkSync(folder)
            return message.reply('Its gone :(((')
        }catch{
            return message.reply('YOu wot file m8?')
        }
    }

    list (message,msg) {
        //This will list all the playlists currently in the playlist folder
        const folder = 'playlists/'
        let tmp
        try {
            fs.readdirSync(folder).forEach(file => {
                //console.log(file);
                tmp = file.substring(0, file.length -5)
                message.channel.send(tmp)
              });
        } catch {
            return console.log("Is broke :/")
        }
        
    }

}

module.exports = playlist;
