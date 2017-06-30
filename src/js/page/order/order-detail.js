/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";
import LabelInput from "../../component/label-input";
import LabelArea from "../../component/label-textarea";
import LabelDate from "../../component/label-date";
import Pubsub from "../../util/pubsub";
import {orderDetail} from "../ajax/orderAjax";
import moment from "moment";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            detail:{
                dataList:[],
                express:{}
            },
            dispatchGoods:{
                senddate:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                expressfirm:"",
                expressno:"",
                remark:"",
                orderno:this.props.location.query.orderNo,
                companyname:localStorage.companyName
            },
            orderDetail:{
                orderno:"",
                companyname:"",
                productList:[
                    {
                        brand:"品牌",
                        series:"系列",
                    }
                ]
            },
            reason:""
        };
        this.orderNo = this.props.location.query.orderNo;
        this.type = this.props.location.query.type;
        this.level = localStorage.level;
        this.dialogSubmit = this.dialogSubmit.bind(this);
        this.voidDialogSubmit = this.voidDialogSubmit.bind(this);
        this.export = this.export.bind(this);
    }
    componentDidMount(){
        this.getDetail();
    }
    getDetail(){
        let request = {orderNo:this.orderNo};
        orderDetail(request).then((data)=>{
            this.setState({
                detail:data,
            })
        });
    }
    getState(type){
        switch(type * 1){
            case 1 :
                return "待受理";
            case 2 :
                let str =this.type==1?"待发货":"待退货";
                return str;
            case 3 :
                return "待审核";
            case 4 :
                return this.type==1?"已完成":"退货完成";
            case 0 :
                return this.type == 1?"已退回":"已拒绝";
            case -2 :
                return "待审核";
            case -1 :
                return "已拒绝";
            default:
                return "";
        }
    }
    changeInput(type,e){
        let {detail} = this.state;
        detail[type] = e.target.value;
        this.setState({});
    }
    handleOrder(type){
        let _this = this;
        let url = "";
        let request = {};
        let {detail} = this.state;
        request.orderNo = this.orderNo;
        request.remark = detail.remark;
        switch(type){
            case 1:
                url = "/djt/web/ordermang/handle.do";
                RUI.DialogManager.confirm({
                    message:"您确定要受理吗？",
                    title:"审核",
                    submit(){
                        _this.handleAjax(url,request);
                    }
                });
                break;
            case 2:
                if(this.type == -1){
                    url = "/djt/web/ordermang/handle2.do";
                    request.orderNo = null;
                    request.remark = null;
                    request.orderno = this.orderNo;
                    request.remark2 = detail.remark;
                    RUI.DialogManager.confirm({
                        message:"您确定要退货吗？",
                        title:"退货",
                        submit(){
                            _this.handleAjax(url,request);
                        }
                    });
                }else{
                    this.refs.dialog.show();
                }
                return;
            case 3:
                url = "/djt/web/ordermang/handle3.do";
                if(this.type==1){
                    request.actualMoney = detail.realMoney;
                }
                if(parseFloat(detail.realMoney) > parseFloat(detail.money)){
                    Pubsub.publish("showMsg",["wrong","实付金额不能大于订单金额"]);
                    return;
                }
                RUI.DialogManager.confirm({
                    message:"您确定要审核吗？",
                    title:"审核",
                    submit(){
                        _this.handleAjax(url,request);
                    }
                });
                break;
            case 4:
                this.refs.voidDialog.show();
                break;
        }

    }
    handleAjax(url,request){
        let _this = this;
        request.type = this.type;
        $.ajax({
            url:commonUrl+url,
            data:request,
            type:"post",
            dataType:"json",
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","操作成功"]);
                    _this.getDetail();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        })
    }
    dateChange(type,e){
        let {dispatchGoods} = this.state;
        dispatchGoods[type] = e;
        this.setState({});
    }
    handleInput(type,e){
        let {dispatchGoods} = this.state;
        dispatchGoods[type] = e.target.value;
    }
    dialogSubmit(){
        let {dispatchGoods,detail} = this.state;
        let msg = "";
        let url = "/djt/web/ordermang/handle2.do";
        // if(!dispatchGoods.expressfirm){
        //     msg = "请输入物流公司";
        // }else if(!dispatchGoods.expressno){
        //     msg = "请输入物流单号";
        // }else{
        //     msg = "";
        // }
        // if(msg){
        //     Pubsub.publish("showMsg",["wrong",msg]);
        //     return false;
        // }
        let request = dispatchGoods;
        request.remark2 = detail.remark;
        this.handleAjax(url,request);
    }
    voidDialogSubmit(){
        let {reason} = this.state;
        let request = {
            reason,
            orderNo:this.orderNo
        };
        let  url = "/djt/web/ordermang/handleback.do";
        let msg = "";
        if(!reason){
            msg = "请输入作废理由";
        }else{
            msg = "";
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
            return false;
        }

        this.handleAjax(url,request);
    }
    handleVoidInput(type,e){
        this.state[type] = e.target.value;
    }
    export(){
        let arr = [this.orderNo];
        window.open(commonUrl + "/djt/web/export/orderexp.do?orderNo="+JSON.stringify(arr))
    }
    render(){
        let {detail,dispatchGoods,reason} = this.state;
        let {express} = detail;
        let level = this.level;
        let type = this.type;
        let status = detail.status;
        return(
            <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                <div className="order-detail">
                    <h3 className="detail-title">订单信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text ={detail.clientName}/>
                        <LabelText label = "订单号：" text = {detail.orderNo}/>
                        <LabelText label = "订单状态：" text = {this.getState(detail.status)}/>
                        <LabelText label = "订单金额：" text = {detail.money}/>
                        <LabelText label = "订单时间：" text = {detail.orderTime}/>
                        {
                            status == 4 &&
                            <LabelText label = "实付金额：" text = {detail.realMoney}/>
                        }
                        {
                            detail.reason &&
                            <LabelText label = "作废理由：" text = {detail.reason}/>
                        }
                        {
                            express && express.expressfirm &&
                            <LabelText label = "物流公司：" text = {express.expressfirm}/>
                        }
                        {
                            express && express.expressno &&
                            <LabelText label = "物流单号：" text = {express.expressno}/>
                        }
                        {
                            express && express.senddate &&
                            <LabelText label = "发货时间：" text = {express.senddate}/>
                        }
                    </div>
                    <h3 className="detail-title">商品清单</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <td className = "col-25">商品名称</td>
                            <td className = "col-25">品牌</td>
                            <td className = "col-25">单价</td>
                            <td className = "col-25">数量</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            detail.dataList && detail.dataList.map((item,index)=>{
                                return(
                                    <tr key = {index}>
                                        <td>{item.goodsname}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.price}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                )
                            })
                        }

                        </tbody>
                    </table>
                    <div>
                        {
                            ((level == 5 || level == 1  || level == 3)&& type!=-1) && status == 3 &&
                            <LabelInput onChange = {this.changeInput.bind(this,"realMoney")}
                                        require = {true}
                                        value = {detail.realMoney}
                                        maxLength = {10}
                                        disable = {false}
                                        placeholder = "请输入订单金额"
                                        label = "实付金额："/>
                        }

                        <LabelArea onChange = {this.changeInput.bind(this,"remark")}
                                   value =  {detail.remark}
                                   disable = {(status ==0 || status == 4)}
                                   require = {true}
                                   label = "备注："/>
                    </div>
                </div>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        {
                            (level == 2 || level == 3 || level == 1) && status == 1 &&
                            <RUI.Button className="primary"
                                        style={{marginLeft:"10px"}}
                                        onClick={this.handleOrder.bind(this,1)}>受理</RUI.Button>
                        }
                        {
                            (level == 4 || level == 1 || level == 3) && status == 2 &&
                            <RUI.Button className="primary"
                                        style={{marginLeft:"10px"}}
                                        onClick={this.handleOrder.bind(this,2)}>{type==1?"发货":"退货"}</RUI.Button>
                        }
                        {
                            (level == 5 || level == 1 || level == 3) && status == 3 &&
                            <RUI.Button className="primary"
                                        style={{marginLeft:"10px"}}
                                        onClick={this.handleOrder.bind(this,3)}>审核</RUI.Button>
                        }
                        {
                            status !=0 && status != 4 &&
                            <RUI.Button className="primary"
                                        style={{marginLeft:"10px"}}
                                        onClick={this.handleOrder.bind(this,4)}>{type==1?"作废":"拒绝"}</RUI.Button>
                        }

                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.export}>导出</RUI.Button>
                    </div>
                </div>
                <RUI.Dialog ref="dialog" title={"发货"} draggable={false} buttons="submit,cancel"
                            onSubmit={this.dialogSubmit}>
                    <div style={{width:'400px', wordWrap:'break-word'}}>
                        <LabelInput placeholder = "物流公司"
                                    require={true}
                                    value = {dispatchGoods.expressfirm}
                                    onChange = {this.handleInput.bind(this,"expressfirm")} label = "物流公司："/>
                        <LabelInput placeholder = "物流单号"
                                    require={true}
                                    value = {dispatchGoods.expressno}
                                    onChange = {this.handleInput.bind(this,"expressno")} label = "物流单号："/>
                        <LabelArea placeholder = "备注"
                                    value = {dispatchGoods.remark}
                                    onChange = {this.handleInput.bind(this,"remark")} label = "备注："/>

                    </div>
                </RUI.Dialog>
                <RUI.Dialog ref="voidDialog" title={type==1?"作废":"拒绝退货"} draggable={false} buttons="submit,cancel"
                            onSubmit={this.voidDialogSubmit}>
                    <div style={{width:'400px', wordWrap:'break-word'}}>
                        <LabelArea placeholder ={type==1? "作废理由": "拒绝理由"}
                                   value = {reason}
                                   onChange = {this.handleVoidInput.bind(this,"reason")} label = {type==1?"作废理由：":"拒绝理由："}/>

                    </div>
                </RUI.Dialog>
            </Layout>
        )
    }
}