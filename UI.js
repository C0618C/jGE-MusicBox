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
            let sb = $("#dir_ion");
            if(sb.hasClass("ion-android-phone-portrait")){
                mb.Turn(Symbol.for("vertical"));
                sb.attr("class","ion-android-phone-landscape")
            }else{
                mb.Turn(Symbol.for("horizontal"));
                sb.attr("class","ion-android-phone-portrait");
            }
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

    BtSymboToggle(obj,true_smb,false_smb){
        
    }
}