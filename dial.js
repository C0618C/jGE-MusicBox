class Dial extends ShowObj{
    constructor(setting){
        super();
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;

        let cp=[setting.tape.pos.x+tape_width/2-setting.tape.cell_width/2,setting.tape.pos.y+1200+tape_width/2];
        let [arcS,arcE] =[π*5/4,π*7/4]

        this.add(new $tk_arc({
            style:"red 5"
            ,radius:tape_width,anticlockwise:false
            ,cenPoin:cp
            ,startAngle:arcS,endAngle:arcE
        }));
        this.add(new $tk_arc({
            style:"red 5"
            ,radius:tape_width*3/4,anticlockwise:false
            ,cenPoin:cp
            ,startAngle:arcS,endAngle:arcE
        }));

        this.add(new $tk_arc({
            style:"red 5"
            ,radius:5,anticlockwise:false
            ,cenPoin:cp
            ,startAngle:0,endAngle:π2
        }));
    }
}