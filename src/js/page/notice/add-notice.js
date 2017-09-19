/**
 * Created by Administrator on 2017-4-16.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import LabelInput from "../../component/label-input";
import LabelArea from "../../component/label-textarea";
import LabelSelect from "../../component/label-select";
import LabelDate from "../../component/label-date";
import moment from 'moment';
import AntUpload from "../../component/antUpload";
import Pubsub from "../../util/pubsub";
import {hashHistory} from "react-router";
import {noticeDetail} from "../ajax/noticeAjax";

import {upCommodityList} from "../ajax/commodityAjax";

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
                location:"轮播图",
                theme:"",
                content:"",
                imgloc:"",
                relationid:"",
                relationname:"",
                ranged:"全部",
            },
            defaultType:{key:"政策活动",value:1},
            defaultLocation:{key:"轮播图",value:1},
            defaultranged:{key:"全部",value:0},
            noticeType : 1,
            file:[],
            goodsData:[],
            goodsSelect:{key:'无',value:'0'}
        };
        this.uploadCallback = this.uploadCallback.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.selectranged = this.selectranged.bind(this);
        this.saveData = this.saveData.bind(this);
        this.filterHandle = this.filterHandle.bind(this);
        this.selectGoods = this.selectGoods.bind(this);
        this.activityId = this.props.location.query.activityId;
        this.type = this.props.location.query.type;
        this.listRequest = {
            companyName:localStorage.companyName || "",
            brand:"",
            series:"",
            classify:"",
            goodsName:"",
            stdate : "",
            endate : "",
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
                    goodsSelect:{key:data.relationname,value:data.relationid},
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
        let {request,noticeType} = this.state;
        let msg = "";
        if(!request.theme){
            msg = "请输入通知主题";
        }else if(noticeType == 1 && !request.content){
            msg = "请输入通知内容";
        }else if(!request.imgloc){
			msg = "请上传图片";
		}else if (noticeType==2 && !request.relationid){
            msg = "请选择关联商品";
        }else{
            msg = "";
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
            return;
        }
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
        upCommodityList(this.listRequest).then((data)=>{
            let list = data.dataList || [];
            let arr = [];
            list.map((item,i)=>{
                arr.push({key:item.goodsname,value:item.goodsid})
            });
            this.setState({goodsData:arr});
        })

    }
    selectGoods(e){
        let {request} = this.state;
        request.relationid = e.value;
        request.relationname = e.key;
        this.setState({goodsSelect:e});
    }
    render(){
        let {imgUrl,request,noticeType,file,defaultType,defaultLocation,defaultranged,goodsData,goodsSelect} = this.state;
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
                                 data = {[{key:"轮播图",value:1},{key:"横幅图",value:2}]}
                                 callback = {this.selectLocation}
                                 disable = {!!type}
                                 default = {defaultLocation}>
                    </LabelSelect>
                    <LabelInput onChange = {this.changeInput.bind(this,"theme")}
                                value =  {request.theme}
                                disable = {!!type}
                                require = {true}
                                label = "通知主题："/>

                    {
						noticeType==1 &&
                        <LabelArea onChange = {this.changeInput.bind(this,"content")}
                                   value =  {request.content}
                                   disable = {!!type}
                                   require = {true}
                                   label = "通知内容："/>
                    }
                    <div className="m-t-10">
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
                        {
                            noticeType==2 &&
                            <p className="tips">
                                <span className="require">*</span>
                                只显示首张图片作为封面
                            </p>
                        }
                    </div>
                    {
                        noticeType==2 &&
                            <div>

                                <label className="left-label "><span className="require">*</span>关联商品：</label>
                                <RUI.Select
                                    data={goodsData}
                                    value={goodsSelect}
                                    filter={true}
                                    disable = {!!type}
                                    className="rui-theme-1 min-w-260"
                                    callback = {this.selectGoods}
                                    stuff={true}
                                    filterCallback={this.filterHandle}>
                                </RUI.Select>
                            </div>
                    }

                    <LabelSelect require = {true}
                                 label = "推广范围："
                                 disable = {!!type}
                                 data = {[{key:"全部",value:""},{key:"一级代理商",value:1},{key:"二级代理商",value:2},{key:"三级代理商",value:3}]}
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