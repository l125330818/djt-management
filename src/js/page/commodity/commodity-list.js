/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router"
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
        this.add = this.add.bind(this);
    }
    getList(){}
    add(){
        hashHistory.push("addCommodity");
    }
    render(){
        let {pager} =this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品列表"]}>
                    <div className="search-div clearfix">
                        <div className="left">
                            <span>品牌：</span>
                            <RUI.Input className = "search-input"  placeholder = "请输入品牌"/>
                            <span>系列：</span>
                            <RUI.Input className = "search-input"  placeholder = "请输入系列"/>
                            <span>分类：</span>
                            <RUI.Input className = "search-input"  placeholder = "请输入分类"/>
                            <span>商品分类：</span>
                            <RUI.Input className = "search-input" placeholder = "请输入商品分类"/>
                            <RUI.Button className = "primary" >查询</RUI.Button>
                        </div>
                       <div className="right">
                           <RUI.Button>批量下架</RUI.Button>
                           <RUI.Button>批量删除</RUI.Button>
                           <RUI.Button onClick = {this.add} className = "primary">新增商品</RUI.Button>

                       </div>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-10">
                                        <RUI.Checkbox>商品名称</RUI.Checkbox>
                                    </td>
                                    <td className="col-8">品牌</td>
                                    <td className="col-10">系列</td>
                                    <td className="col-8">商品分类</td>
                                    <td className="col-8">单位</td>
                                    <td className="col-8">价格(元)</td>
                                    <td className="col-8">库存</td>
                                    <td className="col-8">销量</td>
                                    <td className="col-10">更新时间</td>
                                    <td className="col-8">状态</td>
                                    <td className="col-14">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <RUI.Checkbox>商品名称</RUI.Checkbox>
                                    </td>
                                    <td>品牌</td>
                                    <td>哈哈系列</td>
                                    <td>分类</td>
                                    <td>盒</td>
                                    <td>13.2</td>
                                    <td>1000</td>
                                    <td>1000</td>
                                    <td>2017-04-16 10:29:36</td>
                                    <td>上架</td>
                                    <td>
                                        <a href="javascript:;">查看&nbsp;|</a>
                                        <a href="javascript:;">&nbsp;修改&nbsp; |</a>
                                        <a href="javascript:;">&nbsp;下架&nbsp;|</a>
                                        <a href="javascript:;">&nbsp;删除</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <RUI.Checkbox>商品名称</RUI.Checkbox>
                                    </td>
                                    <td>品牌</td>
                                    <td>哈哈系列</td>
                                    <td>分类</td>
                                    <td>盒</td>
                                    <td>13.2</td>
                                    <td>1000</td>
                                    <td>1000</td>
                                    <td>2017-04-16 10:29:36</td>
                                    <td>上架</td>
                                    <td>
                                        <a href="javascript:;">查看&nbsp;|</a>
                                        <a href="javascript:;">&nbsp;修改&nbsp; |</a>
                                        <a href="javascript:;">&nbsp;下架&nbsp;|</a>
                                        <a href="javascript:;">&nbsp;删除</a>
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