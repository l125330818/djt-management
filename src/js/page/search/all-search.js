/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import Badge  from 'antd/lib/badge';
import {hashHistory} from "react-router";
import DatePicker  from 'antd/lib/date-picker';
const { RangePicker } = DatePicker;
import moment from 'moment';
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
                sign:1,
                amountSort:1,
                selectType:1,
                startTime : moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
                endTime : moment(new Date()).format("YYYY-MM-DD"),
            },
            selectValue:[
                {key:"品牌查询",value:"1"},{key:"余额查询",value:2},
            ],
            defaultSelect:{key:"品牌查询",value:""},
            list:[{
                "order_no": "111111",
                "clientname": "成都俊美化妆品",
                "order_money": 20.0,
                "brand": "韩束" ,
                "order_time": "2017-12-12 17:50",
                "status": 1,
                "flag": 0
            },{
                "order_no": "111111",
                "clientname": "成都俊美化妆品",
                "order_money": 20.0,
                "brand": "韩束" ,
                "order_time": "2017-12-12 17:50",
                "status": 1,
                "flag": 0
            }],
            ids:[],
            checkedAll:false,
        };
        this.check = this.check.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.select = this.select.bind(this);
        this.query = this.query.bind(this);
        this.queryDetail = this.queryDetail.bind(this);
        this.addOrder = this.addOrder.bind(this);
        this.datePickerChange = this.datePickerChange.bind(this);
      }
    getList(){
        console.log(this.state.listRequest)
    }
    queryDetail(){
        hashHistory.push("orderDetail");
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
                return "待审核";
            case 2 :
                return "已受理";
            case 3 :
                return "已发货";
            case 4 :
                return "已完成";
            case 5 :
                return "已退回";
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
        this.setState({});
    }
    query(){
        let {listRequest} = this.state;
        console.log(listRequest)
    }
    addOrder(){
        hashHistory.push("addOrder");
    }
    disabledDate(current){
        return current && current.valueOf() > Date.now();
    }
    datePickerChange(e,d){
        let data = e.data;
        let {listRequest} = this.state;
        listRequest.startTime = d[0]
        listRequest.endTime = d[1]
        this.setState({listRequest},()=>{
            this.getList();
        });
    }
    render(){
        let {pager,list,checkedAll,selectValue,defaultSelect,listRequest} =this.state;
        return(
            <div>
                <Layout mark = "cx" bread = {["万能查询","万能查询"]}>
                    <div className="search-div">
                        <label className="m-l-r-10 line-32 left">查询类型：</label>
                        <RUI.Select  data = {selectValue}
                                     className = "w-90 rui-theme-1 line-32 left "
                                     callback = {this.select}
                                     value = {defaultSelect}/>
                        <label className="m-l-r-10 line-32 left">查询时间：</label>
                        <RangePicker onChange={this.datePickerChange}
                                     disabledDate={this.disabledDate}
                                     size = "large"
                                     allowClear ={false}
                                     value={[moment(listRequest.startTime, 'YYYY-MM-DD'),moment(listRequest.endTime, 'YYYY-MM-DD')]}
                                     defaultValue={[moment(listRequest.startTime, 'YYYY-MM-DD'),moment(listRequest.endTime, 'YYYY-MM-DD')]}/>
                        <RUI.Button onClick = {this.query} className = "primary" >查询</RUI.Button>
                        <div className="right">
                            <RUI.Button onClick = {this.export}>导出</RUI.Button>
                        </div>
                    </div>
                    {
                        listRequest.selectType == 1?
                            <div className = "search-div p-t-0">
                                <label className="m-l-r-10">品牌：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"company")} placeholder = "请输入品牌"/>
                                <label className="m-l-r-10">系列：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"company")} placeholder = "请输入系列"/>
                                <label className="m-l-r-10">商品：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"company")} placeholder = "请输入商品"/>
                            </div>
                            :
                            <div className = "search-div p-t-0">
                                <label className="m-l-r-10">金额：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"company")} placeholder = "请输入金额"/>
                            </div>
                    }


                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-15">
                                        <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>订单号</RUI.Checkbox>
                                    </td>
                                    <td className="col-10">公司名称</td>
                                    <td className="col-10">订单金额</td>
                                    <td className="col-10">订单品牌</td>
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
                                            <td>
                                                <RUI.Checkbox onChange = {this.check.bind(this,item)} selected = {item.checked?1:0}> {item.order_no}</RUI.Checkbox>
                                            </td>
                                            <td>{item.clientname}</td>
                                            <td>{item.order_money}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.order_time}</td>
                                            <td>{this.getState(item.status)}</td>
                                            <td>{this.getState(item.status)}</td>
                                            <td>{this.getState(item.status)}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.queryDetail}>查看&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;处理</a>
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