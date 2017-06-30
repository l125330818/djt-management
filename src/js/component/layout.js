/**
 * Created by luojie on 2017/4/12 14:25.
 */
import Nav from "./nav";
import Header from "./header";

import Message from "./message";
import Pubsub from "../util/pubsub";
import Data from "../component/Data";
import {hashHistory} from "react-router";
window.commonUrl = "https://www.djtserver.cn";
window.userid = Data.userInfo.userid || "";
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export default class Layout extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            messageType : 'success',
            messageMsg : '',
        };
      }
    componentDidMount(){
        var _this = this;
        _this.pubsub_token = Pubsub.subscribe('showMsg', function (topic,msgArr) {
            if(msgArr && msgArr.length>=2){
                _this.showMsg(msgArr[0],msgArr[1]);
            }
        });
      this.stepAjax();
    }
    stepAjax(){
        $.ajaxSetup( {
            error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
                // jqXHR 是经过jQuery封装的XMLHttpRequest对象
                // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
                // errorMsg 可能为： "Not Found"、"Internal Server Error"等
                // 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
                if(jqXHR.status==403){
                    //跳转登录页面
                    hashHistory.push("/login");
                }
            }
        } );
    }
    showMsg(type, msg) {
        var _this = this;
        window.setTimeout(function() {
            _this.setState({
                messageType : type,
                messageMsg : msg
            },function(){
                _this.refs.message.open();
            });
        },200);
    }
    render(){
        return(
            <div>
                <Nav {...this.props}/>
                <div className="right-page">
                    <Header {...this.props}/>
                    <div className="page-content">
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <Message
                    ref="message"
                    type={this.state.messageType}
                    msg={this.state.messageMsg}
                    key={new Date().getTime()}>
                </Message>
            </div>
        )
    }
}
