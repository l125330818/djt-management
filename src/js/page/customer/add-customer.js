/**
 * Created by Administrator on 2017-4-17.
 */
import Layout from "../../component/layout";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import LabelDate from "../../component/label-date";
import "../../library/cityData.js";
import "../../../css/page/customer.scss"
import Pubsub from "../../util/pubsub";
let qqReg = /^\d+$/;
let accountReg = /^[0-9a-zA-Z]*$/g;
let mailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            brandSelect:[{key:"一级代理",value:1},{key:"二级代理",value:2}],
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
                pername:"",
                level:"",
                account:"",
                password:"",
                tel:"",
                email:"",
                weixin:"",
                province:"",
                city:"",
                county:"",
                address:"",
                addetial:"",
                signtime:"",
                remark:"",
            }
        };
        this.provinceChangeFn = this.provinceChangeFn.bind(this);
        this.cityChangeFn = this.cityChangeFn.bind(this);
        this.countyChangeFn = this.countyChangeFn.bind(this);
        this.saveData = this.saveData.bind(this);
        this.brandSelectFn = this.brandSelectFn.bind(this);
      }
    componentDidMount(){
        var proArr =  [{key:"请选择",value:0}];
        var provinceList = cityTool.getProvinceList();
        for(var i=0;i<provinceList.length;i++){
            proArr.push({key:provinceList[i].name,value:provinceList[i].value});
        }
        this.setState({provinceData:proArr});
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
        request.signtime = e;
    }
    saveData(){
        let {request,province,city,county} = this.state;
        if(!this.checkValid()){
            return;
        }
        request.province = province;
        request.city = city;
        request.county = county;
        $.ajax({
            url:commonUrl + "/djt/web/clientmang/addclient.do",
            data:request,
            type:"post",
            dataType:"json",
            success(){

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
        }else if(!request.pername){
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
        }else if(!request.addetial){
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
        }else if(!request.remark){
            msg = "请输入备注";
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
        return(
            <Layout mark = "kh" bread = {["客户管理","新增客户"]}>
                <LabelInput onChange = {this.changeInput.bind(this,"clientname")}
                            require = {true}
                            maxLength = {10}
                            placeholder = "2~10个字符"
                            label = "公司名称："/>
                <LabelInput onChange = {this.changeInput.bind(this,"pername")}
                            require = {true}
                            maxLength = {10}
                            placeholder = "2~10个字符"
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
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.provinceChangeFn}>
                        </RUI.Select>
                        <RUI.Select
                            data={cityData}
                            value={defaultCity}
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.cityChangeFn}>
                        </RUI.Select>
                        {
                            hasCounty&&<RUI.Select
                                data={countyData}
                                value={defaultCounty}
                                className="rui-theme-1 province-select"
                                stuff={false}
                                event={"click"}
                                callback={this.countyChangeFn}>
                            </RUI.Select>
                        }
                    </div>
                </div>
                <LabelInput onChange = {this.changeInput.bind(this,"addetial")}
                            require = {true}
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
                            placeholder = "请输入微信"
                            label = "微信："/>
                <LabelInput onChange = {this.changeInput.bind(this,"email")}
                            placeholder = "请输入邮箱"
                            label = "邮箱："/>
                <LabelDate require = {true}
                           label = "签约时间："
                           onChange = {this.dateChange.bind(this)}/>
                <LabelInput onChange = {this.accountInput.bind(this,"account")}
                            require = {true}
                            reg = {accountReg}
                            value = {request.account}
                            placeholder = "2~20位数字或字母"
                            label = "帐号："/>
                <LabelInput onChange = {this.changeInput.bind(this,"password")}
                            require = {true}
                            type = "password"
                            maxLength = {20}
                            placeholder = "6~20位数字或字母"
                            label = "密码："/>
                <LabelInput onChange = {this.changeInput.bind(this,"password")}
                            require = {true}
                            type = "password"
                            maxLength = {20}
                            placeholder = "6~20位数字或字母"
                            label = "确认密码："/>
                <LabelInput onChange = {this.changeInput.bind(this,"remark")}
                            require = {true}
                            placeholder = "请输入备注"
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