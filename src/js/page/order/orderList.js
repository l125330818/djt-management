/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import Badge  from 'antd/lib/badge';
import 'antd/lib/badge/style/css';
import {hashHistory} from "react-router";
import {orderList,unRead} from "../ajax/orderAjax";
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
                companyName:localStorage.companyName || "",
                keyword:"",
                query:"",
                pageNum:1,
                pageSize:10,
                type:1,
            },
            selectValue:[
                {key:"全部",value:""},{key:"待审核",value:1},
                {key:"待受理",value:2},{key:"待发货",value:3},
                {key:"作废",value:4},{key:"已完成",value:5}
            ],
            defaultSelect:{key:"全部",value:""},
            list:[],
            ids:[],
            checkedAll:false,
            unRead:{
                order:0,
                backOrder:0
            }
        };
        this.check = this.check.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.select = this.select.bind(this);
        this.query = this.query.bind(this);
        this.queryDetail = this.queryDetail.bind(this);
        this.addOrder = this.addOrder.bind(this);
        this.goPage = this.goPage.bind(this);
      }
    componentDidMount(){
        this.getList();
        this.getUnread();
    }
    getUnread(){
        unRead({companyName:localStorage.companyName || ""}).then((data)=>{
            console.log(data)
            this.setState({
                unRead:data
            })
        })
    }
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        orderList(this.state.listRequest).then((data)=>{
            pager.totalNum = data.count;
            pager.currentPage = pageNo;
            this.setState({list:data.dataList || [],});
        })
    }
    goPage(page){
        let {listRequest} = this.state;
        listRequest.pageNum = page;
        this.setState({},()=>{
            this.getList(page);
        });
    }
    queryDetail(id){
        hashHistory.push(`orderDetail?orderNo=${id}`);
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
    getState(type){
        switch(type * 1){
            case 1 :
                return "待受理";
            case 2 :
                return "待发货";
            case 3 :
                return "待审核";
            case 4 :
                return "已完成";
            case 0 :
                return "已退回";
            case -2 :
                return "待审核";
            case -1 :
                return "已拒绝";
            default:
                return "";
        }
    }
    inputChange(e){
        let {listRequest} = this.state;
        listRequest.keyword = e.target.value;
    }
    select(e){
        let {listRequest,defaultSelect} = this.state;
        defaultSelect = e;
        listRequest.selectType = e.value;
        console.log(listRequest)
    }
    query(){
        let {listRequest} = this.state;
        listRequest.pageNum = 1;
        this.setState({listRequest},()=>{
            this.getList();
        });
    }
    addOrder(){
        hashHistory.push("addOrder");
    }
    typeClick(type){
        let {listRequest} = this.state;
        listRequest.type = type;
        this.setState({},()=>{
            this.getList(1);
        });
    }
    render(){
        let {pager,list,checkedAll,selectValue,defaultSelect,unRead,listRequest} =this.state;
        return(
            <div>
                <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                    <div className="p-l-15">
                        <RUI.Button onClick = {this.typeClick.bind(this,1)} className = {listRequest.type==1?"primary relative":"relative"} >
                            <span>订货</span>
                            <Badge overflowCount = {99} count={unRead.order} />
                        </RUI.Button>
                        <RUI.Button onClick = {this.typeClick.bind(this,-1)} className = {listRequest.type==-1?"primary relative":"relative"} >
                            <span>退货</span>
                            <Badge overflowCount = {99} count={unRead.backOrder} />
                        </RUI.Button>
                    </div>
                    <div className="search-div">
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入订单号或公司名称"/>
                        <label className="m-l-r-10">订单状态：</label>
                        <RUI.Select  data = {selectValue}
                                     className = "w-90 rui-theme-1 "
                                     callback = {this.select}
                                     value = {defaultSelect}/>

                        <RUI.Button onClick = {this.query} className = "primary" >查询</RUI.Button>
                        <div className="right">
                            <RUI.Button  className = "primary" onClick = {this.addOrder}>添加订单</RUI.Button>
                            <RUI.Button onClick = {this.export}>导出</RUI.Button>
                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-15">
                                        <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>订单号</RUI.Checkbox>
                                    </td>
                                    <td className="col-10">公司名称</td>
                                    <td className="col-10">订单金额</td>
                                    <td className="col-10">下单时间</td>
                                    <td className="col-10">状态</td>
                                    <td className="col-10">备注</td>
                                    <td className="col-10">经手人</td>
                                    <td className="col-15">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,index)=>{
                                    return(
                                        <tr key = {index}>
                                            <td className="text-left p-l-15">
                                                <RUI.Checkbox onChange = {this.check.bind(this,item)}
                                                              selected = {item.checked?1:0}> {item.orderno}</RUI.Checkbox>
                                            </td>
                                            <td>{item.clientname}</td>
                                            <td>{item.money}</td>
                                            <td>{item.ordertime}</td>
                                            <td>{this.getState(item.status)}</td>
                                            <td>{item.remark}</td>
                                            <td>{item.handler}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.queryDetail.bind(this,item.orderno)}>查看&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;处理</a>
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