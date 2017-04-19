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

export default class Add extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgUrl:[],
            request:{
                onLineTime:moment(new Date()).format("YYYY-MM-DD"),
                unLineTime:moment(new Date()).format("YYYY-MM-DD"),
            },
            noticeType : 1
        };
        this.uploadCallback = this.uploadCallback.bind(this);
        this.selectNotice = this.selectNotice.bind(this);
    }

    componentDidMount() {
    }
    selectNotice(e){
        let {noticeType} = this.state;
        this.setState({noticeType: e.value});
    }
    uploadCallback(url,index){
        console.log(index);
        let {imgUrl} = this.state;
        imgUrl.push({url});
        this.setState({imgUrl});
    }
    changeInput(){}
    dateChange(type,e){
        let {request} = this.state;
        request[type] = e;
        this.setState({});
    }

    render(){
        let {imgUrl,request,noticeType} = this.state;
        return(
            <Layout mark = "tz" bread = {["通知管理","新增通知"]}>
                <div className="add-content">
                    <LabelSelect require = {true}
                                 label = "通知类型："
                                 data = {[{key:"政策活动",value:1},{key:"商品推广",value:2}]}
                                 callback = {this.selectNotice}
                                 default = {{key:"政策活动",value:1}}>
                    </LabelSelect>
                    <LabelSelect require = {true}
                                 label = "展示位置："
                                 data = {[{key:"滚动栏1",value:1},{key:"滚动栏2",value:2},{key:"滚动栏3",value:3}]}
                                 callback = {this.selectBrand}
                                 default = {{key:"滚动栏1",value:1}}>
                    </LabelSelect>
                    {
                        noticeType==1?
                            <div>
                                <LabelInput onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "通知主题："/>
                                <LabelArea onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "通知内容："/>
                                <div className="clearfix">
                                    <label className="left-label left"> <span className="require">*</span> 商品图片：</label>
                                    {
                                        imgUrl.map((item,index)=>{
                                            return (
                                                <Upload className = "add-upload" index = {index} callback = {this.uploadCallback} url = {item.url}/>
                                            )
                                        })
                                    }
                                    <Upload className = "add-upload" callback = {this.uploadCallback} isAdd = {true}/>
                                </div>
                            </div>
                            :
                            <div>
                                <LabelInput onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "关联商品："/>
                            </div>
                    }

                    <LabelDate
                        value = {request.onLineTime}
                        defaultValue = {request.onLineTime}
                        require = {true}
                        label = "上线时间："
                        onChange = {this.dateChange.bind(this,"onLineTime")}
                    />
                    <LabelDate
                        value = {request.unLineTime}
                        defaultValue = {request.unLineTime}
                        require = {true}
                        label = "下线时间："
                        onChange = {this.dateChange.bind(this,"unLineTime")}
                    />
                </div>

                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>保存</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}