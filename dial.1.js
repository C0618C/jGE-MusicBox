//负责显示唱名的标盘
class Dial extends ShowObj {
    constructor(setting) {
        super();
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;

        let cp = [setting.tape.pos.x + tape_width / 2 - setting.tape.cell_width / 2, setting.tape.pos.y + tape_width / 2];
        let [arcS, arcE] = [π * 5 / 4, π * 7 / 4]

        this.AddIn(new Vector2D(...cp));


        this.add(new $tk_arc({style: "red 5",radius:10}));

        let a = new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting, setting.tape.cell_height / 2)));
        a.alpha = 0.8;
        this.add(a);
        this.add(new $tk_path(Object.assign({ styleType: 'fill', style: `PowderBlue` }, MLC.get_dial_ract(setting))));

        let pitchNames = [];
        setting.pitch_names.forEach((o,i)=>{
            let s = new ShowObj(MLC.get_dial_pitch_name(setting,i));
            let ofs = 7;
            for(let t =0;t< o.length ;t++){
                if(o[t] === "#")
                    s.add(new $tk_font({ text: o[t], style: 'Maroon', font: `13px serif`, pos: [-ofs,-ofs] }));
                else if(Object.is(o[t]*1,NaN))
                    s.add(new $tk_font({ text: o[t], style: 'Maroon', font: `24px serif`, pos: [0,0] }));
                else
                    s.add(new $tk_font({ text: o[t], style: 'Maroon', font: `13px serif`, pos: [ofs,ofs] }));
            }

            this.add(s);
            pitchNames.push(s);
        })

    }
}