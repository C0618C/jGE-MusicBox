class Music {
    constructor() {
        this.myMusic = new Map();
    }

    AddNote(time, syllable) {
        syllable = Math.round(syllable);
        time *= 1;
        if (!this.myMusic.has(time)) this.myMusic.set(time, new Set());
        let n = this.myMusic.get(time);

        if (n.has(syllable)) n.delete(syllable);
        else n.add(syllable);
    }


    Play(time) {
        return this.myMusic.has(time) ? this.myMusic.get(time) : [];
    }

    get Score() { return this.myMusic; }

    Save() {
        let rslObj = {};
        this.myMusic.forEach((syllables, time) => {
            rslObj[time] = [];
            syllables.forEach(s => {
                rslObj[time].push(s);
            });
        });
        return JSON.stringify(rslObj);
    }

    Load(ms) {
        try {
            let mo = JSON.parse(ms);
            for (let time in mo) {
                for (let s of mo[time]) {
                    this.AddNote(time, s);
                }
            }
        } catch (err) {
            console.error('曲谱分析失败。');
        }
    }

}