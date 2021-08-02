

class playlistengine {

    constructor() {
        // Store a list of 5 or more recommended songs.
        //      Once the normal queue in the music player reaches it's end,
        //      we can resort to using this queue. We also want to store a 
        //      back log of everything that was played in case users want 
        //      to see what was recommended.
        this.recQueue = []
    }

    /* 
        My initial thinking was that we build up a dictionary of keywords that we 
        can use to just search youtube for music right. The downfalls ofcourse are that 
        we may end up misinterpreting something like the title.

        So upon further thinking I realised that what might be the most appealing for 
        users is to run an audial analysis. So we look for new music that has a 
        similar BPM, chord progression etc. 
        We should be able to extract the information by using database search engines 
        such as:
        Wolfram Alpha - https://www.wolframalpha.com/
        Actually wolfram alpha is seriously in depth.
        It's just not very up to date

        This site seeme to literally have everything we need though.
        https://getsongbpm.com/song/sultans-of-swing/4QLx5V
        "Our Web API gives external applications access to our BPM database. 
        All you need is a valid API key!"
        BOOOOO YAH

        This site has lyrics 
        https://lyrics.fandom.com/wiki/Dire_straits:sultans_of_swing
    
    */


    Analyse(title, URL) {

    }

    titleAnalysis(title) {
        // If we can't find anything significant in the latter two methods,
        //      Resort to using the title to find similar/recomended content
        //      from search engines
    }

    lyricAnalysis(title, lyrics) {
        // Return key lyric themes that are present in lyric sheets
    }

    audialAnalysis(title, URL) {
        // Return BPM, key, chord or vocal attributes.
        // We'll get the information by using a database like wolfram alpha or something
        
    }
}