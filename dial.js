//负责显示唱名的标盘
class Dial extends ShowObj {
    constructor(setting) {
        super(MLC.get_dial_pos(setting));

        //this.add(new $tk_arc({ style: "red 5", radius: 10 }));

        let a = new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting, setting.tape.cell_height / 2)));
        a.alpha = 0.8;
        this.add(a);
        this.add(new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting))));

        this.pitchNames = [];
        this.Init_PitchNames(setting);

        this.shortNames = [];
        this.Init_ShortNames(setting);

        this.setting = setting;

        this.playing_time = new Array(setting.pitch_names.length).fill(0);
    }



    Init() {
        this.on("MusicBox.Sing", e => {
            e.forEach(s => {
                this.Play(s);
            })
        })
    }

    Init_PitchNames(setting){
        setting.pitch_names.forEach((o, i) => {
            let s = new ShowObj(MLC.get_dial_pitch_name(setting, i));
            let ofs = 9;
            let color = "black";
            for (let t = 0; t < o.length; t++) {
                if (o[t] === "#")
                    s.add(new $tk_font({ text: o[t], style: color, font: `13px serif`, pos: [-ofs, -ofs] }));
                else if (Object.is(o[t] * 1, NaN))
                    s.add(new $tk_font({ text: o[t], style: color, font: `24px serif`, pos: [0, 0] }));
                else
                    s.add(new $tk_font({ text: o[t], style: color, font: `13px serif`, pos: [ofs, ofs] }));
            }

            this.add(s);
            this.pitchNames.push(s);
        });
    }

    Init_ShortNames(setting){
        setting.short_names.forEach((o, i) => {
            let s = new ShowObj(MLC.get_dial_pitch_name(setting, i));
            let ofs = 8;
            let color = "black"
            for (let t = 0; t < o.length; t++) {
                if (o[t] === "#")
                    s.add(new $tk_font({ text: o[t], style: color, font: `13px serif`, pos: [-ofs, -ofs] }));
                else if (Object.is(o[t] * 1, NaN))
                {
                    let pos = null
                    if(/\.$/.test(o)) pos=[3,7];
                    else if(/\.{2}\d/.test(o) && t===0) pos = [3,-23];
                    else if(/\#?\.\d/.test(o) && o[t]===".") pos = [3,-19];
                    s.add(new $tk_font({ text: o[t], style: color, font: `24px serif`, pos:pos }));
                }
                    
                else
                    s.add(new $tk_font({ text: o[t], style: color, font: `24px serif`, pos: [0, 0] }));
            }
            s.visible = false;
            this.add(s);
            this.shortNames.push(s);
        });
    }

    Play(syllable) {
        this.playing_time[syllable] = 500;
    }

    ShowPitchName(){
        this._setPitchName(true);
        this._setShortName(false);
    }
    ShowShortName(){
        this._setPitchName(false);
        this._setShortName(true);
    }

    _setPitchName(isShow){
        this.pitchNames.forEach(o=>o.visible = isShow);
    }
    _setShortName(isShow){
        this.shortNames.forEach(o=>o.visible = isShow);
    }

    update(t, ...x) {
        super.update(t, ...x);
        for(let i =0;i<this.playing_time.length;i++){
            this.playing_time[i] -= t;
            let color = (this.playing_time[i] <= 0) ? "black" : "red";
            for(let txt of this.pitchNames[i]) {
                txt.fontColor = color;
            };
            if (this.playing_time[i] < 0) this.playing_time[i] = 0;
        };
    }
}