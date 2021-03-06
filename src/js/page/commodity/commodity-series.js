/**
 * Created by luojie on 2017/5/24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {seriesList} from "../ajax/commodityAjax";
import AntUpload from "../../component/antUpload";
import Pubsub from "../../util/pubsub"

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
            addBrandRequest:{
                companyName:localStorage.companyName || "",
                brand:"",
                imgloc:""
            },
            listRequest:{
                companyName:localStorage.companyName || "",
                pageNum:1,
                pageSize:10,
                brand:this.props.location.query.brand || ""
            },
            addType:2,
            dialogInput:"",
            imgloc:"",
            file:[]
        };
        this.brand = this.props.location.query.brand || ""
        this.addBrand = this.addBrand.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
        this.uploadCallback = this.uploadCallback.bind(this);
        this.goPage = this.goPage.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(pageNo = 1){
        let {listRequest,pager} = this.state;
        seriesList(listRequest).then((data)=>{
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
        this.setState({file:[]},()=>{
            this.refs.dialog.show();
        })
    }
    uploadCallback(file){
        let imgloc = file.length?file[0].url : "";
        this.setState({imgloc,file});
    }
    inputChange(e){
        this.setState({dialogInput:e.target.value});
    }
    addSeries(){
        this.setState({addType:2,file:[]},()=>{
            this.refs.dialog.show();
        });
    }
    dialogSubmit(){
        let _this = this;
        let {dialogInput,imgloc} = this.state;
        let msg = "";
        if(!dialogInput){
            msg = "请输入系列";
        }else  if(!imgloc){
            msg = "请上传图片";
        }else{
            msg = "";
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
            return false;
        }
        let request = {
            companyName:localStorage.companyName || "",
            brand:this.brand,
            series:dialogInput,
            imgloc:imgloc,
        };
        $.ajax({
            url:commonUrl+"/djt/web/goodsmang/addseriser.do",
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","新增成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
    }
    delete(item){
        let _this = this;
        RUI.DialogManager.confirm({
            message:"您确定要删除吗？",
            title:"删除系列",
            submit(){
                let request = {
                    companyName:localStorage.companyName || "",
                    series : item.series,
                    brand:_this.brand
                };
                $.ajax({
                    url:commonUrl+"/djt/web/goodsmang/deleteseries.do",
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
    render(){
        let {pager,brandList,addType,file} = this.state;
        console.log(file);
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品系列"]}>
                    <div className="search-div clearfix">
                        <div className="right">
                            <RUI.Button onClick = {this.addBrand} className = "primary">新增系列</RUI.Button>
                        </div>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td className="col-30">系列</td>
                                <td className="col-30">图片</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                brandList.length>0 && brandList.map((item,i)=>{
                                    return (
                                        <tr key = {i}>
                                            <td>{item.series}</td>
                                            <td className="p-t-b-20">
                                                <img className="brand-img" src={item.imgloc} alt=""/>
                                            </td>
                                            <td>
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
                        <Pager returnButton = {true} onPage ={this.goPage} {...pager}/>
                        <RUI.Dialog ref="dialog" title={"新增系列"}
                                    draggable={false}
                                    buttons="submit,cancel"
                                    onCancel={this.dialogCancel}
                                    onSubmit={this.dialogSubmit}>
                            <div style={{width:'400px', wordWrap:'break-word'}} >
                                <div className="clearfix">
                                    <label className = "left m-t-36">{addType==1?"品牌：":"系列："}</label>
                                    <RUI.Input onChange = {this.inputChange.bind(this)}
                                               className = "left add-dialog-input"
                                               placeholder = {"请输入系列"}/>
                                    <AntUpload length = {1}
                                               fileList = {file}
                                               callback = {this.uploadCallback}
                                               removePreview = {true}/>
                                </div>

                            </div>
                        </RUI.Dialog>
                    </div>
                </Layout>
            </div>
        )
    }
}