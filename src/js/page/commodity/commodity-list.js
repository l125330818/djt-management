/**
 * Created by luojie on 2017/4/12 14:24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {hashHistory} from "react-router";
import {commodityList} from "../ajax/commodityAjax";
import DatePicker  from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import Pubsub from "../../util/pubsub";
import LabelInput from "../../component/label-input";
let qqReg = /^\d+$/;

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
                classify:"",
                goodsName:"",
                // stdate : moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
                stdate : "2017-01-01",
                endate : moment(new Date()).format("YYYY-MM-DD"),
                keyword:"",
                pageNum:1,
                seq:"",
                pageSize:10,

            },
            checkedAll:false,
            list:[],
            saleSort:2,
            inNum:0,
            goodsId:"",
            storageType:1,
        };
        this.add = this.add.bind(this);
        this.manageAttr = this.manageAttr.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.datePickerChange = this.datePickerChange.bind(this);
        this.search = this.search.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.batchDelete = this.batchDelete.bind(this);
        this.goPage = this.goPage.bind(this);
        this.addStorage = this.addStorage.bind(this);
        this.addStorageSubmit = this.addStorageSubmit.bind(this);
        this.batchExport = this.batchExport.bind(this);
        this.reset = this.reset.bind(this);
    }
    componentDidMount(){
        document.addEventListener("keyup",this.enterKey.bind(this));
        this.getList();
    }
    enterKey(e){
        if(e.keyCode == 13){
            let {listRequest} = this.state;
            listRequest.pageNum=1
            this.setState({},()=>{
                this.getList();
            });
        }
    }
    componentWillUnmount(){
        document.removeEventListener("keyup",this.enterKey.bind(this));
    }
	reset(){
        let requestObj = {
			companyName:localStorage.companyName || "",
			brand:"",
			series:"",
			classify:"",
			goodsName:"",
			// stdate : moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
			stdate : "2017-01-01",
			endate : moment(new Date()).format("YYYY-MM-DD"),
			keyword:"",
			pageNum:1,
			seq:"",
			pageSize:10,
        };
        this.setState({
            listRequest:requestObj
        },()=>{
            this.getList();
        })
    }
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        commodityList(this.state.listRequest).then((data)=>{
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
    add(){
        hashHistory.push("addCommodity");
    }
    manageAttr(){
        hashHistory.push("commodityAttr");
    }
	batchExport(){
        if(!this.state.list.length){
			Pubsub.publish("showMsg",["wrong","没有数据可导出"]);
			return;
        }
        let {brand,series,classify,goodsName,stdate,endate} = this.state.listRequest;
        let requestStr = `id=&isall=1&companyName=${localStorage.companyName}&brand=${brand}&series=${series}&classify=${classify}&goodsName=${goodsName}&stdate=${stdate}&endate=${endate}`;
		window.open(commonUrl + "/djt/web/export/goodsexp.do?"+requestStr);
        console.log(commonUrl + "/djt/web/export/goodsexp.do?" + requestStr)
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
    modify(item){
        hashHistory.push(`addCommodity?type=edit&goodsId=${item.goodsid}`)
    }
    checkDetail(item){
        hashHistory.push(`addCommodity?type=check&goodsId=${item.goodsid}`)
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
    check(item,index,e){
        let {list,checkedAll} = this.state;
        let temp = 0;
        if(e.data.selected ==1){
            list[index].checked = true;
        }else{
            list[index].checked = false;
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
                arr.push(item.goodsid);
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
        arr.push(item.goodsid);
        this.deleteAjax(arr);
    }
    deleteAjax(id){
        let _this = this;
        RUI.DialogManager.confirm({
            message:"您确定要删除吗？",
            title:"删除商品",
            submit(){
                $.ajax({
                    url:commonUrl + "/djt/web/goodsmang/batchdelete.do",
                    type:"post",
                    dataType:"json",
                    data:{goodsId:JSON.stringify(id)},
                    success(data){
                        if(data.status == "0000"){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            let {pager} = _this.state;
                            _this.setState({checkedAll:false},()=>{
                                _this.getList(pager.currentPage);
                            });
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.msg]);
                        }
                    }
                })
            }
        });
    }
    groundAjax(id,status){
        let {pager} = this.state;
        let _this = this;
        $.ajax({
            url:commonUrl + "/djt/web/goodsmang/batchupdate.do",
            type:"post",
            dataType:"json",
            data:{goodsId:JSON.stringify(id),status:status},
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success",status==1?"下架成功":"上架成功"]);
                    _this.setState({checkedAll:false});
                    _this.getList(pager.currentPage);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        })
    }
    batchGround(type){
        let {list} = this.state;
        let arr = [];
        list.map((item)=>{
            if(item.checked){
                arr.push(item.goodsid);
            }
        });
        if(!arr.length){
            RUI.DialogManager.alert("请选择商品");
            return;
        }
        this.groundAjax(arr,type);
    }
    ground(item){
        let arr = [];
        arr.push(item.goodsid);
        let status = item.status==0?1:0;
        this.groundAjax(arr,status);
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
    addStorage(item,type){
        let storageType =1;
        if(type=="add"){
            storageType = 1;
        }else{
            storageType = 2;
        }
        this.setState({goodsId:item.goodsid,storageType},()=>{
            this.refs.addStorageDialog.show();
        });
    }
    cutStorage(){

    }
    inNumInput(type,e){
        this.state[type] = e.target.value;
        // this.setState({inNum:e.target.value});
    }
    addStorageSubmit(){
        let {inNum,goodsId,storageType,pager} = this.state;
        let _this = this;
        if(!inNum){
            Pubsub.publish("showMsg",["wrong","请输入库存数量"]);
            return false;
        }
        let request = {innum:storageType==1?inNum:-inNum,goodsId};
        $.ajax({
            url:commonUrl + "/djt/web/goodsmang/addleft.do",
            type:"get",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","操作成功"]);
                    _this.getList(pager.currentPage);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
        console.log(inNum,goodsId)
    }
    render(){
        let {pager,listRequest,list,checkedAll,saleSort,storageType} =this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品列表"]}>
                    <div className="search-div clearfix">
                        <div className="left">
                            <span>品牌：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"brand")}
                                       value = {listRequest.brand}
                                       placeholder = "请输入品牌"/>
                            <span>系列：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"series")}
                                       value = {listRequest.series}
                                       placeholder = "请输入系列"/>
                            <span>分类：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"classify")}
                                       value = {listRequest.classify}
                                       placeholder = "请输入分类"/>
                            <span>商品名称：</span>
                            <RUI.Input className = "search-input"
                                       onChange = {this.inputChange.bind(this,"goodsName")}
                                       value = {listRequest.goodsName}
                                       placeholder = "请输入商品名称"/>
                            <RUI.Button onClick = {this.search} className = "primary" >查询</RUI.Button>
                            <RUI.Button onClick = {this.reset} className = "primary" >重置</RUI.Button>
                        </div>
                       <div className="right">

                           <RUI.Button onClick = {this.add} className = "primary">新增商品</RUI.Button>
                           <RUI.Button onClick = {this.manageAttr} className = "primary">属性管理</RUI.Button>

                       </div>
                    </div>
                    <div className="m-b-20">
                        <RangePicker onChange={this.datePickerChange}
                                     disabledDate={this.disabledDate}
                                     size = "large"
                                     allowClear ={false}
                                     value={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}
                                     defaultValue={[moment(listRequest.stdate, 'YYYY-MM-DD'),moment(listRequest.endate, 'YYYY-MM-DD')]}/>
                        <RUI.Button onClick = {this.batchGround.bind(this,0)}>批量上架</RUI.Button>
                        <RUI.Button onClick = {this.batchGround.bind(this,1)}>批量下架</RUI.Button>
                        <RUI.Button onClick = {this.batchDelete}>批量删除</RUI.Button>
                        <RUI.Button onClick = {this.batchExport}>全部导出</RUI.Button>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="col-10">
                                        <RUI.Checkbox selected = {checkedAll?1:0} onChange = {this.checkAll}>商品名称</RUI.Checkbox>
                                    </td>
                                    <td className="col-8">品牌</td>
                                    <td className="col-10">系列</td>
                                    <td className="col-8">商品分类</td>
                                    <td className="col-8">单位</td>
                                    <td className="col-8">价格(元)</td>
                                    <td className= {saleSort==1?"col-8 sort-des":"col-8 sort-asc"}
                                        onClick = {this.sortFn.bind(this,"goodsLeft","saleSort")}>
                                        <span className="m-r-5">库存</span>
                                        <i className="sort-bottom"/>
                                        <i className="sort-top"/>
                                    </td>
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
                                        <tr key = {index} className={item.warn>item.goodsLeft?"font-color-yellow":""}>
                                            <td className="text-left p-l-15">
                                                <RUI.Checkbox onChange = {this.check.bind(this,item,index)}
                                                              selected = {item.checked?1:0}> {item.goodsname}</RUI.Checkbox>
                                            </td>
                                            <td>{item.brand}</td>
                                            <td>{item.series}</td>
                                            <td>{item.classify}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.price}</td>
                                            <td>{item.goodsLeft}</td>
                                            <td>{item.sellNum}</td>
                                            <td>{item.updateTime}</td>
                                            <td>{item.status==0?"上架":"下架"}</td>
                                            <td>
                                                <div>
                                                    <a href="javascript:;" onClick = {this.checkDetail.bind(this,item)}>查看&nbsp;|</a>
                                                    <a href="javascript:;" onClick = {this.modify.bind(this,item)}>&nbsp;修改&nbsp; |</a>
                                                    <a href="javascript:;" onClick = {this.ground.bind(this,item)}>&nbsp;{item.status==0?"下架":"上架"}&nbsp;|</a>
                                                    <a href="javascript:;" onClick = {this.delete.bind(this,item)}>&nbsp;删除</a>
                                                </div>
                                                <div>
                                                    <a href="javascript:;" onClick = {this.addStorage.bind(this,item,"add")}>&nbsp;增加库存&nbsp; |</a>
                                                    <a href="javascript:;" onClick = {this.addStorage.bind(this,item,"cut")}>&nbsp;减少库存&nbsp; |</a>
                                                </div>
                                            </td>
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
                    <RUI.Dialog ref="addStorageDialog" title={storageType==1?"增加库存":"减少库存"} draggable={false} buttons="submit,cancel"
                                onSubmit={this.addStorageSubmit}>
                        <div style={{width:'400px', wordWrap:'break-word'}}>
                            <LabelInput placeholder = "库存数量"
                                        onChange = {this.inNumInput.bind(this,"inNum")} label = "库存数量："/>

                        </div>
                    </RUI.Dialog>
                </Layout>
            </div>
        )
    }
}