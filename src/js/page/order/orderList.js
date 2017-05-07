/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import Badge  from 'antd/lib/badge';
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
      }
    getList(){}
    query(){
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
    render(){
        let {pager,list,checkedAll} =this.state;
        return(
            <div>
                <Layout mark = "dd" bread = {["订单管理","订单列表"]}>
                    <div className="p-l-15">
                        <RUI.Button className = "primary relative" >
                            <span>订货</span>
                            <Badge overflowCount = {99} count={8} />
                        </RUI.Button>
                        <RUI.Button className = "primary relative" >
                            <span>退货</span>
                            <Badge overflowCount = {99} count={100} />
                        </RUI.Button>
                    </div>
                    <div className="search-div">
                        <RUI.Input placeholder = "请输入订单号或公司名称"/>
                        <RUI.Button className = "primary" >查询</RUI.Button>
                        <div className="right">
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
                                    <td className="col-15">公司名称</td>
                                    <td className="col-15">订单金额</td>
                                    <td className="col-15">订单品牌</td>
                                    <td className="col-15">下单时间</td>
                                    <td className="col-10">状态</td>
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
                                                 <td>{item.order_time}</td>
                                            <td>{item.brand}</td>
                                            <td>{this.getState(item.status)}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.query}>查看&nbsp;|</a>
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