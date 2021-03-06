/**
 * Created by luojie on 2017/5/24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {brandList,getWarn,setWarn} from "../ajax/commodityAjax";
import AntUpload from "../../component/antUpload";
import LabelInput from "../../component/label-input";
import {hashHistory} from "react-router";
import Pubsub from "../../util/pubsub";
const moneyReg = /^(0(?:[.](?:[1-9]\d?|0[1-9]))|[1-9]\d{0,9}(?:[.]\d{0,2}|$)|0([.]0{0,2})?)$/;

export default class Attr extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:0,
            },
            brandList:[],
            brand:"",
            addType:1,
            imgloc:"",
            dialogInput:"",
            listRequest:{
                companyName:localStorage.companyName || "",
                pageNum:1,
                pageSize:10
            },
            file:[],
            warn:0
        };
        this.addBrand = this.addBrand.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
        this.uploadCallback = this.uploadCallback.bind(this);
        this.delete = this.delete.bind(this);
        this.goPage = this.goPage.bind(this);
        this.warnInput = this.warnInput.bind(this);
        this.setDialogSubmit = this.setDialogSubmit.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo = 1){
        let {listRequest,pager} = this.state;
        brandList(listRequest).then((data)=>{
            pager.totalNum = data.count;
            pager.currentPage = pageNo;
            this.setState({brandList:data.dataList});
        });
    }
    goPage(page){
        let {listRequest} = this.state;
        listRequest.pageNum = page;
        this.setState({},()=>{
            this.getList(page);
        });
    }
    addBrand(){
        this.setState({addType:1,imgloc:"",dialogInput:"",file:[]},()=>{
            this.refs.seDialog.show();
        });
    }
    uploadCallback(file){
        let imgloc = file.length?file[0].url : "";
        this.setState({imgloc,file});
    }
    inputChange(e){
        this.setState({dialogInput:e.target.value});
    }
    addSeries(item){
        this.setState({addType:2,imgloc:"",dialogInput:"",brand:item.brand,file:[]},()=>{
            this.refs.seDialog.show();
        });
    }
    dialogSubmit(){
        let _this = this;
        let {dialogInput,imgloc,addType,brand} = this.state;
        let request = {
            companyName:localStorage.companyName || "",
            imgloc
        };
        let msg = "";
        if(addType==1){
            if(!dialogInput){
                msg = "请输入品牌";
            }else  if(!imgloc){
                msg = "请上传图片";
            }else{
                msg = "";
            }
            request.brand = dialogInput;
        }else if(addType==2){
            if(!dialogInput){
                msg = "请输入系列";
            }else  if(!imgloc){
                msg = "请上传图片";
            }else{
                msg = "";
            }
            request.series = dialogInput;
            request.brand = brand;
        }

        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
            return false;
        }
        let url = addType==1?"/djt/web/goodsmang/addbrand.do":"/djt/web/goodsmang/addseriser.do";
        $.ajax({
            url:commonUrl+url,
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","操作成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
    }
    checkSeries(item){
        hashHistory.push(`seriesList?brand=${item.brand}`)
    }
    delete(item){
        let _this = this;

        RUI.DialogManager.confirm({
           message:"您确定要删除吗？",
            title:"删除品牌",
            submit(){
                let request = {
                    companyName:localStorage.companyName || "",
                    brand : item.brand
                };
                $.ajax({
                    url:commonUrl+"/djt/web/goodsmang/deletebrand.do",
                    type:"post",
                    dataType:"json",
                    data:request,
                    success(data){
                        if(data.status == "0000"){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            _this.getList();
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.msg]);
                        }
                    }
                });
            }
        });

    }
    set(item){
        let request = {companyname:localStorage.companyName,brand:item.brand};
        this.setState({brand:item.brand},()=>{
            this.refs.setDialog.show();
        });
        getWarn(request).then((data)=>{
            this.setState({warn:data.warn});
        });
    }
    setDialogSubmit(){
        let _this = this;
        let {warn,brand} = this.state;
        let request = {companyname:localStorage.companyName,brand,warn};
        setWarn(request).then((data)=>{
            if(data.status == "0000"){
                Pubsub.publish("showMsg",["success","设置成功"]);
                _this.getList();
            }else{
                Pubsub.publish("showMsg",["wrong",data.msg]);
            }
        })
    }
    warnInput(e){
        this.setState({warn:e.target.value});
    }
    render(){
        let {pager,brandList,addType,imgloc,brand,file,dialogInput,warn} = this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品品牌"]}>
                    <div className="search-div clearfix">
                        <div className="right">
                            <RUI.Button onClick = {this.addBrand} className = "primary">新增品牌</RUI.Button>
                        </div>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-25">品牌</td>
                                <td className="col-25">图片</td>
                                <td className="col-25">余额预警</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                brandList.length>0 && brandList.map((item,i)=>{
                                    let warn = item.warn || 0;
                                    return (
                                        <tr key = {i}>
                                            <td>{item.brand}</td>
                                            <td className="p-t-b-20"><img className="brand-img" src={item.imgloc} alt=""/></td>
                                            <td className="p-t-b-20">{warn || "未设置"}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.checkSeries.bind(this,item)}>查看&nbsp;|</a>
                                                <a href="javascript:;" onClick = {this.addSeries.bind(this,item)}>&nbsp;新增系列&nbsp;|</a>
                                                <a href="javascript:;" onClick = {this.set.bind(this,item)}>&nbsp;余额预警&nbsp;|</a>
                                                <a href="javascript:;" onClick = {this.delete.bind(this,item)}>&nbsp;删除</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        {
                            brandList.length==0 && <div className="no-data">暂时没有数据哦</div>
                        }
                        <Pager onPage ={this.goPage} {...pager}/>
                        <RUI.Dialog ref="seDialog" title={addType==1?"新增品牌":"新增系列"}
                                    draggable={false}
                                    buttons="submit,cancel"
                                    onCancel={this.dialogCancel}
                                    onSubmit={this.dialogSubmit}>
                            <div style={{width:'400px', wordWrap:'break-word'}} >
                                {
                                    addType ==2 &&
                                    <div>
                                        <label className = "left">品牌：</label>
                                        <span>{brand}</span>
                                    </div>
                                }
                                <div className="clearfix">
                                    <label className = "left m-t-36">{addType==1?"品牌：":"系列："}</label>
                                    <RUI.Input onChange = {this.inputChange.bind(this)}
                                               className = "left add-dialog-input"
                                               value = {dialogInput}
                                               placeholder = {addType==1?"请输入品牌":"请输入系列"}/>
                                    <AntUpload length = {1}
                                               fileList = {file}
                                               callback = {this.uploadCallback}
                                               removePreview = {true}/>
                                </div>

                            </div>
                        </RUI.Dialog>
                        <RUI.Dialog ref="setDialog" title={"余额预警"} draggable={false} buttons="submit,cancel"
                                    onSubmit={this.setDialogSubmit}>
                            <div style={{width:'400px', wordWrap:'break-word',maxHeight:500}}>
                                <div>
                                    <label className = "left-label ">品牌：</label>
                                    <span>{brand}</span>
                                </div>
                                <LabelInput onChange = {this.warnInput}
                                            value = {warn}
                                            require = {true}
                                            reg = {moneyReg}
                                            placeholder = "余额预警"
                                            maxLength = {11}
                                            label = "余额预警："/>

                            </div>
                        </RUI.Dialog>
                    </div>
                </Layout>
            </div>
        )
    }
}