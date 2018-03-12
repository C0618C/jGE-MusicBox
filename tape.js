class Tape extends ShowObj {
    constructor(setting) {
        super(setting.tape.pos);
        this.status = {
            playing: false
            , direction: null
        };
        this.setting = setting;
        this.index = 10;

        this.s = [];
        this.l = [];
        this.create_line_l();
        this.create_line_s(50);

        this.on = null;
    }

    Init(jGE) {
        this.on = jGE.on;
        this.status.direction = this.setting.setting.direction;
        this.InitListener();
    }

    InitListener() {
        this.on("MusicBox.Play", () => {
            this.status.playing = true;
            this.update_line();
        });
        this.on("MusicBox.Stop", () => {
            this.status.playing = false;
        });
        this.on("MusicBox.ToggleDirection", (d) => {
            this.status.direction = d;
            this.update_line();
        });
    }


    //创建短线（垂直方向时的横线）
    create_line_s(num) {
        let max = this.s.length + num;
        for (let i = this.s.length; i < max; i++) {
            let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_s(i)));
            if (i % 2 != 0) ss.dash = [5, 3];
            this.s.push(ss);
            this.add(ss);

            this.create_no(i + 1);
        }

        if (!true) {
            for (let i = 0; i < num - 1; i++) {
                let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `gray 1` }, this.get_line_s(i + 0.5)));
                ss.dash = [20, 8];
                this.s.push(ss);
                this.add(ss);
            }
        }
    }

    //创建长线（垂直方向时的竖线）
    create_line_l() {
        for (let i = 0; i < this.setting.pitch_names.length; i++) {
            let ll = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_l(i)));
            this.l.push(ll);
            this.add(ll);
        }
    }

    //创建行号
    create_no(index) {
        if (index != 1 && index % 5 != 0) return;
        let fontSize = 30;
        let [x, y] = this.status.direction === Symbol.for("vertical") ? [-fontSize, this.setting.tape.cell_height * (index - 1)] : [0, 0];
        this.add(new $tk_font({ text: index, style: 'orange', font: `${fontSize}px serif`, pos: [x, y] }));
    }

    update(t, pPos = { x: 0, y: 0 }, angle = 0) {
        if (this.status.playing) {
            this.setting.tape.pos.y -= this.setting.setting.speed;
            this.x = this.setting.tape.pos.x;
            this.y = this.setting.tape.pos.y;
        }
        super.update(t, pPos, angle);

        if (this.setting.tape.pos.y * -1 > this.s.length * this.setting.tape.cell_height - this.setting.tape.max_height)
            this.create_line_s(50);
    }

    update_line_l() {
        this.s.forEach((l, index) => {
            let [a, b] = [...this.get_line_s(index).points];
            l.points = [new Vector2D(...a), new Vector2D(...b)];
        });
        this.l.forEach((l, index) => {
            let [a, b] = [...this.get_line_l(index).points];
            l.points = [new Vector2D(...a), new Vector2D(...b)];
        });
    }

    get_line_s(index) {
        return this.status.direction === Symbol.for("vertical") ? {
            points: [
                [0, index * this.setting.tape.cell_height]
                , [this.setting.tape.max_width, index * this.setting.tape.cell_height]
            ]
        } : {
                points: [
                    [index * this.setting.tape.cell_height, 0]
                    , [index * this.setting.tape.cell_height, this.setting.tape.max_height]
                ]
            }
    }

    get_line_l(index) {
        return this.status.direction === Symbol.for("vertical") ? {
            points: [
                [index * this.setting.tape.cell_width, 0]
                , [index * this.setting.tape.cell_width, this.setting.tape.max_height - this.y]
            ]
        } : {
                points: [
                    [0, index * this.setting.tape.cell_width]
                    , [this.setting.tape.max_width, this.setting.tape.cell_width * index]
                ]
            }
    }




    // render(ctx){
    //     super.render(ctx);
    //     console.log("2");
    // }
}