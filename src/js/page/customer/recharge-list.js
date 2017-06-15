/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import {rechargeList} from "../ajax/customerAjax";
import Pubsub from "../../util/pubsub";

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
                keyword:"",
                query:"",
                pageSize:10,
                pageNum:1,
                companyName:localStorage.companyName || "",
            },
            sortState:1,
            checkedAll:false,
            list:[]
        };
        this.sortFn = this.sortFn.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.search = this.search.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo=1){
        let {pager} = this.state;
        rechargeList(this.state.listRequest).then((data)=>{
            pager.totalNum = data.count;
            pager.currentPage = pageNo;
            this.setState({list:data.dataList || []});
        })
    }
    goPage(page){
        let {listRequest} = this.state;
        listRequest.pageNum = page;
        this.setState({},()=>{
            this.getList(page);
        });
    }
    recharge(){

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
    search(){
        let {listRequest} = this.state;
        listRequest.pageNum = 1;
        this.setState({},()=>{
            this.getList();
        });
    }
    inputChange(e){
        let {listRequest} = this.state;
        listRequest.query = e.target.value;
    }
    render(){
        let {pager,sortState,list} =this.state;
        return(
            <div>
                <Layout mark = "cz" bread = {["充值记录","充值列表"]}>
                    <div className="search-div">
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入公司名称或用户名或充值品牌"/>
                        <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
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
                                <td className="col-15">经手人</td>
                                <td className="col-15">备注</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,i)=>{
                                    return(
                                        <tr key = {i}>
                                            <td>{item.clientname}</td>
                                            <td>{item.name}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.money}</td>
                                            <td>{item.chargetime}</td>
                                            <td>{item.chargetype==1?"正向充值":"逆向充值"}</td>
                                            <td className="col-15">经手人</td>
                                            <td className="col-15">{item.remark}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        <Pager onPage ={this.getList} {...pager}/>
                    </div>
                </Layout>
            </div>
        )
    }
}