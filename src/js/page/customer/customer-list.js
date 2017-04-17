/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
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
        this.recharge = this.recharge.bind(this);
      }
    getList(){}
    recharge(){
        hashHistory.push("recharge");
    }
    add(){
        hashHistory.push("addCustomer");
    }
    render(){
        let {pager} =this.state;
        return(
            <div>
                <Layout mark = "kh" bread = {["客户管理","客户列表"]}>
                    <div className="search-div">
                        <RUI.Input placeholder = "请输入要查询的姓名、公司名称、账号、地区"/>
                        <RUI.Button className = "primary" >查询</RUI.Button>
                        <div className="right">
                            <RUI.Button onClick = {this.add} className = "primary">新增客户</RUI.Button>

                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-15">公司名称</td>
                                    <td className="col-15">姓名</td>
                                    <td className="col-15">帐号</td>
                                    <td className="col-15">地区</td>
                                    <td className="col-10">客户级别</td>
                                    <td className="col-15">总金额</td>
                                    <td className="col-15">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>公司名称</td>
                                    <td>张哥</td>
                                    <td>帐号</td>
                                    <td>四川地区</td>
                                    <td>一级代理</td>
                                    <td>13265.00</td>
                                    <td>
                                        <a href="javascript:;">查看&nbsp;|</a>
                                        <a href="javascript:;" onClick = {this.recharge}>&nbsp;充值&nbsp; |</a>
                                        <a href="javascript:;">&nbsp;禁用</a>
                                    </td>
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