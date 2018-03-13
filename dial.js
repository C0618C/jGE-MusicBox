class Dial extends ShowObj{
    constructor(setting){
        super();
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;
        this.add(new $tk_arc({
            style:"green 5"
            ,radius:tape_width/3
            ,startAngle:π*7/6,endAngle:π-1/6
            ,cenPoin:[setting.tape.pos.x+300,setting.tape.pos.y]
        }));
    }
}