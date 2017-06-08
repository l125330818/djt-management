/**
 * Created by Administrator on 2017-4-19.
 */
/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import {noticeList} from "../ajax/noticeAjax";
import Pubsub from "../../util/pubsub";
export default class List extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            pager:{
                currentPage:10,
                pageSize:1,
                totalNum:0,
            },
            listRequest:{
                companyName:localStorage.companyName || "",
                keyWord:"",
                query:"",
                pageNum:1,
                pageSize:10,
            },
            sortState:1,
            list:[],
            checkedAll:false,
        };
        this.recharge = this.recharge.bind(this);
        this.sortFn = this.sortFn.bind(this);
        this.search = this.search.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.batchDelete = this.batchDelete.bind(this);
        this.goPage = this.goPage.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo=1){
        let {listRequest,pager} = this.state;
        noticeList(listRequest).then((data)=>{
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
        hashHistory.push("recharge");
    }
    add(){
        hashHistory.push("addNotice");
    }
    sortFn(){
        this.setState({sortState:!this.state.sortState});
    }
    checkDetail(item){
        hashHistory.push(`addNotice?type=check&activityId=${item.activityid}`)
    }
    modify(item){
        hashHistory.push(`addNotice?type=edit&activityId=${item.activityid}`)
    }
    search(){
        let {listRequest} = this.state;
        listRequest.pageNum = 1;
        this.setState({},()=>{
            this.getList();
        });
    }
    inputChange(type,e){
        let {listRequest} = this.state;
        listRequest[type] = e.target.value;
        this.setState({});
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
    batchDelete(){
        let {list} = this.state;
        let _this = this;
        let arr = [];
        list.map((item)=>{
            if(item.checked){
                arr.push(item.activityid);
            }
        });
        if(!arr.length){
            RUI.DialogManager.alert("请选择商品");
            return;
        }
        this.deleteAjax(arr);
    }
    delete(item){
        let arr = [];
        arr.push(item.activityid);
        this.deleteAjax(arr);
    }
    deleteAjax(id){
        let _this = this;
        RUI.DialogManager.confirm({
            message:"您确定要删除吗？",
            title:"删除活动",
            submit(){
                $.ajax({
                    url:commonUrl + "/djt/web/activity/deleteactivity.do",
                    type:"post",
                    dataType:"json",
                    data:{activityid:JSON.stringify(id)},
                    success(data){
                        if(data.status == "0000"){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            let {listRequest} = _this.state;
                            listRequest.pageNum = 1;
                            _this.setState({checkedAll:false},()=>{
                                _this.getList();
                            });
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.msg]);
                        }
                    }
                })
            }
        });
    }
    render(){
        let {pager,sortState,list,checkedAll} =this.state;
        return(
            <div>
                <Layout mark = "tz" bread = {["通知管理","通知列表"]}>
                    <div className="search-div">
                        <RUI.Input onChange = {this.inputChange.bind(this,"query")} placeholder = "请输入主题内容"/>
                        <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
                        <div className="right">
                            <RUI.Button onClick = {this.add} >批量下架</RUI.Button>
                            <RUI.Button onClick = {this.batchDelete} >批量删除</RUI.Button>
                            <RUI.Button onClick = {this.add} className = "primary">新增通知</RUI.Button>
                        </div>
                    </div>
                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-10">
                                    <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>通知类型</RUI.Checkbox>
                                </td>
                                <td className="col-15">通知主题</td>
                                <td className="col-15">
                                    <span className="m-r-5">上线时间</span>
                                </td>
                                <td className="col-15">
                                    <span className="m-r-5">下线时间</span>
                                </td>
                                <td className="col-10">展示位置</td>
                                <td className="col-10">推广范围</td>
                                <td className="col-10">状态</td>
                                <td className="col-15">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                list.map((item,i)=>{
                                    return(
                                        <tr key = {i}>
                                            <td>
                                                <RUI.Checkbox onChange = {this.check.bind(this,item)}
                                                              selected = {item.checked?1:0}> {item.type}</RUI.Checkbox>
                                            </td>
                                            <td>{item.theme}</td>
                                            <td>{item.uptime}</td>
                                            <td>{item.downtime}</td>
                                            <td>{item.location}</td>
                                            <td>{item.status==0?"上线":"下线"}</td>
                                            <td>{item.ranged}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.checkDetail.bind(this,item)}>查看&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;{item.status==0?"下线":"上线"}&nbsp; |</a>
                                                <a href="javascript:;" onClick = {this.delete.bind(this,item)}>&nbsp;删除</a>
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