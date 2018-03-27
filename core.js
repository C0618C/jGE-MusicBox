class Core extends Manager {
    constructor(_jGE, setting) {
        super(_jGE, "音乐机芯")
        this.tape = null;

        this.isPlaying = false;

        this.setting = setting;

        this.last_time = -1;
        this.max_time = 999;
    }

    Init(tape) {
        this._jGE.InitMessage(this);

        this.on("MusicBox.Play", () => {
            this.isPlaying = true;
            this.max_time = Math.max(...this.tape.curMusic.Score.keys())
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
        // if(curtime !=-1)console.log(curtime)
        if (curtime == this.last_time || curtime < 0) return;

        if(this.max_time+3 < curtime) this.broadcast("MusicBox.Stop");

        let syllable = this.tape.curMusic.Score.get(curtime);
        if (syllable) this.Play(curtime, syllable);
    }

    Play(time, syllable) {
        if (syllable.size == 0) return;
        this.last_time = time;

        syllable.forEach(element => {
            let id = this.setting.pitch_names[element];
            let audio = this._jGE.ResourceManager.GetRes(id, "voice");
            if (audio == null) {
                console.warn(`加载资源失败，ID:${id}.`);
                return;
            }
            try{
                if(audio.currentTime<audio.duration) audio.load()
                audio.play();
            }catch(err){
                console.warn(`播放音频文件失败${id}:${err}`);
            }
            
        });

        this.broadcast("MusicBox.Sing", syllable);
    }

}