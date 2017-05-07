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
                customerSort:1,
                amountSort:1,
                selectType:1
            },
            list:[{
                "clientname": "成都俊美化妆品",
                "pername": "吴系挂",
                "account": "zhangsan123" ,
                "area": "XX省XX市XX区",
                "level": 1,
                "money":1000.0
                },
                {
                    "clientname": "成都俊美化妆品",
                    "pername": "吴系挂",
                    "account": "zhangsan123" ,
                    "area": "XX省XX市XX区",
                    "level": 1,
                    "money":1000.0
                },
            ],
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
    set(){

    }
    search(){
        let {listRequest} = this.state;
        console.log(listRequest)
    }
    inputChange(e){
        let {listRequest} = this.state;
        listRequest.keyword = e.target.value;
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
    render(){
        let {pager,customerSort,list,checkedAll,listRequest,defaultSelect} =this.state;
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
                        <div className="right">
                            <RUI.Button onClick = {this.set}>余额设置</RUI.Button>
                            <RUI.Button onClick = {this.add} className = "primary">新增客户</RUI.Button>

                        </div>
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
                                            <td>
                                                <RUI.Checkbox onChange = {this.check.bind(this,item)}
                                                              selected = {item.checked?1:0}> {item.clientname}</RUI.Checkbox>
                                            </td>
                                            <td>{item.pername}</td>
                                            <td>{item.account}</td>
                                            <td>{item.area}</td>
                                            <td>{item.level}</td>
                                            <td>{item.money}</td>
                                            <td>{item.money}</td>
                                            <td>
                                                <a href="javascript:;">查看&nbsp;|</a>
                                                <a href="javascript:;" onClick = {this.recharge}>&nbsp;充值&nbsp; |</a>
                                                <a href="javascript:;">&nbsp;禁用</a>
                                            </td>
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