class MusicBox {
    constructor(domName) {
        this.curSetting = this.GetSetting();
        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

        this.tape = null;
        this.dial = null;
        this.music_box = null;
        this._jGE.InitMessage(this);
        document.getElementById(domName).appendChild(this._jGE.GetDom());
        let dir = this._jGE.GetArea();
        this.Turn(Symbol.for(dir.width>dir.height?"horizontal":"vertical")); //    vertical           horizontal

        this.LoadResourcePack();
        this._jGE.one("jGE.Scene.Logo.End", () => this.StartUp());
    }

    StartUp() {
        let bg = this.ShowBG();

        this._jGE.backgroundColor = this.curSetting.setting.backgroundColor;

        this.tape = new Tape(this.curSetting);
        this._jGE.InitMessage(this.tape);
        this.tape.Init(bg);

        this.core = new Core(this._jGE, this.curSetting);
        this.core.Init(this.tape);
        this.dial = new Dial(this.curSetting);
        this._jGE.InitMessage(this.dial);
        this.dial.Init();
        //进度红线
        this.playline = new ShowObj({ ...MLC.get_play_line_pos(this.curSetting), obj: [new $tk_path({ styleType: 'stroke', style: `red 4`, points: MLC.get_play_line_points(this.curSetting) })] })

        this.music_box = new ShowObj();
        this.music_box.add(this.tape);
        this.music_box.add(this.dial);
        this.music_box.add(this.playline);
        this.music_box.index = 10;

        this.drag = new ActionBinder(this, this.curSetting);

        //this.SetMusic(this.curSetting.tape.defMusic);

        this._jGE.add(this.music_box);

        this.broadcast("MusicBox.Init");
    }

    ShowBG() {
        if (!this.curSetting.background.isShow) return;

        let img = this._jGE.ResourceManager.GetRes(this.curSetting.background.rsid, this.curSetting.background.packageId);
        if (img.height * img.width == 0) {
            this.ShowBG();
            console.warn("资源读取出错，重新加载：", packageId, rsid);
            return;
        }

        let i1 = new $tk_sprite({ img: img });
        let pos = { x: img.width / 2+this.curSetting.background.offset.x, y: img.height / 2 +this.curSetting.background.offset.y};
        if (this.curSetting.setting.direction !== Symbol.for("vertical")) {
            i1.angle = -π_hf;
            i1.centerPoint = new Vector2D(img.width, 0);
            pos = { x: img.height / 2, y: img.width / 2 };
        }
        let s1 = new ShowObj(pos);
        i1.alpha = 0.6;
        s1.index = 0;
        s1.add(i1);
        this._jGE.add(s1);

        return s1;
    }

    Turn(direction) {
        if (direction === this.curSetting.setting.direction) return;
        this.curSetting.setting.direction = direction;
        if (direction === Symbol.for("vertical")) {
            Object.assign(this.curSetting.tape, {
                //pos: { x: 91.3, y: 508 } //{x:507,y:91} //{x:91.3,y:508}
                max_width: (this.curSetting.pitch_names.length - 1) * this.curSetting.tape.cell_width
                , max_height: this._jGE.GetArea().height
            });
        } else {
            Object.assign(this.curSetting.tape, {
                //pos: { x: 507, y: 91 } //{x:91.3,y:508}
                max_width: this._jGE.GetArea().width
                , max_height: (this.curSetting.pitch_names.length - 1) * this.curSetting.tape.cell_width
            });
        }
        [this.curSetting.tape.pos.x,this.curSetting.tape.pos.y]=[this.curSetting.tape.pos.y,this.curSetting.tape.pos.x];
        this.ToggleDirection();
    }

    GetSetting() {
        return {
            pitch_names: [ //音名
                "C", "D", "G", "A", "B"
                , "C1", "D1", "E1", "F1", "#F1", "G1", "#G1", "A1", "#A1", "B1"
                , "C2", "#C2", "D2", "#D2", "E2", "F2", "#F2", "G2", "#G2", "A2", "#A2", "B2"
                , "C3", "D3", "E3"
            ]
            ,short_names:[
                "1.", "2.", "5.", "6.", "7."
                , "1", "2", "3", "4", "#4", "5", "#5", "6", "#6", "7"
                , ".1", "#.1", ".2", "#.2", ".3", ".4", "#.4", ".5", "#.5", ".6", "#.6", ".7"
                , "..1", "..2", "..3"
            ]
            , tape: {         //纸带
                cell_width: 23.6
                , cell_height: 47.3
                , pos: { x: 170, y: 350 } //{x:507,y:91} //{x:91.3,y:508}
                , max_width: window.outerWidth
                , max_height: window.outerHeight
                , point_radius: 8
                , defMusic:"skycity"
            }
            , play_line: 250
            , setting: {
                zoom: 1     //缩放
                , direction: undefined //vertical horizontal
                , speed: 3
                , backgroundColor: "GhostWhite"
                , lineColor: "#333399"

            }
            , background: {
                packageId: "BgImage"
                , rsid: "HappyBirthday"
                , url: "res/《潘多拉之心》.jpg"
                , isShow: false
                ,offset:{x:79,y:-310}
            }
            ,music_score:["skycity","happybirthday","grandfathersclock","always_with_you","kanong","MARIAGE_D'AMOUR","Merry_Christmas","liangzu","little_star"]
        };
    }

    GetMusic(name){
        return this._jGE.ResourceManager.GetRes(name, "musicscore");
    }

    SetMusic(name){
        this.tape.InsertMusic(this.GetMusic(name));
    }

    Clean(){
        this.tape.curMusic=new Music();
    }

    LoadResourcePack() {
        //加载背景资源
        if (this.curSetting.background.url) this._jGE.ResourceManager.LoadResPackage(this.curSetting.background.packageId, [{
            id: this.curSetting.background.rsid
            , url: this.curSetting.background.url
            , type: "image",method:"GET"
        }]);

        //加载声音资源
        let v = [];
        this.curSetting.pitch_names.forEach(s=>{
            v.push({id:s,url:`res/${s.replace("#","_")}.mp3`,type:"audio",method:"GET"});
        });
        this._jGE.ResourceManager.LoadResPackage("voice",v);

        //加载曲谱
        let m = [];
        this.curSetting.music_score.forEach(s=>{
            m.push({id:s,url:`MusicScore/${s}.cfg`,type:"json",method:"GET"});
        });
        this._jGE.ResourceManager.LoadResPackage("musicscore",m);

    }


    //内部通讯的公共方法
    Play() { this._jGE.broadcast("MusicBox.Play"); }
    Stop() { this._jGE.broadcast("MusicBox.Stop"); }
    ToggleDirection() { this._jGE.broadcast("MusicBox.ToggleDirection", this.curSetting.setting.direction); }
}