/**
 * Created by Administrator on 2017-4-19.
 */
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
            listRequest:{
                userid:"",
                keyword:"",
            },
            sortState:1
        };
        this.recharge = this.recharge.bind(this);
        this.sortFn = this.sortFn.bind(this);
    }
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        $.ajax({
            url:commonUrl+"/order/findOrderList.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify(listRequest),pageNo:pageNo,pageSize:10},
            success(data){
                if(data.status == "0000"){
                    pager.currentPage = pageNo;
                    pager.totalNum = data.resultMap.iTotalDisplayRecords;
                    _this.setState({
                        list : data.resultMap.rows || [],
                        pager : pager
                    })
                }else{
                    pager.currentPage = 1;
                    pager.totalNum = 0;
                    _this.setState({list:[],pager})
                }
            }
        });
    }
    recharge(){
        hashHistory.push("recharge");
    }
    add(){
        hashHistory.push("addNotice");
    }
    sortFn(){
        this.setState({sortState:!this.state.sortState});
    }
    render(){
        let {pager,sortState} =this.state;
        return(
            <div>
                <Layout mark = "tz" bread = {["通知管理","通知列表"]}>
                    <div className="search-div">
                        <RUI.Input placeholder = "请输入主题内容"/>
                        <RUI.Button className = "primary" >查询</RUI.Button>
                        <div className="right">
                            <RUI.Button onClick = {this.add} >批量下架</RUI.Button>
                            <RUI.Button onClick = {this.add} >批量删除</RUI.Button>
                            <RUI.Button onClick = {this.add} className = "primary">新增通知</RUI.Button>
                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-15">通知类型</td>
                                <td className="col-15">通知主题</td>
                                <td className= {sortState==1?"col-15 sort-des":"col-15 sort-asc"} onClick = {this.sortFn}>
                                    <span className="m-r-5">上线时间</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className= {sortState==1?"col-15 sort-des":"col-15 sort-asc"} onClick = {this.sortFn}>
                                    <span className="m-r-5">下线时间</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className="col-15">展示位置</td>
                                <td className="col-10">状态</td>
                                <td className="col-15">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>商品推广</td>
                                <td>充值10000送500活动</td>
                                <td>2017-04-19 22:20:23</td>
                                <td>2017-04-19 22:20:28</td>
                                <td>滚动栏1</td>
                                <td>上线</td>
                                <td>
                                    <a href="javascript:;">查看&nbsp;|</a>
                                    <a href="javascript:;">&nbsp;修改&nbsp; |</a>
                                    <a href="javascript:;">&nbsp;下线&nbsp; |</a>
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