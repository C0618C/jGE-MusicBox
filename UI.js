//http://ionicons.com/
class UI{
    constructor(){

    }
    Init(mb){
        mb._jGE.InitMessage(this);
        $("#pp_bt").on("click",(e)=>{
            if(mb.PlayStatus()){
                mb.Stop();
            }else{
                mb.Play();
            }
        });
        $("#dir_bt").on("click",(e)=>{
            BtSymboToggle($("#dir_ion"),"ion-android-phone-portrait","ion-android-phone-landscape",()=>mb.Turn(Symbol.for("horizontal")),()=>mb.Turn(Symbol.for("vertical")));
        });

        let sb = $("#pp_ion");        
        this.on("MusicBox.Play",()=>{
            sb.attr("class","ion-pause");            
        });
        this.on("MusicBox.Stop",()=>{
            sb.attr("class","ion-play");
        });

        $("#loop_bt").on("click",function (e){
            let bt = $(this);
            if(bt.hasClass("btn-light")){
                
            }else{
                
            }

            bt.toggleClass("btn-light").toggleClass("btn-secondary");
        });
    }

    BtSymboToggle(obj,true_smb,false_smb,true_fun,false_fun){
        if(obj.hasClass(true_smb)){
            true_fun();
            obj.attr("class",false_smb);
        }else{
            false_fun();
            obj.attr("class",true_smb);
        }  
    }
}