/**
 * Created by luojie on 2017/7/1.
 * 收货地址
 */
import Layout from "../../component/layout";
import "../../library/cityData.js";
import "../../../css/page/order.scss";
import "../../../css/page/customer.scss";
import {hashHistory} from "react-router";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import Pubsub from "../../util/pubsub";
import {recvList} from "../ajax/customerAjax";
export default class List extends React.Component{
    constructor(props){
        super(props);
        this.state = {
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
                tel:"",
                recvname:"",
                sheng:"",
                shi:"",
                qu:"",
                adressdetail:"",
            },
            list:[],
            id:""
        }
        this.clientId = this.props.location.query.clientId;
        this.addAddress = this.addAddress.bind(this);
        this.provinceChangeFn = this.provinceChangeFn.bind(this);
        this.cityChangeFn = this.cityChangeFn.bind(this);
        this.countyChangeFn = this.countyChangeFn.bind(this);
        this.DialogSubmit = this.DialogSubmit.bind(this);
    }
    componentDidMount(){
        var proArr =  [{key:"请选择",value:0}];
        var provinceList = cityTool.getProvinceList();
        for(var i=0;i<provinceList.length;i++){
            proArr.push({key:provinceList[i].name,value:provinceList[i].value});
        }
        this.setState({provinceData:proArr});
        this.getList();
    }
    getList(){
        recvList({clientId:this.clientId}).then((data)=>{
            this.setState({
                list:data
            })
        });
    }
    provinceChangeFn(e){
        var value = e.value;
        var cityArr = [{key:"请选择",value:0}];
        var cityList = cityTool.getCityList(value);
        let {request} = this.state;
        if(value==0){
            this.setState({cityData:cityArr,countyData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }else{
            for(var i = 0 ; i<cityList.length;i++){
                cityArr.push({key:cityList[i].name,value:cityList[i].value});
            }
            this.setState({cityData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }
        request.sheng = value;
        this.setState({province:value});

    }
    cityChangeFn(e){
        var value = e.value;
        var province = this.state.province;
        var countyArr = [{key:"请选择",value:0}];
        let {request} = this.state;
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
        request.shi = value;
        this.setState({county:value});
    }
    countyChangeFn(e){
        var value = e.value;
        let {request} = this.state;
        request.qu = value;
        this.setState({defaultCounty:{key:e.key,value:e.value}});
    }
    addAddress(){
        let {request} = this.state;
        request.sheng = "";
        request.shi = "";
        request.qu = "";
        request.recvname = "";
        request.tel = "";
        request.adressdetail = "";
        this.setState({
            isModify:false,
            defaultProvince:{key:"请选择",value:0},
            defaultCity:{key:"请选择",value:0},
            defaultCounty:{key:"请选择",value:0},
        },()=>{
            this.refs.addressDialog.show();
        });
    }
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
    }
    DialogSubmit(){
        let _this = this;
        if(!this.checkValid()){
            return false;
        }
        let {request,isModify,id} = this.state;
        request.clientId = this.clientId;
        let url = isModify?"/djt/web/address/updaterecv.do":"/djt/web/address/addrecv.do";
        if(isModify){
            request.id = id;
        }else{
            request.id = "";
        }
        $.ajax({
            url:commonUrl + url,
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success",isModify?"修改成功":"新增成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
        console.log(this.state.request)
    }
    checkValid(){
        let {request,hasCounty} = this.state;
        let flag = true;
        let msg = "";
        if(!request.recvname){
            msg = "请输入收货人姓名";
            flag = false;
        }else if(!request.tel){
            msg = "请输入联系方式";
            flag = false;
        }else if(!request.sheng){
            msg = "请选择省级";
            flag = false;
        }else if(!request.shi){
            msg = "请选择市区";
            flag = false;
        }else if(hasCounty && !request.qu){
            msg = "请选择县级";
            flag = false;
        }else if(!request.adressdetail){
            msg = "请输入街道地址";
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
    delete(id){
        let _this = this;
        RUI.DialogManager.confirm({
            message:"您确定要删除吗？",
            title:"删除收货地址",
            submit(){
                $.ajax({
                    url:commonUrl + "/djt/web/address/deleterecv.do",
                    type:"post",
                    dataType:"json",
                    data:{id},
                    success(data){
                        if(data.status == "0000"){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            _this.getList();
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.msg]);
                        }
                    }
                })
            }
        });

    }
    modify(item){
        let {request} = this.state;
        request.recvname = item.recvname;
        request.tel = item.tel;
        request.sheng = item.sheng;
        request.shi = item.shi;
        request.qu = item.qu;
        request.adressdetail = item.adressdetail;

        this.setState({
            defaultProvince:{key:item.sheng,value:item.sheng},
            defaultCity:{key:item.shi,value:item.shi},
            defaultCounty:{key:item.qu,value:item.qu},
            hasCounty:!!item.qu,
            isModify:true,
            id:item.id
        },()=>{
            this.refs.addressDialog.show();
        })
    }
    render(){
        let {provinceData,defaultProvince,cityData,defaultCity,countyData,defaultCounty,hasCounty,request,list} = this.state;
        return(
            <div>
                <Layout mark = "kh" bread = {["客户管理","收货地址"]}>
                    <div className="search-div clearfix">
                        <div className="right">
                            <RUI.Button  className = "primary" onClick = {this.addAddress}>添加地址</RUI.Button>
                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-15">收货人姓名</td>
                                <td className="col-15">联系方式</td>
                                <td className="col-15">省</td>
                                <td className="col-15">市</td>
                                <td className="col-15">区</td>
                                <td className="col-15">街道地址</td>
                                <td className="col-10">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,index)=>{
                                    return(
                                        <tr key = {index}>
                                            <td>{item.recvname}</td>
                                            <td>{item.tel}</td>
                                            <td>{item.sheng}</td>
                                            <td>{item.shi}</td>
                                            <td>{item.qu || "无"}</td>
                                            <td>{item.adressdetail}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.modify.bind(this,item)}>修改&nbsp;</a>
                                                <a href="javascript:;" onClick = {this.delete.bind(this,item.id)}>|删除&nbsp;</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }


                            </tbody>
                        </table>
                        {
                            list.length==0 && <div className="no-data">暂时没有数据哦</div>
                        }
                    </div>
                    <RUI.Dialog ref="addressDialog" title={"收货地址"} draggable={false} buttons="submit,cancel"
                                onSubmit={this.DialogSubmit}>
                        <div style={{minWidth:'800px', wordWrap:'break-word'}}>
                            <LabelInput onChange = {this.changeInput.bind(this,"recvname")}
                                        require = {true}
                                        value = {request.recvname}
                                        placeholder = "收货人姓名"
                                        label = "收货人姓名："/>
                            <LabelInput onChange = {this.changeInput.bind(this,"tel")}
                                        require = {true}
                                        value = {request.tel}
                                        maxLength = {11}
                                        placeholder = "联系方式"
                                        label = "联系方式："/>

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
                            <LabelInput onChange = {this.changeInput.bind(this,"adressdetail")}
                                        require = {true}
                                        value = {request.adressdetail}
                                        placeholder = "街道地址"
                                        label = "街道地址："/>

                        </div>
                    </RUI.Dialog>
                </Layout>
            </div>
        )
    }
}