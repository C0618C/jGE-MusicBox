//拖拽控制助手
class DragListener{
    constructor(mb,setting){
        //this.
        this.tapeListener  = this._init_tape_drag_listener(mb,setting);

        mb._jGE.add(this.tapeListener);
    }


    _init_tape_drag_listener(mb,setting){
        let w = setting.tape.cell_width*(setting.pitch_names.length-1)
        let h = setting.tape.max_height;
        let pu = new $tk_path({styleType:'stroke',style:"red 3" ,points:[[0,0],[w,0],[w,h],[0,h],-1],pos:[0,0]});
        
        let k  = new Key({code:"tapeDrager",upObjs:[pu]});
        DragHelper.InitDrag(k,{
            startCallback:mb.tape.DragStart.bind(mb.tape)
            ,moveCallback:mb.tape.DragHandler.bind(mb.tape)
            ,endCallback:(e)=>console.log("end",e)
        })
        let kb = new Keyboard(mb._jGE);
        kb.SetPos(setting.tape.pos);
        kb.add(k);
        return kb;
    }


}