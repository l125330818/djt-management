/**
 * Created by luojie on 2017/4/20 14:44.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelText from "../../component/label-text";

export default class Detail extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                <div className="order-detail">
                    <h3 className="detail-title">订单信息</h3>
                    <div className="bottom-line">
                        <LabelText label = "公司名称：" text = "有一家公司"/>
                        <LabelText label = "订单号：" text = "12314573240"/>
                        <LabelText label = "订单状态：" text = "已发货"/>
                        <LabelText label = "订单金额：" text = "1234.00"/>
                        <LabelText label = "订单时间：" text = "2017-4-20 14:53:59"/>
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
                        <tr>
                            <td>哈哈啊哈啊啊</td>
                            <td>13.00</td>
                        </tr>
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