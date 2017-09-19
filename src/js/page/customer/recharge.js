/**
 * Created by Administrator on 2017-4-16.
 */
import Layout from "../../component/layout";
import LabelText from "../../component/label-text";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import {changeNumMoneyToChinese} from "../../util/util";
import {brandList} from "../ajax/commodityAjax";
import {customerDetail} from "../ajax/customerAjax";
import "../../../css/page/order.scss";
import Pubsub from "../../util/pubsub";
import {hashHistory} from "react-router";
const moneyReg = /^(0(?:[.](?:[1-9]\d?|0[1-9]))|[1-9]\d{0,9}(?:[.]\d{0,2}|$)|0([.]0{0,2})?)$/;
export default class Recharg extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            checked:false,
            ChineseNum:"",
            brandSelect:[],
            request:{
                companyname:localStorage.companyName,
                userid:localStorage.userid,
                agentname:localStorage.agentname,
                clientname:"",
                clientId:this.props.location.query.clientId || "",
                name:"",
                brand:"",
                money:"",
                chargetype:1,
                remark:"",
            },
            defaultBrand:{key:"请选择",value:""},
            detail:{}
        };
        this.selectBrand = this.selectBrand.bind(this);
        this.checkChange = this.checkChange.bind(this);
        this.recharge = this.recharge.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
      }
      componentDidMount(){
          this.getBrandList();
          this.getDetail();
      }
    getDetail(){
        let {request} = this.state;
        let clientId = this.props.location.query.clientId;
        customerDetail({clientId,companyName:localStorage.companyName}).then((data)=>{
            request.clientname = data.ClientInfo.clientname
            request.name = data.ClientInfo.name
            this.setState({
                detail:data.ClientInfo
            })
        })
    }
    getBrandList(){
        let brandRequest = {pageNum:1,pageSize:100000, companyName:localStorage.companyName || "",};
        brandList(brandRequest).then((data)=>{
            let brandSelect = [];
            data.dataList.map((item)=>{
                brandSelect.push({key:item.brand,value:item.brand})
            });
            this.setState({brandSelect});
        });
    }
    checkChange(e){
        let {request} = this.state;
        let checked = e.data.selected==1?true : false;
        request.chargetype = checked?-1:1;
        this.setState({checked});
    }
    selectBrand(e){
        let {request,defaultBrand} = this.state;
        request.brand = e.value;
        defaultBrand = e;
        this.setState({defaultBrand});
    }
    changeInput(type,e){
        let {request} = this.state;
        let value = e.target.value;
        request[type] = value;
        let ChineseNum = changeNumMoneyToChinese(value);
        this.setState({ChineseNum});
    }
    checkValid(){

        let {request} = this.state;
        let flag = true;
        let msg = "";
        if(!request.brand){
            msg = "请选择充值品牌";
            flag = false;
        }else if(!request.money){
            msg = "请输入充值金额";
            flag = false;
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
        }
        return flag;
    }
    recharge(){
        if(!this.checkValid()){
            return;
        }
        this.refs.dialog.show();

    }
    dialogSubmit(){
        let {request} = this.state;
        $.ajax({
            url:commonUrl + "/djt/web/clientmang/recharge.do",
            data:request,
            type:"post",
            dataType:"json",
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","充值成功"]);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
    }
    getState(type){
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
    getAddressStr(detail){
        return detail.sheng + detail.shi + detail.qu + detail.addetail
    }
    changeInput1(type,e){
        let {request} = this.state;
        let value = e.target.value;
        request[type] = value;
    }
    render(){
        let {checked,brandSelect,ChineseNum,defaultBrand,detail,request} = this.state;
        let msg = "",title = "";
        if(request.chargetype==1){
            msg = <div>确定为{detail.clientname}的{request.brand}账户充值{request.money}元？</div>;
            title = "确认充值";
        }else{
            msg = <div>确定扣除{detail.clientname}的{request.brand}账户上的{request.money}元？ <p className="font-color-red">(该操作会导致客户余额减少)</p></div> ;
            title = "负数充值";
        }
        return(
            <Layout mark = "kh" bread = {["客户管理","充值"]}>
                <LabelText label = "公司名称：" text = {detail.clientname}/>
                <LabelText label = "姓名：" text = {detail.name}/>
                <LabelText label = "代理级别：" text = {this.getState(detail.level)}/>
                <LabelText label = "地址：" text = {this.getAddressStr(detail)}/>
                <LabelText label = "联系方式：" text = {detail.tel || "无"}/>
                <LabelText label = "QQ：" text = {detail.qq || "无"}/>
                <LabelText label = "微信：" text = {detail.weixin || "无"}/>
                <RUI.Checkbox value="1" className = "m-l-20"  onChange={this.checkChange}>
                    充值操作失误，可进行负数充值
                </RUI.Checkbox>
                <LabelSelect require = {true}
                             label = {checked? "负充值品牌：": "充值品牌："}
                             data = {brandSelect}
                             callback = {this.selectBrand}
                             default = {defaultBrand}/>
                <LabelInput onChange = {this.changeInput.bind(this,"money")}
                            require = {true}
                            tips = {ChineseNum}
                            reg = {moneyReg}
                            value = {request.money}
                            label = {checked? "负充值金额：": "充值金额："}/>
                <LabelInput onChange = {this.changeInput1.bind(this,"remark")}
                            label = {"备注"}/>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                    onClick={this.recharge}>充值</RUI.Button>
                    </div>
                </div>
                <RUI.Dialog ref="dialog" title={title} draggable={false} buttons="submit,cancel"
                            onSubmit={this.dialogSubmit}>
                    <div style={{width:'400px', wordWrap:'break-word',maxHeight:500}}>
                        {msg}
                    </div>
                </RUI.Dialog>
            </Layout>
        )
    }
}