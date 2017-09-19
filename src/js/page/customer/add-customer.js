/**
 * Created by Administrator on 2017-4-17.
 */
import Layout from "../../component/layout";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import LabelDate from "../../component/label-date";
import "../../library/cityData.js";
import "../../../css/page/customer.scss";
import {customerDetail} from "../ajax/customerAjax";
import Pubsub from "../../util/pubsub";
import moment from 'moment';
import {hashHistory} from "react-router";
let qqReg = /^\d+$/;
let accountReg = /^[0-9a-zA-Z]+$/g;
let mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            brandSelect:[{key:"一级代理",value:1},{key:"二级代理",value:2},{key:"三级代理",value:3}],
            provinceData:[],
            cityData:[],
            countyData:[],
            defaultProvince:{key:"请选择",value:0},
            defaultCity:{key:"请选择",value:0},
            defaultCounty:{key:"请选择",value:0},
            defaultBrand:{key:"请选择",value:""},
            province:"",
            city:"",
            county:"",
            hasCounty:false,
            request:{
                userid:localStorage.userid || "",
                clientname:"",
                name:"",
                level:"",
                account:"",
                password:"",
                tel:"",
                email:"",
                weixin:"",
                addtail:"",
                singtime:moment(new Date()).format("YYYY-MM-DD"),
                remark:"",
            }
        };
        this.provinceChangeFn = this.provinceChangeFn.bind(this);
        this.cityChangeFn = this.cityChangeFn.bind(this);
        this.countyChangeFn = this.countyChangeFn.bind(this);
        this.saveData = this.saveData.bind(this);
        this.brandSelectFn = this.brandSelectFn.bind(this);
        this.clientId = this.props.location.query.clientId;
      }
    componentDidMount(){
        var proArr =  [{key:"请选择",value:0}];
        var provinceList = cityTool.getProvinceList();
        for(var i=0;i<provinceList.length;i++){
            proArr.push({key:provinceList[i].name,value:provinceList[i].value});
        }
        this.setState({provinceData:proArr});
        if(this.clientId){
            this.getDetail();
        }
    }
    getDetail(){
        let clientId = this.clientId;
        customerDetail({clientId,companyName:localStorage.companyName}).then((data)=>{
            let ClientInfo = data.ClientInfo;
            let level = this.getLevel(ClientInfo.level);
            this.setState({
                request:ClientInfo,
                defaultProvince:{key:ClientInfo.sheng,value:ClientInfo.sheng},
                defaultCity:{key:ClientInfo.shi,value:ClientInfo.shi},
                defaultCounty:{key:ClientInfo.qu,value:ClientInfo.qu},
                defaultBrand:{key:level,value:ClientInfo.level},
                hasCounty:ClientInfo.qu?true:false,
                province:ClientInfo.sheng,
                city:ClientInfo.shi,
                county:ClientInfo.qu,
            })
        })
    }
    getLevel(type){
        switch(type * 1){
            case 1 :
                return "一级代理";
            case 2 :
                return "二级代理";
            case 3 :
                return "三级代理";
            case 4 :
                return "四级代理";
            case 5 :
                return "五级代理";
            default:
                return "";
        }
    }
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
    }
    accountInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({});
    }
    brandSelectFn(e){
        let {request} = this.state;
        request.level = e.value;
        this.setState({defaultBrand:e});
    }
    provinceChangeFn(e){
        var value = e.value;
        var cityArr = [{key:"请选择",value:0}];
        var cityList = cityTool.getCityList(value);
        if(value==0){
            this.setState({cityData:cityArr,countyData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }else{
            for(var i = 0 ; i<cityList.length;i++){
                cityArr.push({key:cityList[i].name,value:cityList[i].value});
            }
            this.setState({cityData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }
        this.setState({province:value});

    }
    cityChangeFn(e){
        var value = e.value;
        var province = this.state.province;
        var countyArr = [{key:"请选择",value:0}];
        if(value==0){
            this.setState({countyData:countyArr,defaultCounty:{key:"请选择",value:0},defaultCity:{key:"请选择",value:0}});
        }else{
            var countList = cityTool.getCountyList(province,value);
            if(countList.length){
                for(var i = 0; i<countList.length;i++){
                    countyArr.push({key:countList[i].name,value:countList[i].value});
                }
                this.setState({hasCounty:true,countyData:countyArr,defaultCity:{key:e.key,value:e.value},defaultCounty:{key:"请选择",value:0}});
            }else{
                this.setState({hasCounty:false,countyData:countyArr,defaultCity:{key:e.key,value:e.value},defaultCounty:{key:"请选择",value:0}});
            }

        }
        this.setState({city:value});
    }
    countyChangeFn(e){
        var value = e.value;
        this.setState({county:value,defaultCounty:{key:e.key,value:e.value}});
    }
    dateChange(e){
        let {request} = this.state;
        request.singtime = e;
        this.setState({request});
    }
    saveData(){
        let {request,province,city,county} = this.state;
        if(!this.checkValid()){
            return;
        }
        let _this = this;
        request.sheng = province;
        request.shi = city;
        request.qu = county;
        let url = "/djt/web/clientmang/addclient.do";
        if(this.clientId){
            url = "/djt/web/clientmang/update.do";
            request.clientId = this.clientId;
        }
        $.ajax({
            url:commonUrl + url,
            data:request,
            type:"post",
            dataType:"json",
            success(data){
                if(data.status == "0000"){
                    setTimeout(()=>{
                        hashHistory.push("customerList");
                    },1000);
                    Pubsub.publish("showMsg",["success",_this.clientId?"修改成功":"新增成功"]);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });

        console.log(request)
    }
    checkValid(){

        let {request,province,defaultCity,defaultCounty,hasCounty} = this.state;
        let flag = true;
        let msg = "";
        if(!request.clientname){
            msg = "请输入公司名称";
            flag = false;
        }else if(!request.name){
            msg = "请输入姓名";
            flag = false;
        }else if(!request.level){
            msg = "请选择代理等级";
            flag = false;
        }else if(!province){
            msg = "请选择省级";
            flag = false;
        }else if(!defaultCity.value){
            msg = "请选择市区";
            flag = false;
        }else if(hasCounty && !defaultCounty.value){
            msg = "请选择县级";
            flag = false;
        }else if(!request.addetail){
            msg = "请输入街道地址";
            flag = false;
        }else if(!request.tel){
            msg = "请输入联系方式";
            flag = false;
        }else if(!request.account){
            msg = "请输入帐号";
            flag = false;
        }else if(!request.password){
            msg = "请输入密码";
            flag = false;
        }else if((request.password != request.newPassword && !this.clientId)){
            msg = "2次输入密码不相同，请重新输入";
            flag = false;
        }else{
            msg = "";
            flag = true;
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
        }
        return flag;
    }
    render(){
        let {brandSelect,request,provinceData,defaultProvince,cityData,defaultCity,countyData,defaultCounty,hasCounty,defaultBrand} = this.state;
        let clientId =this.clientId;
        return(
            <Layout mark = "kh" bread = {["客户管理","新增客户"]}>
                <LabelInput onChange = {this.changeInput.bind(this,"clientname")}
                            require = {true}
                            value = {request.clientname}
                            disable = {!!clientId}
                            placeholder = "公司名称"
                            label = "公司名称："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            value = {request.name}
                            placeholder = "姓名"
                            label = "姓名："/>

                <LabelSelect require = {true}
                             label = "代理级别："
                             className = "w-168"
                             data = {brandSelect}
                             callback = {this.brandSelectFn}
                             default = {defaultBrand}/>

                <div className="clearfix m-t-10">
                    <label className="left-label left"> <span className="require">*</span> 地址：</label>
                    <div>
                        <RUI.Select
                            data={provinceData}
                            value={defaultProvince}
                            disable = {!!clientId}
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.provinceChangeFn}>
                        </RUI.Select>
                        <RUI.Select
                            data={cityData}
                            value={defaultCity}
                            disable = {!!clientId}
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.cityChangeFn}>
                        </RUI.Select>
                        {
                            hasCounty&&<RUI.Select
                                data={countyData}
                                value={defaultCounty}
                                disable = {!!clientId}
                                className="rui-theme-1 province-select"
                                stuff={false}
                                event={"click"}
                                callback={this.countyChangeFn}>
                            </RUI.Select>
                        }
                    </div>
                </div>
                <LabelInput onChange = {this.changeInput.bind(this,"addetail")}
                            require = {true}
                            value = {request.addetail}
                            disable = {!!clientId}
                            placeholder = "请输入街道地址"
                            label = "街道地址："/>
                <LabelInput onChange = {this.accountInput.bind(this,"tel")}
                            value = {request.tel}
                            reg = {qqReg}
                            maxLength = {11}
                            placeholder = "请输入联系方式"
                            require = {true}
                            label = "联系方式："/>
                <LabelInput onChange = {this.accountInput.bind(this,"qq")}
                            value = {request.qq}
                            reg = {qqReg}
                            placeholder = "请输入QQ"
                            maxLength = {11}
                            label = "QQ："/>
                <LabelInput onChange = {this.changeInput.bind(this,"weixin")}
                            value = {request.weixin}
                            placeholder = "请输入微信"
                            label = "微信："/>
                <LabelInput onChange = {this.changeInput.bind(this,"email")}
                            placeholder = "请输入邮箱"
                            value = {request.email}
                            label = "邮箱："/>
                <LabelDate require = {true}
                           label = "签约时间："
                           disabled = {!!clientId}
                           value = {request.singtime}
                           defaultValue = {request.singtime}
                           onChange = {this.dateChange.bind(this)}/>
                <LabelInput onChange = {this.changeInput.bind(this,"account")}
                            require = {true}
                            value = {request.account}
                            disable = {!!clientId}
                            placeholder = "2~20位数字或字母"
                            label = "帐号："/>
                {
                    !clientId &&
                    <LabelInput onChange = {this.changeInput.bind(this,"password")}
                                require = {true}
                                type = "password"
                                maxLength = {20}
                                placeholder = "6~20位数字或字母"
                                label = "密码："/>
                }

                {
                    !clientId &&
                    <LabelInput onChange = {this.changeInput.bind(this,"newPassword")}
                                require = {true}
                                type = "password"
                                maxLength = {20}
                                placeholder = "6~20位数字或字母"
                                label = "确认密码："/>
                }
                <LabelInput onChange = {this.changeInput.bind(this,"remark")}
                            placeholder = "请输入备注"
                            value = {request.remark}
                            label = "备注："/>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>保存</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}