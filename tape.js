class Tape extends ShowObj {
    constructor(setting) {
        super(setting.tape.pos);
        this.setting = setting;
        this.index = 10;

        this.s = new Set();
        this.l = new Set();

        this.create_line_l();
        this.create_line_s();
    }

    create_line_s() {
        for (let i = 0; i < this.setting.pitch_names.length; i++) {
            let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_s(i)));
            if (i % 2 != 0) ss.dash = [5, 3];
            this.s.add(ss);
            this.add(ss);
        }

        if(!true){
            for (let i = 0; i < this.setting.pitch_names.length; i++) {
                let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `gray 1` }, this.get_line_s(i+0.5)));
                ss.dash = [20, 8];
                this.s.add(ss);
                this.add(ss);
            }
        }
    }

    create_line_l() {
        for (let i = 0; i < this.setting.pitch_names.length; i++) {
            let ll = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_l(i)));
            this.l.add(ll);
            this.add(ll);
        }
    }

    update(t, pPos = { x: 0, y: 0 }, angle = 0) {
        super.update(t, pPos, angle);
    }

    get_line_s(index) {
        return this.setting.setting.direction === Symbol.for("vertical") ? {
            points: [
                [0, index * this.setting.tape.cell_height]
                , [this.setting.tape.max_width, index * this.setting.tape.cell_height]
            ]
        } : {
            points: [
                [ index * this.setting.tape.cell_height,0]
                , [index * this.setting.tape.cell_height,this.setting.tape.max_height]
            ]
        }
    }

    get_line_l(index) {
        return this.setting.setting.direction === Symbol.for("vertical") ? {
            points: [
                [index * this.setting.tape.cell_width, 0]
                , [index * this.setting.tape.cell_width, this.setting.tape.max_height]
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