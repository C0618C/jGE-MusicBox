/**
 * 本模块是Debug补丁
 */

//TODO:从内核中分离测试代码

{
    jGE = class jGE_De extends jGE{
        // constructor(...x){
        //     super(...x);
        // }

        Init(cfg){
            //Debug工具
            this.run.debug={
                profile:false,
                showFps:true,
                maxTimeSpan:1,
                fixSpeed:0, //固定延时执行的毫秒数
                showMousePos:true,
                showLoadedProcess:true,            //显示资源加载进度
                msg:[],                                          //用于输出调试信息
                log:m=>run.debug.msg.push(m)
            };

            this.run.iDBug = true;//DEBUG: debug总开关

            super.Init(cfg);
        }

        update(t){
            const run = this.run;
            if(t>run.debug.maxTimeSpan) run.debug.maxTimeSpan = t;

            super.update(t);
        }

        render(){
            super.render();

            const lh = 16;
            let idx = 1;
            const run = this.run;
            run.context2D.font = lh+"px 宋体";
            run.context2D.fillStyle="white";

            //FPS
            if(run.debug.showFps){
                run.context2D.fillText("FPS:" + run.fps, 0, lh*idx++);
                run.context2D.fillText("aFPS:" + Math.round(run.aFps/run.fps_rc_time*100)/100, 0, lh*idx++);                
            }
            
            //鼠标坐标
            if(run.debug.showMousePos){
                run.context2D.fillText(`+Pos:(${run.curMousePoint.x},${run.curMousePoint.y})`, 0, lh*idx++);
            }

            if(run.debug.showLoadedProcess) run.context2D.fillText(`Loading:${this.ResManager.GetProcessing()}%`, 0, lh*idx++);

            run.context2D.fillText(`Ver:${this.version.join(".")}`, 0, lh*idx++);
            run.debug.msg.forEach(m=> run.context2D.fillText(`mgs:${m}`, 0, lh*idx++));
        }

        //测试用
        _debug_show_me_all() {console.log("setting:",this.setting,"\n\nrun:",this.run,"\n\ntemp:",this.temp);return this.run.context2D};
        _debug_show_me_obj(){console.log(this.run.Objects.items)}
    }
}