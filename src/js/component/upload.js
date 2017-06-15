/**
 * Created by Administrator on 2017-3-6.
 */
import "../../css/components/upload.scss";
import "../library/ajaxupload.3.5";

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
            action: "https://www.djtserver.cn/djt/web/upload/upimg.do",
            name: "img",
            responseType: "json",
            onChange(file){
                if(!/\.(gif|bmp|jpg|jpeg|png|GIF|JPG|PNG|image)$/.test(file)){
                    RUI.DialogManager.alert("图片格式不对，请重新上传！");
                    return false;
                }
            },
            onComplete:function(e,data){
                console.log(data);
                _this.props.callback && _this.props.callback("https://www.djtserver.cn/djt/images/1496302051124.jpg",_this.props.index);
                _this.replace();
                if(data.status == "0000"){
                    _this.props.callback && _this.props.callback(null,data.data.imgurl,_this.props.index);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            },
            error(){
                console.log(333)
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