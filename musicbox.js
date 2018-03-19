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
        document.getElementById(domName).appendChild(this._jGE.GetDom());
        this.Turn(Symbol.for("vertical")); //    vertical           horizontal

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
        this.playline = new ShowObj({ x: this.curSetting.tape.pos.x, y: this.curSetting.play_line, obj: [new $tk_path({ styleType: 'stroke', style: `red 4`, points: [[-this.curSetting.pitch_names.length / 2, 0], [this.curSetting.tape.cell_width * this.curSetting.pitch_names.length - this.curSetting.tape.cell_width / 2]] })] })

        this.music_box = new ShowObj();
        this.music_box.add(this.tape);
        this.music_box.add(this.dial);
        this.music_box.add(this.playline);
        this.music_box.index = 10;

        this.drag = new ActionBinder(this, this.curSetting);


        this._jGE.add(this.music_box);
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
        //if (this.tape) this.tape.setting = this.curSetting;
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
            , tape: {         //纸带
                cell_width: 23.6
                , cell_height: 47.3
                , pos: { x: 170, y: 200 } //{x:507,y:91} //{x:91.3,y:508}
                , max_width: window.outerWidth
                , max_height: window.outerHeight
                , point_radius: 8
            }
            , play_line: 100
            , setting: {
                zoom: 1     //缩放
                , direction: undefined //vertical horizontal
                , speed: 2.4
                , backgroundColor: "GhostWhite"
                , lineColor: "#333399"

            }
            , background: {
                packageId: "BgImage"
                , rsid: "SkyCity"
                , url: "res/skycity.jpg"
                , isShow: true
                ,offset:{x:79,y:-310}
            }
        };
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
        console.log(v);
        this._jGE.ResourceManager.LoadResPackage("voice",v);

    }


    //内部通讯的公共方法
    Play() { this._jGE.broadcast("MusicBox.Play"); }
    Stop() { this._jGE.broadcast("MusicBox.Stop"); }
    ToggleDirection() { this._jGE.broadcast("MusicBox.ToggleDirection", this.curSetting.setting.direction); }
}