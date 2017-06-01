/**
 * Created by luojie on 2017/5/24.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Pager from "../../component/pager";
import {seriesList} from "../ajax/commodityAjax";
import Upload from "../../component/upload";

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
            addBrandRequest:{
                companyName:localStorage.companyName || "",
                brand:"",
                imgloc:""
            },
            addType:2,
            dialogInput:""
        };
        this.brand = this.props.location.query.brand || ""
        this.addBrand = this.addBrand.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
    }
    componentDidMount(){
        this.getList();
    }
    getList(){
        let request = {
            companyName:localStorage.companyName || "",
            brand:this.brand
        };
        seriesList(request).then((data)=>{
            this.setState({brandList:data});
        });
    }
    addBrand(){
        this.refs.dialog.show();
    }
    uploadCallback(){

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
        console.log(this.state.dialogInput)
    }
    render(){
        let {pager,brandList,addType} = this.state;
        return(
            <div>
                <Layout mark = "sp" bread = {["商品管理","商品属性"]}>
                    <div className="search-div clearfix">
                        <div className="right">
                            <RUI.Button onClick = {this.addBrand} className = "primary">新增系列</RUI.Button>
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
                                            <td>{item.series}</td>
                                            <td>{item.imgloc}</td>
                                            <td>
                                                <a href="javascript:;">查看&nbsp;|</a>
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
                                        <span>{this.brand}</span>
                                    </div>
                                }
                                <div className="clearfix">
                                    <label className = "left m-t-36">{addType==1?"品牌：":"系列："}</label>
                                    <RUI.Input onChange = {this.inputChange.bind(this)}
                                               className = "left add-dialog-input"
                                               placeholder = {addType==1?"请输入品牌":"请输入系列"}/>
                                    <Upload className = "add-upload" callback = {this.uploadCallback} isAdd = {true}/>
                                </div>

                            </div>
                        </RUI.Dialog>
                    </div>
                </Layout>
            </div>
        )
    }
}