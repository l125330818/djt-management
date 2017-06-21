/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import DatePicker  from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import {balanceList,goodsList} from "../ajax/searchAjax";
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
                totalNum:0,
            },
            listRequest:{
                companyName:localStorage.companyName || "",
                brand:"",
                series:"",
                product:"",
                stdate : moment(new Date()-86400*100*1000).format("YYYY-MM-DD"),
                endate : moment(new Date()).format("YYYY-MM-DD"),
                pageNum:1,
                pageSize:10
            },
            selectValue:[
                {key:"品牌跟踪",value:"1"},{key:"余额跟踪",value:2},
            ],
            defaultSelect:{key:"品牌跟踪",value:""},
            list:[],
            ids:[],
            checkedAll:false,
            selectType:1,
            sumBalance:0,
            sumUpmoney:0,
            money:0,
            left:0,
        };
        this.check = this.check.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.select = this.select.bind(this);
        this.query = this.query.bind(this);
        this.queryDetail = this.queryDetail.bind(this);
        this.addOrder = this.addOrder.bind(this);
        this.datePickerChange = this.datePickerChange.bind(this);
        this.goPage = this.goPage.bind(this);
      }
    componentDidMount(){
        this.getGoodsList();
        // this.getBalanceList();
    }
    getGoodsList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        goodsList(this.state.listRequest).then((data)=>{
            pager.totalNum = data.count;
            pager.currentPage = pageNo;
            this.setState({
                list:data.dataList || [],
                money:data.money || 0,
                left:data.left || 0,
            });
        })
    }
    getBalanceList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        balanceList(this.state.listRequest).then((data)=>{
            pager.totalNum = data.count;
            pager.currentPage = pageNo;
            this.setState({
                list:data.dataList || [],
                sumBalance:data.sumBalance || 0,
                sumUpmoney:data.sumUpmoney || 0,
            });
        })
    }
    goPage(page){
        let {listRequest,selectType} = this.state;
        listRequest.pageNum = page;
        this.setState({},()=>{
            if(selectType == 1){
                this.getGoodsList(page);
            }else{
                this.getBalanceList(page);
            }
        });
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
    inputChange(type,e){
        let {listRequest} = this.state;
        listRequest[type] = e.target.value;
        this.setState({});
    }
    select(e){
        let {defaultSelect,listRequest} = this.state;
        defaultSelect = e;
        listRequest.pageNum = 1;
        this.setState({selectType:e.value},()=>{
            if(e.value == 1){
                this.getGoodsList();
            }else{
                this.getBalanceList();
            }
        });
    }
    query(){
        let {listRequest,selectType} = this.state;
        listRequest.pageNum = 1;
        this.setState({},()=>{
            if(selectType == 1){
                this.getGoodsList();
            }else{
                this.getBalanceList();
            }
        });
    }
    addOrder(){
        hashHistory.push("addOrder");
    }
    disabledDate(current){
        return current && current.valueOf() > Date.now();
    }
    datePickerChange(e,d){
        let data = e.data;
        let {selectType} = this.state;
        let {listRequest} = this.state;
        listRequest.stdate = d[0]
        listRequest.endate = d[1]
        this.setState({listRequest},()=>{
            if(selectType == 1){
                this.getGoodsList();
            }else{
                this.getBalanceList();
            }
        });
    }
    render(){
        let {pager,list,checkedAll,selectValue,defaultSelect,listRequest,selectType,money,sumBalance,sumUpmoney} =this.state;
        return(
            <div>
                <Layout mark = "cx" bread = {["万能查询","万能查询"]}>
                    <div className="search-div">
                        <label className="m-l-r-10 line-32 left">查询类型：</label>
                        <RUI.Select  data = {selectValue}
                                     className = "w-90 rui-theme-1 left "
                                     callback = {this.select}
                                     value = {defaultSelect}/>
                        <label className="m-l-r-10 line-32 left">查询时间：</label>
                        <RangePicker onChange={this.datePickerChange}
                                     disabledDate={this.disabledDate}
                                     size = "large"
                                     allowClear ={false}
                                     value={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}
                                     defaultValue={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}/>
                        <RUI.Button onClick = {this.query} className = "primary" >查询</RUI.Button>
                        {
                            selectType==1?
                                <label className="m-l-r-10 line-32">合计：<span className="require">{money}</span></label>
                                :
                                <label className="m-l-r-10 line-32">
                                    合计上账金额：
                                    <span className="require">{sumUpmoney}</span>
                                    合计金额：
                                    <span className="require">{sumBalance}</span>
                                </label>

                        }
                        <div className="right">
                            <RUI.Button onClick = {this.export}>导出</RUI.Button>
                        </div>
                    </div>
                    {
                        selectType == 1?
                            <div className = "search-div p-t-0">
                                <label className="m-l-r-10">品牌：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"brand")} placeholder = "请输入品牌"/>
                                <label className="m-l-r-10">系列：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"series")} placeholder = "请输入系列"/>
                                <label className="m-l-r-10">商品：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"product")} placeholder = "请输入商品"/>
                            </div>
                            :
                            <div className = "search-div p-t-0">
                                <label className="m-l-r-10">品牌：</label>
                                <RUI.Input   onChange = {this.inputChange.bind(this,"brand")} placeholder = "请输入品牌"/>
                            </div>
                    }


                    <div className="order-content">
                        <table className="table">
                            <thead>
                            {
                                selectType == 1?
                                    <tr>
                                        <td className="col-15">
                                            <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>商品名称</RUI.Checkbox>
                                        </td>
                                        <td className="col-10">品牌</td>
                                        <td className="col-10">系列</td>
                                        <td className="col-10">商品分类</td>
                                        <td className="col-10">单位</td>
                                        <td className="col-10">价格(元)</td>
                                        <td className="col-10">数量</td>
                                        <td className="col-10">对象</td>
                                        <td className="col-15">时间</td>
                                    </tr>
                                    :
                                    <tr>
                                        <td className="col-15">
                                            <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>品牌</RUI.Checkbox>
                                        </td>
                                        <td className="col-10">上账金额</td>
                                        <td className="col-10">金额</td>
                                        <td className="col-10">时间</td>
                                    </tr>
                            }
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,index)=>{
                                    return(
                                        selectType==1?
                                            <tr key = {index}>
                                                <td>
                                                    <RUI.Checkbox
                                                        onChange = {this.check.bind(this,item)}
                                                        selected = {item.checked?1:0}> {item.goodsname}</RUI.Checkbox>
                                                </td>
                                                <td>{item.brand}</td>
                                                <td>{item.series}</td>
                                                <td>{item.classify}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.price}</td>
                                                <td>{`${item.count}`}</td>
                                                <td>{item.clientName || "无"}</td>
                                                <td>
                                                    {item.ordertime}
                                                </td>
                                            </tr>
                                            :<tr key = {index}>
                                            <td>
                                                <RUI.Checkbox
                                                    onChange = {this.check.bind(this,item)}
                                                    selected = {item.checked?1:0}> {item.brand}</RUI.Checkbox>
                                            </td>
                                            <td>{item.upmoney}</td>
                                            <td>{item.money}</td>
                                            <td>{item.date}</td>
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