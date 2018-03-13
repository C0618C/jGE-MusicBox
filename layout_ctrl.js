class MusicBox_Layout_Control{
    constructor(){

    }

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

    static get_no_pos(index, fontSize,setting,status) {
        return status.direction === Symbol.for("vertical")
            ? [-fontSize, setting.tape.cell_height * (index - 1)]
            : [setting.tape.cell_height * (index - 1), setting.tape.cell_width*setting.pitch_names.length ];
    }

}

const MLC = MusicBox_Layout_Control;