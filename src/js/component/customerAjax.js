/**
 * Created by Administrator on 2017-5-9.
 */
import Pubsub from "../util/pubsub";
export function customerList(paramType){
    let departmentId = paramType || "";
    return $.ajax({
        url:commonUrl+"/djt/web/clientmang/showlist.do",
        type:"get",
        dataType:"json",
        data:{d:JSON.stringify({departmentId}),pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.code = "0000"){
            return data.data;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}