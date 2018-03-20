//动作助手
class ActionBinder{
    constructor(mb,setting){
        this.tapeListener  = this._init_tape_drag_listener(mb,setting);
        this._init_tape_click_listener(mb,setting,this.tapeListener);
        mb._jGE.add(this.tapeListener);

    }


    _init_tape_drag_listener(mb,setting){
        let w = setting.tape.cell_width*(setting.pitch_names.length+5)
        let h = setting.tape.max_height;
        let pu = new $tk_path({styleType:'stroke',style:"red 1" ,points:[[0,0],[w,0],[w,h],[0,h],-1],pos:[-setting.tape.cell_width*2.5,0]});
        
        let k  = new Key({code:"tapeAction",upObjs:[pu]});
        DragHelper.InitDrag(k,{
            startCallback:mb.tape.DragStart.bind(mb.tape)
            ,moveCallback:mb.tape.DragHandler.bind(mb.tape)
            ,scrollCallback:mb.tape.ScrollHandler.bind(mb.tape)
        })
        let kb = new Keyboard(mb._jGE);
        kb.SetPos({x:setting.tape.pos.x,y:0});
        kb.add(k);
        return kb;
    }

    _init_tape_click_listener(mb,setting,tapeListener){
        tapeListener.get("tapeAction").addEventListener("keyup",(x)=>{
            let p = MLC.get_tape_point_from_pos(x.x,x.y,setting,mb.tape);
            if(p == null) return;
            if(p.time<0 || p.syllable<0 || p.syllable >=30) return;
            mb._jGE.broadcast("MusicBox.Add.Music",p);
        });

    }


}