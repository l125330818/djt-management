/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";
import {reset,customerDetail} from "../ajax/customerAjax";
import Pubsub from "../../util/pubsub";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detail:{},
            accountInfo:[]
        }
        this.reset = this.reset.bind(this);
    }
    componentDidMount(){
        this.getDetail();
    }
    getDetail(){
        let clientId = this.props.location.query.clientId;
        customerDetail({clientId}).then((data)=>{
            this.setState({
                detail:data.ClientInfo,
                accountInfo:data.AccountInfo,
            })
        })
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
    getAddressStr(detail){
        return detail.sheng + detail.shi + detail.qu + detail.addetail
    }
    render(){
        let {detail,accountInfo} = this.state;
        return(
            <Layout mark = "kh" bread = {["客户管理","客户详情"]}>
                <div className="order-detail">
                    <h3 className="detail-title">客户信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text ={detail.clientname}/>
                        <LabelText label = "客户姓名：" text = {detail.name}/>
                        <LabelText label = "代理级别：" text = {this.getState(detail.level)}/>
                        <LabelText label = "账号：" text = {detail.account}/>
                        <LabelText label = "联系方式：" text = {detail.tel}/>
                        <LabelText label = "Email：" text = {detail.email}/>
                        <LabelText label = "QQ：" text = {detail.qq}/>
                        <LabelText label = "微信：" text = {detail.weixin}/>
                        <LabelText label = "地址：" text = {this.getAddressStr(detail)}/>
                        <LabelText label = "签约时间：" text = {detail.singtime}/>
                        {
                            accountInfo.map((item,index)=>{
                                return (
                                    <div>
                                        <span className="m-r-20">{`品牌${item.brand}余额：`}</span>
                                        {item.balance}
                                    </div>
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