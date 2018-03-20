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
                , defMusic:`{"0":[24],"1":[26],"2":[27,12],"3":[19],"4":[24],"5":[26],"6":[27],"8":[29],"10":[26,10],"11":[19],"12":[22],"17":[19],"18":[24,8],"19":[15],"20":[20],"21":[22],"22":[24],"24":[27],"26":[22,7],"27":[15],"28":[19],"30":[22],"32":[19],"34":[20,6],"35":[12],"36":[17],"37":[19],"38":[20],"40":[27],"42":[19,3],"43":[7],"44":[12],"45":[14],"46":[15],"47":[27],"49":[27],"50":[26,4],"51":[9],"52":[14],"53":[21],"54":[9],"56":[18,26],"58":[26,4],"59":[7],"60":[12],"61":[14],"62":[7,11],"64":[24],"65":[26],"66":[27,3],"67":[7],"68":[12],"69":[14,26],"70":[15,27],"71":[19],"72":[29],"73":[24],"74":[26,7],"75":[14],"76":[21],"77":[22],"78":[26],"79":[19],"81":[19],"82":[24,3],"83":[8],"84":[12],"85":[15,22],"86":[24],"87":[15],"88":[27],"89":[8],"90":[22,19,5],"91":[10],"92":[17],"93":[22],"94":[5,19],"95":[0],"96":[20],"97":[19],"98":[20,1],"99":[6],"100":[8],"101":[12,19],"102":[20],"103":[17],"104":[27],"106":[28,3],"107":[7],"108":[24,28],"109":[29,26],"110":[27,15],"111":[19],"112":[24],"113":[12],"114":[27,20],"115":[26],"116":[24,17],"117":[12],"118":[7,17,26],"119":[14],"120":[22,17],"122":[24,3],"123":[7],"124":[14],"125":[15],"126":[19],"8.5":[],"21.5":[],"81.5":[15],"114.5":[6],"139.5":[]}`
            }
            , play_line: 100
            , setting: {
                zoom: 1     //缩放
                , direction: undefined //vertical horizontal
                , speed: 3
                , backgroundColor: "GhostWhite"
                , lineColor: "#333399"

            }
            , background: {
                packageId: "BgImage"
                , rsid: "SkyCity"
                , url: "res/skycity.jpg"
                , isShow: false
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
        this._jGE.ResourceManager.LoadResPackage("voice",v);



    }


    //内部通讯的公共方法
    Play() { this._jGE.broadcast("MusicBox.Play"); }
    Stop() { this._jGE.broadcast("MusicBox.Stop"); }
    ToggleDirection() { this._jGE.broadcast("MusicBox.ToggleDirection", this.curSetting.setting.direction); }
}