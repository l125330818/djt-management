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
                totalNum:0,
            },
            listRequest:{
                keyword:"chargetime",
                query:"",
                seq:"desc",
                pageSize:10,
                pageNum:1,
                companyName:localStorage.companyName || "",
            },
            sortState:2,
            checkedAll:false,
            list:[]
        };
        this.sortFn = this.sortFn.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.search = this.search.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.goPage = this.goPage.bind(this);
        this.batchExport = this.batchExport.bind(this);
        this.check = this.check.bind(this);
        this.reset = this.reset.bind(this);
    }
    componentDidMount(){
        document.addEventListener("keyup",this.enterKey.bind(this));
        this.getList();
    }
    enterKey(e){
        if(e.keyCode == 13){
            let {listRequest} = this.state;
            listRequest.pageNum=1
            this.setState({},()=>{
                this.getList();
            });
        }
    }
    componentWillUnmount(){
        document.removeEventListener("keyup",this.enterKey.bind(this));
    }
	reset(){
        let obj = {
			keyword:"chargetime",
			query:"",
			seq:"desc",
			pageSize:10,
			pageNum:1,
			companyName:localStorage.companyName || "",
        };
        this.setState({
            listRequest:obj
        },()=>{
            this.getList();
        })
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
    sortFn(type,sortType){
        let {listRequest} = this.state;
        listRequest.keyword = type;
        this.state[sortType] = this.state[sortType]==1?2:1;
        listRequest.seq = listRequest.seq == "desc"?"asc":"desc"
        this.setState({},()=>{
            this.getList();
        });
    }
    batchExport(){
        let {list} = this.state;
        let arr = [];
        list.map((item)=>{
            if(item.checked){
                arr.push(item.id);
            }
        });
        if(!arr.length){
            RUI.DialogManager.alert("请选择需要导出的列表");
            return;
        }
        window.open(commonUrl + "/djt/web/export/rechargexp.do?id="+JSON.stringify(arr))
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
        let {pager,sortState,list,checkedAll,listRequest} =this.state;
        return(
            <div>
                <Layout mark = "cz" bread = {["充值记录","充值列表"]}>
                    <div className="search-div">
                        <RUI.Input   onChange = {this.inputChange}
                                     value = {listRequest.query}
                                     className = "w-280"
                                     placeholder = "请输入公司名称或用户名或充值品牌"/>
                        <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
                        <RUI.Button onClick = {this.reset} className = "primary" >重置</RUI.Button>
                        <div className="right">
                            <RUI.Button onClick = {this.batchExport}>批量导出</RUI.Button>
                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-15">
                                    <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>充值公司</RUI.Checkbox>
                                </td>

                                <td className="col-15">充值用户</td>
                                <td className="col-15">充值品牌</td>
                                <td className="col-10">充值金额</td>
                                <td className= {sortState==1?"col-15 sort-des":"col-15 sort-asc"}
                                    onClick = {this.sortFn.bind(this,"chargetime","sortState")}>
                                    <span className="m-r-5">充值时间</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className="col-10">充值类型</td>
                                <td className="col-10">经手人</td>
                                <td className="col-10">备注</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,i)=>{
                                    return(
                                        <tr key = {i} className={item.chargetype==1?"":"font-color-red"}>
                                            <td className="text-left p-l-15">
                                                <RUI.Checkbox onChange = {this.check.bind(this,item,i)}
                                                              selected = {item.checked?1:0}> {item.clientname}</RUI.Checkbox>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.money}</td>
                                            <td>{item.chargetime}</td>
                                            <td>{item.chargetype==1?"正向充值":"逆向充值"}</td>
                                            <td>{item.agentname}</td>
                                            <td>{item.remark || "无"}</td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        {
                            list.length==0 && <div className="no-data">暂时没有数据哦</div>
                        }
                        <Pager onPage ={this.goPage} {...pager}/>
                    </div>
                </Layout>
            </div>
        )
    }
}