class Tape extends ShowObj {
    constructor(setting) {
        super(setting.tape.pos);
        this.setting = setting;
        this.index = 10;

        this.s = [];
        this.l = [];

        this.create_line_l();
        this.create_line_s(50);
    }

    create_line_s(num) {
        let max = this.s.length + num;
        for (let i = this.s.length; i < max; i++) {
            let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_s(i)));
            if (i % 2 != 0) ss.dash = [5, 3];
            this.s.push(ss);
            this.add(ss);
        }

        if(!true){
            for (let i = 0; i < num - 1; i++) {
                let ss = new $tk_path(Object.assign({ styleType: 'stroke', style: `gray 1` }, this.get_line_s(i+0.5)));
                ss.dash = [20, 8];
                this.s.push(ss);
                this.add(ss);
            }
        }

        console.info("create short !")
    }

    create_line_l() {
        for (let i = 0; i < this.setting.pitch_names.length; i++) {
            let ll = new $tk_path(Object.assign({ styleType: 'stroke', style: `${this.setting.setting.lineColor} 3` }, this.get_line_l(i)));
            this.l.push(ll);
            this.add(ll);
        }
    }

    update(t, pPos = { x: 0, y: 0 }, angle = 0) {
        this.setting.tape.pos.y -= this.setting.setting.speed;
        this.x = this.setting.tape.pos.x;
        this.y = this.setting.tape.pos.y;
        super.update(t, pPos, angle);

        // this.s.forEach((l,index)=>{
        //     let [a,b] =[...this.get_line_s(index).points];
        //     l.points =[new Vector2D(...a),new Vector2D(...b)];
        // });

        this.l.forEach((l,index)=>{
            let [a,b] =[...this.get_line_l(index).points];
            l.points =[new Vector2D(...a),new Vector2D(...b)];
        });

        if(this.setting.tape.pos.y * -1 > this.s.length * this.setting.tape.cell_height - this.setting.tape.max_height)
            this.create_line_s(50);
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
                , [index * this.setting.tape.cell_width, this.setting.tape.max_height-this.y]
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