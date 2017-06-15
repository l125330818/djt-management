/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import Data from "../../component/Data";
import {customerList} from "../ajax/customerAjax";
export default class List extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:0,
            },
            listRequest:{
                userid: localStorage.userid || "",
                query:"",
                companyName:localStorage.companyName || "",
                pageNum:1,
                selectType:1,
                pageSize:10
            },
            list:[],
            defaultSelect:{key:"正常",value:1},
            checkedAll:false,
        };
        this.recharge = this.recharge.bind(this);
        this.sortFn = this.sortFn.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.set = this.set.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.search = this.search.bind(this);
        this.select = this.select.bind(this);
        this.goPage = this.goPage.bind(this);
        this.batchExport = this.batchExport.bind(this);
        this.goPage = this.goPage.bind(this);
        this.level = localStorage.level;
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        customerList(this.state.listRequest).then((data)=>{
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
    recharge(clientId){
        hashHistory.push(`recharge?clientId=${clientId}`);
    }
    modify(clientId){
        hashHistory.push(`addCustomer?clientId=${clientId}`);
    }
    add(){
        hashHistory.push("addCustomer");
    }
    set(){

    }
    search(){
        let {listRequest} = this.state;
        listRequest.pageNum = 1;
        this.setState({listRequest},()=>{
            this.getList();
        });
    }
    inputChange(e){
        let {listRequest} = this.state;
        listRequest.query = e.target.value;
    }
    check(item,index,e){
        let {list,checkedAll} = this.state;
        let temp = 0;
        if(e.data.selected ==1){
            list[index].checked = true;
        }else{
            list[index].checked = false;
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
    sortFn(type){
        let sortNum = this.state.listRequest[type]==1?2:1;
        this.state.listRequest[type] = sortNum;
        this.setState({});
    }
    select(e){
        let {listRequest,defaultSelect} = this.state;
        defaultSelect = e;
        listRequest.selectType = e.value;
        console.log(listRequest)
    }
    goPage(pageNum){
        let {listRequest} = this.state;
        listRequest.pageNum = pageNum;
        this.setState({listRequest},()=>{
            this.getList();
        })
    }
    batchExport(){
        let {list} = this.state;
        let arr = [];
        list.map((item)=>{
            if(item.checked){
                arr.push(item.account);
            }
        });
        if(!arr.length){
            RUI.DialogManager.alert("请选择");
            return;
        }
    }
    checkDetail(clientId){
        hashHistory.push(`customerDetail?clientId=${clientId}`);
    }
    render(){
        let {pager,customerSort,list,checkedAll,listRequest,defaultSelect} =this.state;
        let level = this.level;
        return(
            <div>
                <Layout mark = "kh" bread = {["客户管理","客户列表"]}>
                    <div className="search-div">
                        <RUI.Input className = "w-280 "
                                   onChange = {this.inputChange}
                                   placeholder = "请输入要查询的姓名、公司名称、账号、地区"/>
                        <label className="m-l-r-10">余额情况：</label>
                        <RUI.Select  data = {[{key:"正常",value:1},{key:"异常",value:2}]}
                                     className = "w-70 rui-theme-1 "
                                     callback = {this.select}
                                     value = {defaultSelect}/>
                        <RUI.Button className = "primary" onClick = {this.search} >查询</RUI.Button>
                        {
                            level != 4 &&
                            <div className="right">
                                <RUI.Button onClick = {this.batchExport}>批量导出</RUI.Button>
                                <RUI.Button onClick = {this.set}>余额设置</RUI.Button>
                                <RUI.Button onClick = {this.add} className = "primary">新增客户</RUI.Button>
                            </div>
                        }

                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-15">
                                    <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>公司名称</RUI.Checkbox>
                                </td>
                                <td className="col-10">姓名</td>
                                <td className="col-15">帐号</td>
                                <td className="col-15">地区</td>
                                <td className= {listRequest.customerSort==1?"col-10 sort-des":"col-10 sort-asc"}
                                    onClick = {this.sortFn.bind(this,"customerSort")}>
                                    <span className="m-r-5">客户级别</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className= {listRequest.amountSort==1?"col-10 sort-des":"col-10 sort-asc"}
                                    onClick = {this.sortFn.bind(this,"amountSort")}>
                                    <span className="m-r-5">总金额</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className="col-10">余额情况</td>
                                <td className="col-15">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.map((item,index)=>{
                                    return(
                                        <tr key = {index}>
                                            <td className="text-left p-l-15">
                                                <RUI.Checkbox onChange = {this.check.bind(this,item,index)}
                                                              selected = {item.checked?1:0}> {item.clientName}</RUI.Checkbox>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.account}</td>
                                            <td>{item.area}</td>
                                            <td>{item.level}</td>
                                            <td>{item.money}</td>
                                            <td>{item.money}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.checkDetail.bind(this,item.clientId)}>查看&nbsp;</a>
                                                {
                                                    level != 4 &&
                                                    <a href="javascript:;" onClick = {this.modify.bind(this,item.clientId)}>| &nbsp;修改&nbsp; </a>
                                                }
                                                {
                                                    (level != 2 && level !=3 && level != 4) &&
                                                    <a href="javascript:;" onClick = {this.recharge.bind(this,item.clientId)}>| &nbsp;充值&nbsp; </a>
                                                }
                                                {
                                                    level != 4 &&
                                                    <a href="javascript:;">| &nbsp;禁用</a>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        <Pager onPage ={this.goPage} {...pager}/>
                    </div>
                </Layout>
            </div>
        )
    }
}