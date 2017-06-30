/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../../util/pubsub";
export function commodityList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/goodsmang/goodslist.do",
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
export function upCommodityList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/weixin/goodsmang/goodlist.do ",
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
export function brandList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/goodsmang/brandlist.do",
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
export function seriesList(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/goodsmang/seriserlist.do",
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
export function commodityDetail(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/goodsmang/showgoods.do",
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
export function getCompany(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/listbyname.do",
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
export function getWarn(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/warnquery.do",
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
export function setWarn(paramType){
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/warnset.do",
        type:"post",
        dataType:"json",
        data:paramType,
    }).then((data)=>{
        return data;
    })
}