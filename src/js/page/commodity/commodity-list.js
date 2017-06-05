/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import {commodityList} from "../ajax/commodityAjax";
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
                companyName:localStorage.companyName || "",
                brand:"",
                series:"",
                classify:"",
                goodsName:"",
                stdate : moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
                endate : moment(new Date()).format("YYYY-MM-DD"),
                keyword:"",
                pageNum:1,
                pageSize:10,

            },
            list:[]
        };
        this.add = this.add.bind(this);
        this.manageAttr = this.manageAttr.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.datePickerChange = this.datePickerChange.bind(this);
        this.search = this.search.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        commodityList(this.state.listRequest).then((data)=>{
            this.setState({list:data.dataList || []});
        })
    }
    add(){
        hashHistory.push("addCommodity");
    }
    manageAttr(){
        hashHistory.push("commodityAttr");
    }
    disabledDate(current){
        return current && current.valueOf() > Date.now();
    }
    datePickerChange(e,d){
        let {listRequest} = this.state;
        listRequest.stdate = d[0];
        listRequest.endate = d[1];
        listRequest.pageNum = 1;
        this.setState({listRequest},()=>{
            this.getList();
        });
    }
    checkDetail(item){
        hashHistory.push(`addCommodity?type=check&goodsId=${item.goodsId}`)
    }
    inputChange(type,e){
        let {listRequest} = this.state;
        listRequest[type] = e.target.value;
        this.setState({listRequest});
    }
    search(){
        let {listRequest} = this.state;
        listRequest.pageNum = 1;
        this.setState({listRequest},()=>{
            this.getList();
        });
    }
    render(){
        let {pager,listRequest,list} =this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品列表"]}>
                    <div className="search-div clearfix">
                        <div className="left">
                            <span>品牌：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"brand")} placeholder = "请输入品牌"/>
                            <span>系列：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"series")} placeholder = "请输入系列"/>
                            <span>分类：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"classify")} placeholder = "请输入分类"/>
                            <span>商品名称：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"goodsName")} placeholder = "请输入商品名称"/>
                            <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
                        </div>
                       <div className="right">
                           <RUI.Button>批量下架</RUI.Button>
                           <RUI.Button>批量删除</RUI.Button>
                           <RUI.Button onClick = {this.add} className = "primary">新增商品</RUI.Button>
                           <RUI.Button onClick = {this.manageAttr} className = "primary">属性管理</RUI.Button>

                       </div>
                    </div>
                    <div>
                        <RangePicker onChange={this.datePickerChange}
                                     disabledDate={this.disabledDate}
                                     size = "large"
                                     allowClear ={false}
                                     value={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}
                                     defaultValue={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}/>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-10">
                                        <RUI.Checkbox>商品名称</RUI.Checkbox>
                                    </td>
                                    <td className="col-8">品牌</td>
                                    <td className="col-10">系列</td>
                                    <td className="col-8">商品分类</td>
                                    <td className="col-8">单位</td>
                                    <td className="col-8">价格(元)</td>
                                    <td className="col-8">库存</td>
                                    <td className="col-8">销量</td>
                                    <td className="col-10">更新时间</td>
                                    <td className="col-8">状态</td>
                                    <td className="col-14">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,index)=>{
                                    return(
                                        <tr key = {index}>
                                            <td>
                                                <RUI.Checkbox>{item.goodsName}</RUI.Checkbox>
                                            </td>
                                            <td>{item.brand}</td>
                                            <td>{item.series}</td>
                                            <td>{item.classify}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.price}</td>
                                            <td>{item.goodsLeft}</td>
                                            <td>{item.sellNum}</td>
                                            <td>{item.updateTime}</td>
                                            <td>{item.status==0?"下架":"上架"}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.checkDetail.bind(this,item)}>查看&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;修改&nbsp; |</a>
                                                <a href="javascript:;">&nbsp;{item.status==0?"上架":"下架"}&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;删除</a>
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