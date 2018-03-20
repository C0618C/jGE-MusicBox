//负责显示唱名的标盘
class Dial extends ShowObj {
    constructor(setting) {
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;
        let cp = [setting.tape.pos.x + tape_width / 2 - setting.tape.cell_width / 2, setting.tape.pos.y / 2 - 30];
        super({ x: cp[0], y: cp[1] });

        this.add(new $tk_arc({ style: "red 5", radius: 10 }));

        let a = new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting, setting.tape.cell_height / 2)));
        a.alpha = 0.8;
        this.add(a);
        this.add(new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting))));

        this.pitchNames = [];
        setting.pitch_names.forEach((o, i) => {
            let s = new ShowObj(MLC.get_dial_pitch_name(setting, i));
            let ofs = 7;
            let color = "black"
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

    Play(syllable) {
        this.playing_time[syllable] = 500;
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