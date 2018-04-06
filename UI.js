//http://ionicons.com/
class UI{
    constructor(){

    }
    Init(mb){
        $("#pp_bt").on("click",(e)=>{
            let sb = $("#pp_ion");
            if(mb.PlayStatus()){
                mb.Stop();
                sb.attr("class","ion-play")
            }else{
                mb.Play();
                sb.attr("class","ion-pause");
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
    }
}