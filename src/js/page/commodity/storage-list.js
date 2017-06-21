/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import {storageList} from "../ajax/customerAjax";
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
                product:"",
                pageSize:10,
                pageNum:1,
                keyword:"",
                seq:"",
                companyName:localStorage.companyName || "",
                userId:localStorage.userid || "",
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
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo=1){
        let {pager} = this.state;
        storageList(this.state.listRequest).then((data)=>{
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
        listRequest.product = e.target.value;
    }
    render(){
        let {pager,sortState,list} =this.state;
        return(
            <div>
                <Layout mark = "rk" bread = {["入库记录","入库记录"]}>
                    <div className="search-div">
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入商品名称"/>
                        <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-10">商品名称</td>
                                <td className="col-10">品牌</td>
                                <td className="col-10">系列</td>
                                <td className="col-10">商品分类</td>
                                <td className="col-10">单位</td>
                                <td className="col-10">价格(元)</td>
                                <td className="col-10">入库数量</td>
                                <td className= {sortState==1?"col-15 sort-des":"col-15 sort-asc"}
                                    onClick = {this.sortFn.bind(this,"intime","sortState")}>
                                    <span className="m-r-5">入库时间</span>
                                    <i className="sort-bottom"/>
                                    <i className="sort-top"/>
                                </td>
                                <td className="col-10">经手人</td>
                                <td className="col-10">备注</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,i)=>{
                                    return(
                                        <tr key = {i}>
                                            <td>{item.product}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.series}</td>
                                            <td>{item.classify}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.price}</td>
                                            <td>{item.innum}</td>
                                            <td>{item.intime}</td>
                                            <td>{item.handler}</td>
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