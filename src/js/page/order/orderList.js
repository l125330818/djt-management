/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
export default class List extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:100,
            },
        };
      }
    getList(){}
    render(){
        let {pager} =this.state;
        return(
            <div>
                <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                    <div className="search-div">
                        <RUI.Input placeholder = "请输入订单号或公司名称"/>
                        <RUI.Button className = "primary" >查询</RUI.Button>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-15">订单号</td>
                                    <td className="col-15">公司名称</td>
                                    <td className="col-15">订单金额</td>
                                    <td className="col-15">订单品牌</td>
                                    <td className="col-15">下单时间</td>
                                    <td className="col-10">状态</td>
                                    <td className="col-15">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12313456</td>
                                    <td>公司名称</td>
                                    <td>13.22</td>
                                    <td>品牌</td>
                                    <td>2017年4月13日 22:35:45</td>
                                    <td>发货</td>
                                    <td>操作</td>
                                </tr>
                                <tr>
                                    <td>12313456</td>
                                    <td>公司名称</td>
                                    <td>13.22</td>
                                    <td>品牌</td>
                                    <td>2017年4月13日 22:35:45</td>
                                    <td>发货</td>
                                    <td>操作</td>
                                </tr>
                                <tr>
                                    <td>12313456</td>
                                    <td>公司名称</td>
                                    <td>13.22</td>
                                    <td>品牌</td>
                                    <td>2017年4月13日 22:35:45</td>
                                    <td>发货</td>
                                    <td>操作</td>
                                </tr>
                                <tr>
                                    <td>12313456</td>
                                    <td>公司名称</td>
                                    <td>13.22</td>
                                    <td>品牌</td>
                                    <td>2017年4月13日 22:35:45</td>
                                    <td>发货</td>
                                    <td>操作</td>
                                </tr>
                            </tbody>
                        </table>
                        <Pager onPage ={this.getList} {...pager}/>
                    </div>
                </Layout>
            </div>
        )
    }
}