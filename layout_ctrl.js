class MusicBox_Layout_Control{
    constructor(){

    }

    //音乐带中的短线
    static get_line_s(index,setting,status) {
        return status.direction === Symbol.for("vertical") ? {
            points: [
                [0, index * setting.tape.cell_height]
                , [setting.tape.max_width, index * setting.tape.cell_height]
            ]
        } : {
            points: [
                [index * setting.tape.cell_height, 0]
                , [index * setting.tape.cell_height, setting.tape.max_height]
            ]
        }
    }

    //音乐带中的长线
    static get_line_l(index,setting,status) {
        return status.direction === Symbol.for("vertical") ? {
            points: [
                [index * setting.tape.cell_width, 0]
                , [index * setting.tape.cell_width, setting.tape.max_height - setting.tape.pos.y]
            ]
        } : {
            points: [
                [0, index * setting.tape.cell_width]
                , [setting.tape.max_width-setting.tape.pos.x, setting.tape.cell_width * index]
            ]
        }
    }

    //音乐带前行号
    static get_no_pos(index, fontSize,setting,status) {
        return status.direction === Symbol.for("vertical")
            ? [-fontSize, setting.tape.cell_height * (index - 1)]
            : [setting.tape.cell_height * (index - 1), setting.tape.cell_width*setting.pitch_names.length ];
    }

    //音符标记-打的圆点-
    static get_tape_point_to_pos(time,syllable,setting,status){
        return status.direction === Symbol.for("vertical")
        ?{x:syllable*setting.tape.cell_width,y:time*setting.tape.cell_height}
        :{x:0,y:0}
    }
    
    //判断点击位置是否能放置点
    static get_tape_point_from_pos(x,y,setting,pos){
        let w = setting.tape.cell_width;
        let h = setting.tape.cell_height/2;
        let r  = setting.tape.point_radius
        
        let [a,b] = setting.setting.direction === Symbol.for("vertical")?[x-pos.x,y-pos.y]:[y-pos.y,x-pos.x];

        let x1 = Math.floor(a/w)*w;
        let x2 = x1 + w;
        let y1 = Math.floor(b/h)*h;
        let y2 = y1 + h;

        let N = (new Vector2D(x1,y1)).MinusIn({x:a,y:b}).LengthSq();
        let E = (new Vector2D(x2,y1)).MinusIn({x:a,y:b}).LengthSq();
        let S = (new Vector2D(x1,y2)).MinusIn({x:a,y:b}).LengthSq();
        let W = (new Vector2D(x2,y2)).MinusIn({x:a,y:b}).LengthSq();

        let rsl = null;
        switch(Math.min(N,E,S,W)){
            case N:rsl=[x1,y1,N];break;
            case E:rsl=[x2,y1,E];break;
            case S:rsl=[x1,y2,S];break;
            case W:rsl=[x2,y2,W];break;
        }

        if(rsl[2] > r*r) return null;

        return {time:Math.round(rsl[1]/h)/2,syllable:rsl[0]/w};
    }

    //获得谱可拖动的范围
    static get_tape_drag_area(setting){
        return setting.setting.direction === Symbol.for("vertical")
        ?[setting.tape.cell_width*(setting.pitch_names.length+5),setting.tape.max_height]
        :[setting.tape.max_width,setting.tape.cell_width*(setting.pitch_names.length+5)]
    }
    //获得谱可拖动的对象的定位
    static get_tape_drag_pos(setting){
        return setting.setting.direction === Symbol.for("vertical")
        ?[-setting.tape.cell_width*2.5,0]
        :[-setting.tape.pos.x,setting.tape.pos.y-setting.tape.cell_width*2.5]
    }

    //唱名表盘整体位置
    static get_dial_pos(setting){
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;
        return setting.setting.direction === Symbol.for("vertical")
        ?{x:setting.tape.pos.x + tape_width / 2 - setting.tape.cell_width / 2, y:setting.tape.pos.y / 2 - 50}
        :{y:setting.tape.pos.y + tape_width / 2 - setting.tape.cell_width / 2, x:setting.tape.pos.x / 2 + 250}
    }

    //唱名表盘，底盘
    static get_dial_ract(setting,px=0){
        let w = setting.tape.cell_width*setting.pitch_names.length/2+setting.tape.cell_width/3;
        let h = setting.tape.cell_height/3;
        return setting.setting.direction === Symbol.for("vertical")
        ? {points: [[-w,px-h],[w,px-h],[w,h+px],[-w,h+px],-1]}
        : {points: [[px-h,-w],[px-h,w],[px+h,w],[px+h,-w],-1]};
    }

    //表盘上音调显示
    static get_dial_pitch_name(setting,i){
        let tape_width = setting.tape.cell_width * setting.pitch_names.length;
        return setting.setting.direction === Symbol.for("vertical")
        ?{x:setting.tape.cell_width*i-tape_width/2+setting.tape.cell_width/2, y:5}
        :{x:5, y:setting.tape.cell_width*(setting.pitch_names.length - i-1)-tape_width/2+setting.tape.cell_width/2};
    }

    //播放进度红线
    static get_play_line_pos(setting){
        return setting.setting.direction === Symbol.for("vertical")
        ?{x: setting.tape.pos.x, y: setting.play_line}
        :{y: setting.tape.pos.x, x: setting.play_line}
    }

}

const MLC = MusicBox_Layout_Control;