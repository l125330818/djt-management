/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";
import {reset} from "../ajax/customerAjax";
import Pubsub from "../../util/pubsub";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "detail": {
                "clientname": "聚美优品化妆品",
                "pername": "吴系挂",
                "level": 2 ,
                "account": "1436864169",
                "tel": "17311111111",
                "email":"123@163.com",
                "qq":"123456",
                "weixin":"weixin",
                "address":"xx省xx市xx区",
                "addetail":"xx街道xx",
                "signtime":"2017-12-12 17:50",
                "remark":"备注",
                "balance":[
                    {
                        "brand":"品牌A",
                        "money":1000.0
                    }
                ]
            }
        }
        this.reset = this.reset.bind(this);
    }
    componentDidMount(){

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
    reset(){
        let account = this.props.location.query.account || "";
        reset({account}).then((data)=>{
            Pubsub.publish("showMsg",["success","重置密码成功"])
        });
    }
    render(){
        let {detail} = this.state;
        return(
            <Layout mark = "kh" bread = {["客户管理","客户详情"]}>
                <div className="order-detail">
                    <h3 className="detail-title">客户信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text ={detail.clientname}/>
                        <LabelText label = "客户姓名：" text = {detail.pername}/>
                        <LabelText label = "代理级别：" text = {this.getState(detail.level)}/>
                        <LabelText label = "账号：" text = {detail.account}/>
                        <LabelText label = "联系方式：" text = {detail.tel}/>
                        <LabelText label = "Email：" text = {detail.email}/>
                        <LabelText label = "QQ：" text = {detail.qq}/>
                        <LabelText label = "微信：" text = {detail.weixin}/>
                        <LabelText label = "地址：" text = {detail.address}/>
                        <LabelText label = "签约时间：" text = {detail.signtime}/>
                        {
                            detail.balance.map((item,index)=>{
                                return (
                                    <LabelText key = {index} label = {`${item.brand}余额：`} text = {item.money}/>
                                )
                            })
                        }

                        <LabelText label = "备注：" text = {detail.remark}/>
                    </div>
                </div>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>充值记录</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.reset}>重置密码</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>修改</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}