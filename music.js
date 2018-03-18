class Music {
    constructor(){
        this.myMusic = new Map();
    }

    AddNote(time,syllable){
        if(!this.myMusic.has(time)) this.myMusic.set(time,new Set());
        let n = this.myMusic.get(time);

        if(n.has(syllable)) n.delete(syllable);
        else n.add(syllable);
    }


    Play(time){
        return this.myMusic.has(time)?this.myMusic.get(time):[];
    }

    get Score() { return this.myMusic; }


}