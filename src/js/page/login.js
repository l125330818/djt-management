/**
 * Created by luojie on 2017/5/18.
 */
import "../../css/login.scss";
import RUI from "react-component-lib";
import {hashHistory} from "react-router";
import GlobalData from "../component/Data";
import Pubsub from "../util/pubsub";
const Login = React.createClass({
    componentDidMount(){
        let _this = this;
        let node = ReactDOM.findDOMNode(this.refs.pwd);
        (node).addEventListener("keyup",this.listener);
    },
    componentWillUnmount(){
        let _this = this;
        let node = ReactDOM.findDOMNode(this.refs.pwd);
        (node).removeEventListener("keyup",this.listener);
    },
    listener(e){
        if(e.keyCode == 13){
            this.login();
        }
    },
    login(){
        let userName = this.refs.userName.getValue();
        let password = this.refs.pwd.getValue();
        $.ajax({
            url:"https://www.djtserver.cn"+"/djt/web/user/login.do",
            type:"post",
            dataType:"json",
            data:{username:this.refs.userName.getValue(),password:this.refs.pwd.getValue()},
            success(data){
                if(data.status == "0000"){
                    GlobalData.userInfo = data.data;
                    localStorage.userName = userName;
                    localStorage.password = password;
                    localStorage.userid = data.data.userid || "";
                    localStorage.companyName = data.data.companyName || "";
                    localStorage.agentname = data.data.agentname || "";
                    localStorage.level = data.data.level || "";
                    hashHistory.push("/orderList");

                }else{
                    RUI.DialogManager.alert(data.msg);
                }
            }
        })
        //hashHistory.push("/depart");
    },
    render(){
        let userName = localStorage.userName;
        let password = localStorage.password;
        return(
            <div className="login-wrapper">
                <div className="login-box">
                    <h3>代经通</h3>
                    <div className="user-div">
                        <RUI.Input className = "w-280" defaultValue = {userName || ""} ref = "userName" placeholder = "用户名"/>
                    </div>
                    <div>
                        <RUI.Input className = "w-280" defaultValue = {password || ""} ref = "pwd" type = "password" placeholder = "密码"/>
                    </div>
                    <div className="login-btn">
                        <RUI.Button className = "w-280 green" onClick = {this.login}>登录</RUI.Button>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = Login;
