class Tape extends ShowObj {
    constructor(setting) {
        super(setting.tape.pos);
        this.status = {
            playing: false
            , direction: null
            , NoSize: 30    //序号的尺寸
            ,opos:setting.tape.pos.y
        };
        this.setting = setting;
        this.curMusic = new Music();


        //显示用对象
        this.s = [];//短线对象
        this.l = [];//长线对象
        this.no = []; //序号对象
        this.on = null;

        this.points_pos = new Set();
        this.points = new $tk_arc({ styleType: "fill", style: `blue`, radius: setting.tape.point_radius });

        this.bg = null;
    }

    Init(bg) {
        this.status.direction = this.setting.setting.direction;
        this.InitListener();
        this.create_line_l();
        this.create_line_s(50);

        this.bg =bg;
    }

    InitListener() {
        this.on("MusicBox.Play", () => {
            this.status.playing = true;

            this.y = this.status.opos

            this.setting.tape.pos.y = this.y;
            this.refresh();
        });
        this.on("MusicBox.Stop", () => {
            this.status.playing = false;
        });
        this.on("MusicBox.ToggleDirection", (d) => {
            this.status.direction = d;
            this.refresh();
        });

        this.on("MusicBox.Add.Music", (o) => {
            this.curMusic.AddNote(o.time, o.syllable);
        })
    }

    DragStart() {
        this._drag_start_pos = new Vector2D(this);

        // this.bg._drag_start_pos = this.bg.y;
    }

    DragHandler(sP, curP) {
        this.status.playing = false;

        if (this.status.direction === Symbol.for("vertical")) this.y = this._drag_start_pos.y + curP.y - sP.y;
        else this.x = this._drag_start_pos.x + curP.x - sP.x;

        this.setting.tape.pos.x = this.x;
        this.setting.tape.pos.y = this.y;

        // this.bg.y = this.bg._drag_start_pos + curP.y - sP.y;
    }

    ScrollHandler(detail) {
        this.status.playing = false;

        if (this.status.direction === Symbol.for("vertical")) this.y -= detail;
        else this.x -= detail;

        this.setting.tape.pos.x = this.x;
        this.setting.tape.pos.y = this.y;

        //DEBUG
        if(this.setting.background.isShow)this.bg.y -= detail;
    }

    GetTime(){
        let ct = (this.setting.play_line-(this.status.direction === Symbol.for("vertical")?this.setting.tape.pos.y:this.setting.tape.pos.x))/this.setting.tape.cell_height;
        let c2 = Math.round(ct*10)/10;
        if(Math.abs(ct-c2)<0.05 && c2>=0 && c2*10%5==0) return c2;
        return -1;
    }

    InsertMusic(mso){
        this.curMusic.Load(mso);
    }


    //创建短线（垂直方向时的横线）
    create_line_s(num) {
        let max = this.s.length + num;
        for (let i = this.s.length; i < max; i++) {
            let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, MLC.get_line_s(i, this.setting, this.status)));
            if (i % 2 != 0) ss.dash = [5, 3];
            this.s.push(ss);
            this.add(ss);

            this.create_no(i + 1);
        }

        if (!true) {
            for (let i = 0; i < num - 1; i++) {
                let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `gray 1` }, MLC.get_line_s(i + 0.5, this.setting, this.status)));
                ss.dash = [20, 8];
                this.s.push(ss);
                this.add(ss);
            }
        }
    }

    //创建长线（垂直方向时的竖线）
    create_line_l() {
        for (let i = 0; i < this.setting.pitch_names.length; i++) {
            let ll = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, MLC.get_line_l(i, this.setting, this.status)));
            this.l.push(ll);
            this.add(ll);
        }
    }

    //创建行号
    create_no(index) {
        if (index != 1 && index % 5 != 0) return;
        let fontSize = this.status.NoSize;
        let [x, y] = MLC.get_no_pos(index, fontSize, this.setting, this.status);
        let n = new $tk_font({ text: index, style: '#333399', font: `${fontSize}px serif`, pos: [x, y] });
        this.no.push(n);
        this.add(n);
    }

    update(t, pPos = { x: 0, y: 0 }, angle = 0) {
        if (this.status.playing) {
            if (this.status.direction === Symbol.for("vertical")){ this.setting.tape.pos.y -= this.setting.setting.speed; /*this.bg.y -= this.setting.setting.speed;*/}
            else this.setting.tape.pos.x -= this.setting.setting.speed;
            this.x = this.setting.tape.pos.x;
            this.y = this.setting.tape.pos.y;
        }
        super.update(t, pPos, angle);

        if (this.setting.tape.pos.y * -1 > this.s.length * this.setting.tape.cell_height - this.setting.tape.max_height
            || this.setting.tape.pos.x * -1 > this.s.length * this.setting.tape.cell_height - this.setting.tape.max_width)
            this.create_line_s(50);

        this.update_line_l();
        this.update_points();
    }

    render(ctx) {
        super.render(ctx);

        this.points_pos.forEach(p => {
            this.points.pos.Copy(p);
            this.points.render(ctx);
        })
    }

    refresh() {
        this.update_line_l();
        this.s.forEach((l, index) => {
            let [a, b] = [...MLC.get_line_s(index, this.setting, this.status).points];
            l.points = [new Vector2D(...a), new Vector2D(...b)];
        });

        this.no.forEach((o, index) => {
            o.pos = new Vector2D(...MLC.get_no_pos(index * 5 + 1, this.status.NoSize, this.setting, this.status));
        })
    }

    update_line_l() {
        this.l.forEach((l, index) => {
            let [a, b] = [...MLC.get_line_l(index, this.setting, this.status).points];
            l.points = [new Vector2D(...a), new Vector2D(...b)];
        });
    }

    update_points() {
        this.points_pos.clear();
        this.curMusic.Score.forEach((v,time) =>
            v.forEach((syllable) => {
                let p  = MLC.get_tape_point_to_pos(time, syllable, this.setting, this.status);
                this.points_pos.add(this.Add(p));
            })
        );
    }

}