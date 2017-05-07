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
            sortState:1,
            checkedAll:false,
        };
        this.sortFn = this.sortFn.bind(this);
        this.checkAll = this.checkAll.bind(this);
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
                if(data.code == "0000"){
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
        hashHistory.push("addCustomer");
    }
    sortFn(){
        this.setState({sortState:!this.state.sortState});
    }
    check(item,e){
        let {list,checkedAll} = this.state;
        let temp = 0;
        if(e.data.selected ==1){
            item.checked = true;
        }else{
            item.checked = false;
        }
        list.map((list)=>{
            if(list.checked){
                temp +=1;
            }
        });
        checkedAll = temp == list.length?true:false
        this.setState({list:list,checkedAll});
    }
    checkAll(e){
        let {list,checkedAll} = this.state;
        if(e.data.selected==1){
            list.map((item)=>{
                item.checked = true;
            });
            checkedAll = true;
        }else{
            list.map((item)=>{
                item.checked = false;
            });
            checkedAll = false;
        }
        this.setState({list,checkedAll});
    }
    render(){
        let {pager,sortState} =this.state;
        return(
            <div>
                <Layout mark = "cz" bread = {["充值记录","充值列表"]}>
                    <div className="search-div">
                        <RUI.Input placeholder = "请输入名称或用户名"/>
                        <RUI.Button className = "primary" >查询</RUI.Button>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-15">充值公司</td>
                                <td className="col-15">充值用户</td>
                                <td className="col-15">充值品牌</td>
                                <td className="col-15">充值金额</td>
                                <td className= {sortState==1?"col-15 sort-des":"col-15 sort-asc"} onClick = {this.sortFn}>
                                    <span className="m-r-5">充值时间</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className="col-15">充值类型</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>四川公司</td>
                                <td>张哥</td>
                                <td>一叶子</td>
                                <td>30000</td>
                                <td>2017-04-19 22:57:39</td>
                                <td>正向充值</td>
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