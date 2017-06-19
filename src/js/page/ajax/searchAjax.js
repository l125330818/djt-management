/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../../util/pubsub";
export function balanceList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/query/balance.do",
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
export function goodsList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/query/goods.do",
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
