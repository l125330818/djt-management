/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";
import {reset,customerDetail,rechargeList} from "../ajax/customerAjax";
import Pubsub from "../../util/pubsub";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detail:{},
            accountInfo:[],
            rechargeList:[],
            listRequest:{
                keyword:"",
                query:"",
                pageSize:100000,
                pageNum:1,
                companyName:localStorage.companyName || "",
            },
        }
        this.reset = this.reset.bind(this);
        this.rechargeList = this.rechargeList.bind(this);
    }
    componentDidMount(){
        this.getDetail();
    }
    getDetail(){
        let clientId = this.props.location.query.clientId;
        customerDetail({clientId,companyName:localStorage.companyName}).then((data)=>{
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
        let {detail} = this.state;
        RUI.DialogManager.confirm({
            message:"您确定要重置密码吗？",
            title:"重置密码",
            submit(){
                reset({account:detail.account}).then((data)=>{
                    Pubsub.publish("showMsg",["success","重置密码成功，新密码为654321"])
                });
            }
        });

    }
    getAddressStr(detail){
        return detail.sheng + detail.shi + detail.qu + detail.addetail
    }
    rechargeList(){
        let {listRequest,detail} = this.state;
        listRequest.query = detail.clientname;
        rechargeList(listRequest).then((data)=>{
            this.setState({
                rechargeList:data.dataList || []
            })
        });
        this.refs.dialog.show();
    }
    render(){
        let {detail,accountInfo,rechargeList} = this.state;
        return(
            <Layout mark = "kh" bread = {["客户管理","客户详情"]}>
                <div className="order-detail">
                    <h3 className="detail-title">客户信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text ={detail.clientname}/>
                        <LabelText label = "客户姓名：" text = {detail.name}/>
                        <LabelText label = "代理级别：" text = {this.getState(detail.level)}/>
                        <LabelText label = "账号：" text = {detail.account}/>
                        <LabelText label = "联系方式：" text = {detail.tel || "无"}/>
                        <LabelText label = "Email：" text = {detail.email || "无"}/>
                        <LabelText label = "QQ：" text = {detail.qq || "无"}/>
                        <LabelText label = "微信：" text = {detail.weixin || "无"}/>
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

                        <LabelText label = "备注：" text = {detail.remark || "无"}/>
                    </div>
                </div>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.rechargeList}>充值记录</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.reset}>重置密码</RUI.Button>
                    </div>
                </div>
                <RUI.Dialog ref="dialog" title={"充值记录"} draggable={false} buttons="submit,cancel"
                            onSubmit={this.dialogSubmit}>
                    <div style={{width:'400px', wordWrap:'break-word',maxHeight:350,overflow:"auto"}}>
                        <h3 className="text-center">公司名称:{detail.clientname}</h3>
                        <table className="recharge-table">
                            <thead>
                                <tr>
                                    <td>充值时间</td>
                                    <td>品牌</td>
                                    <td>金额</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                rechargeList.length>0 && rechargeList.map((item,i)=>{
                                    return(
                                        <tr key = {i}>
                                            <td>{item.chargetime}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.money}</td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        {
                            rechargeList.length == 0 &&
                                <div className="recharge-no-data">暂时没有充值记录哦</div>
                        }

                    </div>
                </RUI.Dialog>
            </Layout>
        )
    }
}