/**
 * Created by Administrator on 2017-4-16.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Upload from "../../component/upload";
import LabelInput from "../../component/label-input";
import LabelArea from "../../component/label-textarea";
import LabelSelect from "../../component/label-select";
import LimitInput from "../../component/limitInput";
import AntUpload from "../../component/antUpload";
import Pubsub from "../../util/pubsub";
import {hashHistory} from "react-router";

import {brandList,commodityDetail,seriesList} from "../ajax/commodityAjax";
const moneyReg = /^(0(?:[.](?:[1-9]\d?|0[1-9]))|[1-9]\d{0,6}(?:[.]\d{0,2}|$)|0([.]0{0,2})?)$/;

export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgUrl:[],
            brandSelect:[],
            seriesSelect:[],
            brandDefault:{key:"请选择",value:""},
            seriesDefault:{key:"请选择",value:""},
            specType:1,
            specArr:[{price:"",num:"",spec:"",volume:"",productCode:"",barCode:"",}],
            request:{
                goodsname : "",
                desc1 : "haha",
                desc2 : "",
                desc3 : "",
                brand : "",
                series : "",
                unit : "",
                price : "",
                size : "",
                standard : "",
                goodsnum : "",
                barcode : "",
                classify : "",
                warn : "",
                imgloc : "",
                companyname : localStorage.companyName || "",
                remark : "",
            },
            file:[]
        };
        this.type = this.props.location.query.type;
        this.goodsId = this.props.location.query.goodsId;
        this.selectBrand = this.selectBrand.bind(this);
        this.groupChange = this.groupChange.bind(this);
        this.addSpec = this.addSpec.bind(this);
        this.saveData = this.saveData.bind(this);
        this.uploadCallback = this.uploadCallback.bind(this);
        this.selectSeries = this.selectSeries.bind(this);
      }

    componentDidMount() {
        let request = {goodsId:this.goodsId};
        if(this.type){
            commodityDetail(request).then((data)=>{
                let imgArr = JSON.parse(data.imgloc);
                let arr = [];
                imgArr.map((item,i)=>{
                    arr.push({uid:i,url:item})
                });
                this.setState({
                    request:data,
                    file:arr,
                    brandDefault:{key:data.brand,value:data.brand},
                    seriesDefault:{key:data.series,value:data.series}});
            });
        }
        this.getBrandList();
    }
    getBrandList(){
        let brandRequest = {pageNum:1,pageSize:100000, companyName:localStorage.companyName || "",};
        brandList(brandRequest).then((data)=>{
            let brandSelect = [];
            data.dataList.map((item)=>{
                brandSelect.push({key:item.brand,value:item.brand})
            });
            this.setState({brandSelect});
        });
    }
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({});
    }
    selectBrand(e){
        let {request} = this.state;
        if(e.value){
            // seriesSelect = e.son;
            let brand = e.value;
            request.brand = brand;
            let seriesRequest = {pageNum:1,pageSize:100000, companyName:localStorage.companyName || "",brand};
            seriesList(seriesRequest).then((data)=>{
                let seriesSelect = [];
                data.dataList.map((item)=>{
                    seriesSelect.push({key:item.series,value:item.series})
                });
                this.setState({seriesSelect,brandDefault:e});
            })

        }else{
            let seriesSelect = [];
            let seriesDefault = {key:"请选择",value:""}
            this.setState({seriesSelect,seriesDefault});

        }
    }
    groupChange(e){
        let specType  = e.data;
        this.setState({specType});
    }
    addSpec(){
        let {specArr} = this.state;
        specArr.push({price:"",num:"",spec:"",volume:"",productCode:"",barCode:"",});
        this.setState({specArr});
    }
    deleteSpec(index){
        let {specArr} = this.state;
        specArr.splice(0,index);
        this.setState({specArr});
    }
    saveData(){
        let {request} = this.state;
        request.goodsId = this.goodsId;
        let url = this.type?"/djt/web/goodsmang/updategoods.do":"/djt/web/goodsmang/addgoods.do";
        let _this = this;
        $.ajax({
            url:commonUrl+url,
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    setTimeout(()=>{
                        hashHistory.push("commodityList");
                    },1000);
                    Pubsub.publish("showMsg",["success","新增成功"]);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
    }
    limitChange(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({});
    }
    uploadCallback(file){
        let {request} = this.state;
        let arr = [];
        file.map((item)=>{
            arr.push(item.url);
        });
        request.imgloc = JSON.stringify(arr);
        this.setState({file});
    }
    selectSeries(e){
        let {request} = this.state;
        request.series = e.value;
        this.setState({seriesDefault:e});
    }
    render(){
        let {file,brandSelect,brandDefault,seriesSelect,seriesDefault,specType,specArr,request} = this.state;
        let type = this.type;
        return(
            <Layout mark = "sp" bread = {["商品管理","新增商品"]}>
                <div className="add-content">
                    <div className="clearfix">
                        <label className="left-label left"> <span className="require">*</span> 商品图片：</label>
                        {
                            type == "check"?
                                file.map((item,index)=>{
                                    return(
                                        <div className="check-img-wrap" key = {index}>
                                            <img src={item.url} alt=""/>
                                        </div>
                                        )
                                })
                                :
                                <AntUpload fileList = {file}
                                           callback = {this.uploadCallback}
                                           length = {6} />
                        }


                    </div>
                    <LabelInput onChange = {this.changeInput.bind(this,"goodsname")}
                                value = {request.goodsname}
                                disable = {!!type}
                                require = {true}
                                label = "商品名称："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"desc1")}
                               value = {request.desc1}
                               disable = {type == "check"}
                               require = {true}
                               label = "商品描述1："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"desc2")}
                               value = {request.desc2}
                               disable = {type == "check"}
                               require = {true}
                               label = "商品描述2："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"desc3")}
                               value = {request.desc3}
                               disable = {type == "check"}
                               require = {true}
                               label = "商品描述3："/>
                    <LabelSelect require = {true}
                                 label = "品牌："
                                 data = {brandSelect}
                                 disable = {!!type}
                                 callback = {this.selectBrand}
                                 default = {brandDefault}>
                    </LabelSelect>


                    <LabelSelect require = {true}
                                 label = "系列："
                                 data = {seriesSelect}
                                 callback = {this.selectSeries}
                                 disable = {!!type}
                                 default = {seriesDefault}/>
                    <LabelInput onChange = {this.changeInput.bind(this,"classify")}
                                value = {request.classify}
                                require = {true}
                                disable = {!!type}
                                label = "分类："/>
                    <LabelInput onChange = {this.changeInput.bind(this,"unit")}
                                value = {request.unit}
                                require = {true}
                                disable = {!!type}
                                label = "单位："/>
                    <LabelInput onChange = {this.changeInput.bind(this,"warn")}
                                value = {request.warn}
                                disable = {type == "check"}
                                require = {true}
                                label = "库存预警设置："/>
                    <LabelInput onChange = {this.changeInput.bind(this,"remark")}
                                require = {true}
                                disable = {type == "check"}
                                value = {request.remark}
                                label = "备注："/>
                    <div className = "m-t-10">
                        <label className="left-label left"> <span className="require">*</span>库存以及价格：</label>
                        <RUI.RadioGroup ref="radioGroup" onChange={this.groupChange} defaultValue={"1"}>
                            <RUI.Radio value="1">统一规格</RUI.Radio>
                            {/*<RUI.Radio value="2">多规格</RUI.Radio>*/}
                        </RUI.RadioGroup>
                    </div>
                    <div className = "m-t-10 m-l-110">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>价格(元)</td>
                                    <td>规格</td>
                                    {
                                        specType==2 &&
                                        <td>规格</td>
                                    }
                                    <td>容量</td>
                                    <td>产品编码</td>
                                    <td>条形码</td>
                                    {
                                        specType==2 &&
                                        <td className="p-l-r-10">操作</td>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                            {
                                specType==1?
                                    <tr>
                                        <td>
                                            <LimitInput reg = {moneyReg}
                                                        value = {request.price}
                                                        disable = {type == "check"}
                                                        onChange = {this.limitChange.bind(this,"price")}
                                                        className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input  onChange = {this.changeInput.bind(this,"standard")}
                                                        value = {request.standard}
                                                        disable = {type == "check"}
                                                        className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input  onChange = {this.changeInput.bind(this,"size")}
                                                        value = {request.size}
                                                        disable = {type == "check"}
                                                        className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input  onChange = {this.changeInput.bind(this,"goodsnum")}
                                                        value = {request.goodsnum}
                                                        disable = {!!type}
                                                        className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input  onChange = {this.changeInput.bind(this,"barcode")}
                                                        value = {request.barcode}
                                                        disable = {!!type}
                                                        className = "w-80"/>
                                        </td>
                                    </tr>
                                    :
                                    specArr.map((item,index)=>{
                                        return(
                                            <tr>
                                                <td>
                                                    <LimitInput className = "w-80"/>
                                                </td>
                                                <td>
                                                    <LimitInput className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    {
                                                        index !=0 &&
                                                        <a className="p-l-r-10" onClick = {this.deleteSpec.bind(this,index)}>删除</a>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                            }

                            </tbody>
                        </table>
                        {
                            specType == 2 &&
                            <div className="add-sku-btn" onClick={this.addSpec}>
                                <i></i>添加规格
                            </div>
                        }
                    </div>
                </div>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        {
                            type != "check" &&
                            <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                        onClick={this.saveData}>保存</RUI.Button>
                        }

                    </div>
                </div>
            </Layout>
        )
    }
}