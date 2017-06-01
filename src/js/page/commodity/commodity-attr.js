/**
 * Created by luojie on 2017/5/24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {brandList} from "../ajax/commodityAjax";
import Upload from "../../component/upload";
import AntUpload from "../../component/antUpload";
import {hashHistory} from "react-router";

export default class Attr extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:100,
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
            }
        };
        this.addBrand = this.addBrand.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
        this.uploadCallback = this.uploadCallback.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(){
        let {listRequest} = this.state;
        brandList(listRequest).then((data)=>{
            this.setState({brandList:data});
        });
    }
    addBrand(){
        this.setState({addType:1},()=>{
            this.refs.dialog.show();
        });
    }
    uploadCallback(img){
        this.setState({imgloc:img});
    }
    inputChange(e){
        this.setState({dialogInput:e.target.value});
    }
    addSeries(){
        this.setState({addType:2},()=>{
            this.refs.dialog.show();
        });
    }
    dialogSubmit(){
        let {dialogInput,imgloc,addType,brand} = this.state;
        let request = {
            companyName:localStorage.companyName || "",
            imgloc
        };
        if(addType==1){
            request.brand = dialogInput;
        }else if(addType==2){
            request.series = dialogInput;
            request.brand = brand;
        }
        let url = addType==1?"/djt/web/goodsmang/addbrand.do":"/djt/web/goodmang/addseriser.do";
        $.ajax({
            url:commonUrl+url,
            type:"post",
            dataType:"json",
            data:request,
            success(data){

            }
        });
        console.log(request)
    }
    checkSeries(item){
        hashHistory.push(`seriesList?brand=${item.brand}`)
    }
    render(){
        let {pager,brandList,addType,imgloc} = this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品属性"]}>
                    <div className="search-div clearfix">
                        <div className="right">
                            <RUI.Button onClick = {this.addBrand} className = "primary">新增品牌</RUI.Button>
                            <AntUpload/>
                        </div>
                    </div>

                    <div className="order-content">
                        <table className="table">
                            <thead>
                            <tr>
                                <td >品牌</td>
                                <td >图片</td>
                                <td className="col-20">操作</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                brandList.length>0 && brandList.map((item,i)=>{
                                    return (
                                        <tr key = {i}>
                                            <td>{item.brand}</td>
                                            <td>{item.imgloc}</td>
                                            <td>
                                                <a href="javascript:;" onClick = {this.checkSeries.bind(this,item)}>查看&nbsp;|</a>
                                                <a href="javascript:;" onClick = {this.addSeries.bind(this,item)}>&nbsp;新增系列&nbsp;|</a>
                                                <a href="javascript:;">&nbsp;删除</a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                            </tbody>
                        </table>
                        <Pager onPage ={this.getList} {...pager}/>
                        <RUI.Dialog ref="dialog" title={addType==1?"新增品牌":"新增系列"}
                                    draggable={false}
                                    buttons="submit,cancel"
                                    onCancel={this.dialogCancel}
                                    onSubmit={this.dialogSubmit}>
                            <div style={{width:'400px', wordWrap:'break-word'}} >
                                {
                                    addType ==2 &&
                                    <div>
                                        <label className = "left">品牌：</label>
                                        <span>傻逼品牌</span>
                                    </div>
                                }
                                <div className="clearfix">
                                    <label className = "left m-t-36">{addType==1?"品牌：":"系列："}</label>
                                    <RUI.Input onChange = {this.inputChange.bind(this)}
                                               className = "left add-dialog-input"
                                               placeholder = {addType==1?"请输入品牌":"请输入系列"}/>
                                    {
                                        imgloc?
                                            <Upload className = "add-upload" url = {imgloc} callback = {this.uploadCallback} />
                                            :
                                            <Upload className = "add-upload" callback = {this.uploadCallback} isAdd = {true}/>
                                    }

                                </div>

                            </div>
                        </RUI.Dialog>
                    </div>
                </Layout>
            </div>
        )
    }
}