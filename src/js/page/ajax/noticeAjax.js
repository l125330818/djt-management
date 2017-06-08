/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../../util/pubsub";
export function noticeList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/activity/list.do",
        type:"get",
        dataType:"json",
        data:paramType,
    }).then((data)=>{
        if(data.status == "0000"){
            return data.data;
        }else{
            Pubsub.publish("showMsg",["wrong",data.msg]);
            return data;
        }
    })
}
export function noticeDetail(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/activity/showactivity.do",
        type:"post",
        dataType:"json",
        data:paramType,
    }).then((data)=>{
        if(data.status == "0000"){
            return data.data;
        }else{
            Pubsub.publish("showMsg",["wrong",data.msg]);
            return data;
        }
    })
}