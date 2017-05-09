/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "detail": {
                "clientname": "XXXX",
                "order_no": "12154545",
                "status": 2,
                "order_money": 220.1 ,
                "order_time": "2017-12-12 17:50",
                "goods_list": [{
                    "goods_name":"多芬",
                    "goods_no":"123456",
                    "goods_stand":"2L装",
                    "goods_money":80.0,
                    "goods_num":20
                },{
                    "goods_name":"多芬",
                    "goods_no":"123456",
                    "goods_stand":"2L装",
                    "goods_money":80.0,
                    "goods_num":20
                }]
            }
        }
    }
    getState(type){
        switch(type * 1){
            case 1 :
                return "待审核";
            case 2 :
                return "已受理";
            case 3 :
                return "已发货";
            case 4 :
                return "已完成";
            case 5 :
                return "已退回";
            default:
                return "";
        }
    }
    render(){
        let {detail} = this.state;
        return(
            <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                <div className="order-detail">
                    <h3 className="detail-title">订单信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text ={detail.clientname}/>
                        <LabelText label = "订单号：" text = {detail.order_no}/>
                        <LabelText label = "订单状态：" text = {this.getState(detail.status)}/>
                        <LabelText label = "订单金额：" text = {detail.order_money}/>
                        <LabelText label = "订单时间：" text = {detail.order_time}/>
                    </div>
                    <h3 className="detail-title">商品信息</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>商品名称</td>
                            <td>单价</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            detail.goods_list.map((item,index)=>{
                                return(
                                    <tr key = {index}>
                                        <td>{item.goods_name}</td>
                                        <td>{item.goods_money}</td>
                                    </tr>
                                )
                            })
                        }

                        </tbody>
                    </table>
                </div>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>受理</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>发货</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>退货</RUI.Button>
                        <RUI.Button className="primary"
                                    style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>导出</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}