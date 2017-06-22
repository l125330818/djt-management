/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";

import LimitInput from "../../component/limitInput";
import {orderDetail,getOrderNo} from "../ajax/orderAjax";
import {hashHistory} from "react-router";
import {customerList} from "../ajax/customerAjax";
import {commodityList,getCompany} from "../ajax/commodityAjax";
let qqReg = /^\d+$/;
let accountReg = /^[0-9a-zA-Z]+$/g;
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
            companyListRequest:{
                userid: localStorage.userid || "",
                query:"",
                companyName:localStorage.companyName || "",
                pageNum:1,
                selectType:1,
                pageSize:1000000,
                keyword:"",
                seq:""
            },
            goodsRequest:{
                companyName:localStorage.companyName || "",
                brand:"",
                series:"",
                classify:"",
                goodsName:"",
                stdate : "",
                endate : "",
                keyword:"",
                pageNum:1,
                seq:"",
                pageSize:10000,

            },
            addRequest:{
                companyName:localStorage.companyName || "",
                orderNo:"DH13213123",
                goodsInfo:[],
                remark:"备注一下",
                clientId:"",
                type:this.props.location.query.type,
            },
            defaultSelect:{key:"全部",value:""},
            list:[],
            ids:[],
            companyList:[],
            goodsList:[],
            companySelect:{key:'无',value:'0'},
            goodsSelect:{key:'无',value:'0'},
            companyShow:false,
            checkedAll:false,
            orderNo:"",
        };
        this.selectCompany = this.selectCompany.bind(this);
        this.orderNoChange = this.orderNoChange.bind(this);
        this.saveData = this.saveData.bind(this);
        this.orderNo = this.props.location.query.orderNo;
        this.type = this.props.location.query.type;
    }

    componentDidMount() {
        if(this.orderNo){
            this.getDetail();
        }
        this.getOrderNo();
    }
    getOrderNo(){
        getOrderNo().then((data)=>{
            let {addRequest} = this.state;
            addRequest.orderNo = data;
            this.setState({})
        })
    }
    getDetail(){
        let request = {orderNo:this.orderNo};
        orderDetail(request).then((data)=>{
            this.setState({
                list:data.dataList,
            },()=>{
                this.getTotalPrice();
            });
        });
    }
    getTotalPrice(){
        let {list} = this.state;
        let totalPrice = 0;
        list.map((item)=>{
            totalPrice += item.price * item.count;
        });
        this.setState({totalPrice});
    }
    inputChange(item,type,e){
        let {list} = this.state;
        item[type] = e.target.value;
        item.totalPrice = item.price * e.target.value;
        this.setState({list},()=>{
            this.getTotalPrice();
        });
    }

    selectCompany(type,e){
        let {list,addRequest} = this.state;
        if(type == "goodsSelect"){
            list.push(Object.assign(e.detail,{count:1}));
        }else{
            addRequest.addRequest = e.value;
        }
        let jsonStr = JSON.stringify(list);
        let arr = JSON.parse(jsonStr);
        this.state[type] =e;
        this.setState({list:arr},()=>{
            this.getTotalPrice();
        });
    }
    filterHandle(type,e){
        let {goodsRequest} = this.state;

        if(type == "company"){
            let request = {companyName:localStorage.companyName,query:e}
            getCompany(request).then((data)=>{
                let companyList = [];
                data.map((item)=>{
                    companyList.push({key:item.clientname,value:item.clientId});
                });
                this.setState({companyList});
            })
        }else if(type == "goods"){
            goodsRequest.goodsName = e;
            commodityList(goodsRequest).then((data)=>{
                let dataList = data.dataList;
                let goodsList = [];
                dataList.map((item)=>{
                    goodsList.push({key:item.goodsname,value:item.goodsId,detail:item});
                });
                this.setState({goodsList});
            })
        }
    }
    orderNoChange(type,e){
        let {addRequest} = this.state;
        addRequest[type] = e.target.value;
        this.setState({});
    }
    delete(index){
        let {list} = this.state;
        list.splice(index,1);
        this.setState({list},()=>{
            this.getTotalPrice();
        });
    }
    saveData(){
        let {list,addRequest} = this.state;
        let arr = [];
        list.map((item)=>{
            arr.push({id:item.goodsid,num:item.count});
        });
        addRequest.goodsInfo = JSON.stringify(arr);
        $.ajax({
            url:commonUrl + "/djt/web/ordermang/makeorder.do",
            type:"post",
            dataType:"json",
            data:addRequest,
            success(){

            }
        })
console.log(addRequest,arr)
    }
    render(){
        let {list,goodsList,goodsSelect,defaultSelect,companyList,companySelect,orderNo,totalPrice,addRequest} =this.state;
        return(
            <div>
                <Layout mark = "dd" bread = {["订单管理",this.type==1?"添加订货单":"添加退货单"]}>
                    <div className="search-div relative">
                        <label className=""><span className="require">*</span>公司名称：</label>
                        <RUI.Select
                            data={companyList}
                            value={companySelect}
                            filter={true}
                            className="rui-theme-1 w-200"
                            callback = {this.selectCompany.bind(this,"companySelect")}
                            stuff={true}
                            filterCallback={this.filterHandle.bind(this,"company")}>
                        </RUI.Select>
                        <label className="m-l-20"><span className="require">*</span>商品名称：</label>
                        <RUI.Select
                            data={goodsList}
                            value={goodsSelect}
                            filter={true}
                            className="rui-theme-1 w-200"
                            callback = {this.selectCompany.bind(this,"goodsSelect")}
                            stuff={true}
                            filterCallback={this.filterHandle.bind(this,"goods")}>
                        </RUI.Select>
                        <label  className="m-l-20">时间：</label>
                        <LimitInput   value = {new Date().Format("yyyy-MM-dd hh : mm : ss")}
                                      require = {true}
                                      disable = {true}
                         />
                        <label  className="m-l-20">订单号：</label>
                        <RUI.Input   value = {addRequest.orderNo}
                                      onChange = {this.orderNoChange.bind(this,"orderNo")} />
                    </div>
                    <div className="total-div">
                        <h3>
                            合计:
                            <span className="font-color-red">{totalPrice}</span>
                            <label  className="m-l-20">备注：</label>
                            <RUI.Input   onChange = {this.orderNoChange.bind(this,"remark")} />
                        </h3>

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
                                                {item.goodsname}
                                            </td>
                                            <td>{item.brand}</td>
                                            <td>{item.series}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                <LimitInput   value = {item.count}
                                                              className = "w-70"
                                                              reg = {qqReg}
                                                              onChange = {this.inputChange.bind(this,item,"count")}
                                                              />
                                            </td>
                                            <td>{(item.count * item.price).toFixed(2)}</td>
                                            <td>{item.goodsnum}</td>
                                            <td>{item.barcode}</td>

                                            <td>
                                                <a href="javascript:;" onClick = {this.delete.bind(this,index)}>删除</a>
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
                                            onClick={this.saveData}>{this.type==1?"生成订货单":"生成退货单"}</RUI.Button>
                            </div>
                        </div>
                    </div>
                </Layout>
            </div>
        )
    }
}