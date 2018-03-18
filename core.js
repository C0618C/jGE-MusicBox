class Core extends Manager {
    constructor(_jGE,setting) {
        super(_jGE, "音乐机芯")
        this.on = null;
        this.broadcast = null;
        this.tape = null;

        this.isPlaying = false;

        this.setting=setting;

        this.last_time = -1;
    }

    Init(tape) {
        this._jGE.InitMessage(this);

        this.on("MusicBox.Play", () => {
            this.isPlaying = true;
        });
        this.on("MusicBox.Stop", () => {
            this.isPlaying = false;
        });

        this.tape = tape;
        this._jGE.add(this);
    }

    update(t) {
        if (!this.isPlaying) return;
        let curtime = this.tape.GetTime();
        if (curtime == this.last_time || curtime < 0) return;

        let syllable = this.tape.curMusic.Score.get(curtime);
        if (syllable) this.Play(curtime, syllable);
    }

    Play(time, syllable) {
        if(syllable.size == 0)return;
        this.last_time = time;

        this.broadcast("MusicBox.Sing", syllable);
    }

}