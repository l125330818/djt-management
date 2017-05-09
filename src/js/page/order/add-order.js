/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import Badge  from 'antd/lib/badge';
import LimitInput from "../../component/limitInput";
import {hashHistory} from "react-router";
let numReg = /^\d+$/;
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
                selectType:1
            },
            selectValue:[
                {key:"全部",value:""},{key:"待审核",value:1},
                {key:"待受理",value:2},{key:"待发货",value:3},
                {key:"作废",value:4},{key:"已完成",value:5}
            ],
            defaultSelect:{key:"全部",value:""},
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
    }
    getList(){}
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
    inputChange(item,type,e){
        let {list} = this.state;
        item[type] = e.target.value;
        this.setState({list});
    }
    select(e){
        let {listRequest,defaultSelect} = this.state;
        defaultSelect = e;
        listRequest.selectType = e.value;
        console.log(listRequest)
    }
    query(){
        let {listRequest} = this.state;
        console.log(listRequest)
    }
    render(){
        let {list,checkedAll,selectValue,defaultSelect} =this.state;
        return(
            <div>
                <Layout mark = "dd" bread = {["订单管理","添加订货单"]}>
                    <div className="search-div">
                        <label className="m-l-r-10">公司：</label>
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入公司名称"/>
                        <label className="m-l-r-10">商品：</label>
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入公司名称"/>
                        <label className="m-l-r-10">时间：</label>
                        <RUI.Input   onChange = {this.inputChange} placeholder = "请输入公司名称"/>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-10">商品名称</td>
                                <td className="col-10">品牌</td>
                                <td className="col-10">系列</td>
                                <td className="col-10">单位</td>
                                <td className="col-10">价格</td>
                                <td className="col-10">数量</td>
                                <td className="col-10">总价</td>
                                <td className="col-10">商品编码</td>
                                <td className="col-10">条形码</td>
                                <td className="col-10">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.length>0 && list.map((item,index)=>{
                                    return(
                                        <tr key = {index}>
                                            <td>
                                                {item.clientname}
                                            </td>
                                            <td>{item.clientname}</td>
                                            <td>{item.order_money}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.order_time}</td>
                                            <td>
                                                <LimitInput   value = {item.order_money}
                                                              className = "w-70"
                                                              onChange = {this.inputChange.bind(this,item,"order_money")}
                                                              reg = {numReg} />
                                            </td>
                                            <td>{item.order_time}</td>
                                            <td>{item.order_time}</td>
                                            <td>{item.order_time}</td>

                                            <td>
                                                <a href="javascript:;" onClick = {this.delete}>删除</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        <div className="footer js-footer">
                            <div className="left">
                                <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                                <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                            onClick={this.recharge}>生成订单</RUI.Button>
                            </div>
                        </div>
                    </div>
                </Layout>
            </div>
        )
    }
}