/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../../util/pubsub";
export function orderList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/ordermang/orderlist.do",
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
export function orderDetail(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/ordermang/check.do",
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
export function unRead(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/ordermang/unread.do",
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
export function getOrderNo(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/ordermang/createNo.do",
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
