/**
 * Created by Administrator on 2017-3-6.
 */
import "../../css/components/upload.scss";
import "../library/ajaxupload.3.5";
import  Modal  from 'antd/lib/Modal';

import Pubsub from "../util/pubsub";
export default class Upload extends React.Component{
    // 构造
    constructor(props) {
          super(props);
          // 初始状态
          this.state = {
              imgUrl : [],
              visible:false
          };
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        if(!this.props.disabled){
            let node = $(ReactDOM.findDOMNode(this.refs.replace));
            this.upload(node);
        }
    }
    upload(node){
        let _this = this;
        new AjaxUpload(node,{
            action: "/product/upload.htm",
            name: "upload",
            responseType: "json",
            onChange(file){
                if(!/\.(gif|bmp|jpg|jpeg|png|GIF|JPG|PNG|image)$/.test(file)){
                    RUI.DialogManager.alert("图片格式不对，请重新上传！");
                    return false;
                }
            },
            onComplete:function(e,data){
                console.log(node);
                _this.props.callback && _this.props.callback("https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D200/sign=34b533d9b63eb1355bc7b0bb961fa8cb/9f510fb30f2442a76d8ce294db43ad4bd1130204.jpg",_this.props.index);
                _this.replace();
                if(data.success){
                    _this.props.callback && _this.props.callback(null,data.resultMap.picPath,_this.props.index);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
    }
    componentWillReceiveProps(nextProps){
        //if(nextProps.url){
        //    this.setState({imgUrl:nextProps.url});
        //}
    }
    handleCancel(){
        this.setState({visible:false});
    }
    replace(){
        let node = $(ReactDOM.findDOMNode(this.refs.replace));
        this.upload(node);
    }
    delete(index){
        console.log(33)
    }
    render(){
        let {imgUrl,visible} = this.state;
        let {isAdd,url} = this.props;
        return(
            <div className = {this.props.className || ""}>
                {
                    isAdd?
                        <div className="upload-div" ref = "replace">
                            <i className="upload-trigger"/>
                        </div>
                        :
                        <div className="upload-div relative">
                            <img src={url}  className="upload-img" alt=""/>
                            <div className="upload-menu">
                                <div className="left-menu" onClick = {this.replace.bind(this)} ref = "replace">替换</div>
                                <div className="right-menu" onClick = {this.delete.bind(this)}>删除</div>
                            </div>
                        </div>
                }

            </div>
        )
    }

}