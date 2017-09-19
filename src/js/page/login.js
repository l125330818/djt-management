/**
 * Created by luojie on 2017/5/18.
 */
import "../../css/login.scss";
import RUI from "react-component-lib";
import {hashHistory} from "react-router";
import GlobalData from "../component/Data";
import Pubsub from "../util/pubsub";
import PasswordIcon from "../../images/layout/password.png";
import UserIcon from "../../images/layout/user.png";
import Logo from "../../images/layout/logo.png";
const baseUrl = "https://www.djtserver.cn";
// const baseUrl = "http://123.207.73.114:8090";
const Login = React.createClass({
    getInitialState(){
        return{
            checked:localStorage.checked || false
        }
    },
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
        let userName = this.refs.userName.value;
        let password = this.refs.pwd.value;
        let {checked} = this.state;
        if(!userName){
            RUI.DialogManager.alert("请输入用户名");
            return;
        }else if(!password){
            RUI.DialogManager.alert("请输入密码");
            return;
        }
        $.ajax({
            url:baseUrl+"/djt/web/user/login.do",
            type:"post",
            dataType:"json",
            data:{username:userName,password:password},
            success(data){
                if(data.status == "0000"){
                    GlobalData.userInfo = data.data;
                    localStorage.userName = userName;
                    localStorage.password = password;
                    localStorage.userid = data.data.userid || "";
                    localStorage.companyName = data.data.companyName || "";
                    localStorage.agentname = data.data.agentname || "";
                    localStorage.level = data.data.level || "";
                    localStorage.checked = checked || "";
                    hashHistory.push("/orderList");

                }else{
                    RUI.DialogManager.alert(data.msg);
                }
            }
        })
        //hashHistory.push("/depart");
    },
    changeBox(e){
        this.setState({checked:!!e.data.selected});
    },
    render(){
        let userName = localStorage.userName;
        let password = localStorage.password;
        let {checked} = this.state;
        return(
            <div className="login-wrapper">
                <div className="login-box">
                    <div className="logo"  alt="">
                        <img src={Logo} alt=""/>
                    </div>
                    <div className="user-div relative">
                        <p className="margin0">用户名</p>
                        <input className = "login-input"
                               defaultValue = {checked?(userName || ""):""}
                               ref = "userName" placeholder = "请输入用户名"/>
                        <img  className="img" src={UserIcon} alt=""/>
                    </div>
                    <div className="relative">
                        <p>密码</p>
                        <input className = "login-input"
                               defaultValue = {checked?(password || ""):""}
                               ref = "pwd" type = "password" placeholder = "请输入密码"/>
                        <img className="img" src={PasswordIcon} alt=""/>
                    </div>
                    <div  className = "remember">
                        <RUI.Checkbox selected = {checked} onChange = {this.changeBox}>
                            <span className="color-fff remember-span">记住我的登录信息</span>
                        </RUI.Checkbox>
                    </div>
                    <div className="login-btn">
                        <RUI.Button className = "w-280 primary btn" onClick = {this.login}>登录</RUI.Button>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = Login;
