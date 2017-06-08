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
import LabelDate from "../../component/label-date";
import moment from 'moment';
import AntUpload from "../../component/antUpload";
import Pubsub from "../../util/pubsub";
import {hashHistory} from "react-router";
import {noticeDetail} from "../ajax/noticeAjax";

import {commodityList} from "../ajax/commodityAjax";

export default class Add extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgUrl:[],
            request:{
                uptime:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                downtime:moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                companyName:localStorage.companyName || "",
                type:"政策活动",
                location:"滚动栏1",
                theme:"",
                content:"",
                imgloc:"",
                relationid:"b6b1d249-efff-4e8b-acd6-769ac203b6b7",
                ranged:"一级代理商",
            },
            defaultType:{key:"政策活动",value:1},
            defaultLocation:{key:"滚动栏1",value:1},
            defaultranged:{key:"一级代理商",value:1},
            noticeType : 1,
            file:[],
            goodsData:[]
        };
        this.uploadCallback = this.uploadCallback.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.selectranged = this.selectranged.bind(this);
        this.saveData = this.saveData.bind(this);
        this.filterHandle = this.filterHandle.bind(this);
        this.activityId = this.props.location.query.activityId;
        this.type = this.props.location.query.type;
        this.listRequest = {
            companyName:localStorage.companyName || "",
            brand:"",
            series:"",
            classify:"",
            goodsName:"",
            stdate : moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
            endate : moment(new Date()).format("YYYY-MM-DD"),
            keyword:"",
            pageNum:1,
            pageSize:10000,

        }
    }

    componentDidMount() {
        let request = {activityId:this.activityId};
        if(this.type){
            noticeDetail(request).then((data)=>{
                let imgArr = data.imgloc?JSON.parse(data.imgloc):[];
                let arr = [];
                imgArr.map((item,i)=>{
                    arr.push({uid:i,url:item})
                });
                let noticeType = data.type=="政策活动"?"1":"2";
                this.setState({
                    request:data,
                    file:arr,
                    noticeType,
                    defaultType:{key:data.type,value:data.type},
                    defaultLocation:{key:data.location,value:data.location},
                    defaultranged:{key:data.ranged,value:data.ranged},
                });
            });
        }
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
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({});
    }
    dateChange(type,e){
        let {request} = this.state;
        request[type] = e;
        this.setState({});
    }
    selectType(e){
        let {request} = this.state;
        request.type = e.key;
        this.setState({defaultType:e,noticeType:e.value});
    }
    selectLocation(e){
        let {request} = this.state;
        request.location = e.key;
        this.setState({defaultLocation:e});
    }
    selectranged(e){
        let {request} = this.state;
        request.ranged = e.key;
        this.setState({defaultranged:e});
    }
    saveData(){
        let {request} = this.state;
        $.ajax({
            url:commonUrl+"/djt/web/activity/addaction.do",
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    setTimeout(()=>{
                        hashHistory.push("noticeList");
                    },1000);
                    Pubsub.publish("showMsg",["success","新增成功"]);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        });
    }
    filterHandle(e){
        this.listRequest.goodsName = e;
        commodityList(this.listRequest).then((data)=>{
            let list = data.dataList || [];
            let arr = [];
            list.map((item,i)=>{
                arr.push({key:item.goodsName,value:item.goodsId})
            });
            this.setState({goodsData:arr});
        })

    }
    render(){
        let {imgUrl,request,noticeType,file,defaultType,defaultLocation,defaultranged,goodsData} = this.state;
        let type = this.type;
        return(
            <Layout mark = "tz" bread = {["通知管理","新增通知"]}>
                <div className="add-content">
                    <LabelSelect require = {true}
                                 label = "通知类型："
                                 data = {[{key:"政策活动",value:1},{key:"商品推广",value:2}]}
                                 callback = {this.selectType}
                                 disable = {!!type}
                                 default = {defaultType}>
                    </LabelSelect>
                    <LabelSelect require = {true}
                                 label = "展示位置："
                                 data = {[{key:"滚动栏1",value:1},{key:"滚动栏2",value:2},{key:"滚动栏3",value:3}]}
                                 callback = {this.selectLocation}
                                 disable = {!!type}
                                 default = {defaultLocation}>
                    </LabelSelect>
                    {
                        noticeType==1?
                            <div>
                                <LabelInput onChange = {this.changeInput.bind(this,"theme")}
                                            value =  {request.theme}
                                            disable = {!!type}
                                            require = {true}
                                            label = "通知主题："/>
                                <LabelArea onChange = {this.changeInput.bind(this,"content")}
                                           value =  {request.content}
                                           disable = {!!type}
                                           require = {true}
                                           label = "通知内容："/>
                                <div className="clearfix">
                                    <label className="left-label left"> <span className="require">*</span>上传图片：</label>
                                    {
                                        !!type?
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
                            </div>
                            :
                            <div>

                                <LabelInput  disable = {!!type} onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "关联商品："/>
                            </div>
                    }
                    <label className="left-label "><span className="require">*</span>关联商品：</label>
                    <RUI.Select
                        data={goodsData}
                        value={{key:'无',value:'1'}}
                        filter={true}
                        className="rui-theme-1"
                        stuff={true}
                        filterCallback={this.filterHandle}>
                    </RUI.Select>
                    <LabelSelect require = {true}
                                 label = "推广范围："
                                 disable = {!!type}
                                 data = {[{key:"一级代理商",value:1},{key:"二级代理商",value:2},{key:"三级代理商",value:3}]}
                                 callback = {this.selectranged}
                                 default = {defaultranged}>
                    </LabelSelect>
                    <LabelDate
                        value = {request.uptime}
                        defaultValue = {request.uptime}
                        require = {true}
                        disabled = {!!type}
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        label = "上线时间："
                        onChange = {this.dateChange.bind(this,"uptime")}
                    />
                    <LabelDate
                        value = {request.downtime}
                        defaultValue = {request.downtime}
                        disabled = {!!type}
                        require = {true}
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        label = "下线时间："
                        onChange = {this.dateChange.bind(this,"downtime")}
                    />
                </div>

                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        {
                            !type &&
                            <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                        onClick={this.saveData}>保存</RUI.Button>
                        }

                    </div>
                </div>
            </Layout>
        )
    }
}