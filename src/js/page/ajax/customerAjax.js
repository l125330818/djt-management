/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../../util/pubsub";
export function customerList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/showlist.do",
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
export function customerDetail(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/details.do",
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
export function reset(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/resetpwd.do",
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
export function payrecord(paramType){
    return $.ajax({
        url:commonUrl+"/web/clientmang/payrecord.do",
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
export function rechargeList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/log/rechargelist.do",
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
export function storageList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/log/addleftlist.do",
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
export function recvList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/address/recvlist.do",
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