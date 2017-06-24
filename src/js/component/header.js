/**
 * Created by luojie on 2017/4/12 14:26.
 */
import  Breadcrumb  from 'antd/lib/Breadcrumb';
import LabelInput from "./label-input";
import 'antd/lib/Breadcrumb/style/css';
import Pubsub from "../util/pubsub";
import {hashHistory} from "react-router";
let week = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日",]
export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            year:new Date().Format("yyyy-MM-dd"),
            week:week[new Date().getDay()-1],
            day:new Date().Format(" hh:mm:ss"),
            request:{
                username:localStorage.userName,
                oldpwd:"",
                newpwd:""
            }
        };
        this.loginOut = this.loginOut.bind(this);
        this.modifyPwd = this.modifyPwd.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.dialogSubmit = this.dialogSubmit.bind(this);
    }
    componentDidMount(){
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(()=>{
            this.setState({
                day:new Date().Format(" hh:mm:ss"),
                week:week[new Date().getDay()-1],
                year:new Date().Format("yyyy-MM-dd")});
        },1000)
    }
    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
    }
    loginOut(){
        hashHistory.push("/login");
    }
    modifyPwd(){
        this.refs.headerDialog.show();
    }
    dialogSubmit(){
        let {request} = this.state;
        let msg = "";
        if(!request.oldpwd){
            msg = "请输入旧密码";
        }else if(request.oldpwd.length<6){
            msg = "密码格式为6~20位数字或字母";
        }else if(!request.newpwd){
            msg = "请输入新密码";
        }else if(request.newpwd.length<6){
            msg = "密码格式为6~20位数字或字母";
        }else if(request.newpwd != request.confirmPwd){
            msg = "2次输入密码不相同，请重新输入";
        }
        else{
            msg = "";
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
            return false;
        }
        $.ajax({
            url:commonUrl + "/djt/web/user/pdmodifi.do",
            type:"post",
            dataType:"json",
            data:request,
            success(data){
                if(data.status == "0000"){
                    Pubsub.publish("showMsg",["success","修改成功"]);
                    this.timer = this.setTimeout(()=>{
                        hashHistory.push("/login");
                    },1000);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.msg]);
                }
            }
        })
    }
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
    }
    render(){
        let {year,week,day} = this.state;
        return(
            <div>
                <div className="header relative clearfix">
                    <div className="header-title">
                        <h1>代经通后台管理系统</h1>
                    </div>
                    <div>
                        <span className="m-r-10">{year}</span>
                        <span>{week}</span>
                        <p>{day}</p>
                    </div>
                    <div className="login-out-div">
                        <a className="m-r-20" onClick = {this.modifyPwd}>修改密码</a>
                        <a onClick = {this.loginOut}>退出登录</a>
                    </div>

                </div>
                <div className="header-bread clearfix">
                    <Breadcrumb className = "line-50">
                        <Breadcrumb.Item href="javascript:;">
                            <span>{this.props.bread[0]}</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {this.props.bread[1]}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <RUI.Dialog ref="headerDialog" title={"修改密码"} draggable={false} buttons="submit,cancel"
                            onSubmit={this.dialogSubmit}>
                    <div style={{width:'400px', wordWrap:'break-word'}}>
                        <LabelInput maxLength = {20}
                                    disable = {true}
                                    value = {localStorage.userName}
                                    placeholder = "6~20位数字或字母"
                                    label = "用户名："/>
                        <LabelInput onChange = {this.changeInput.bind(this,"oldpwd")}
                                    require = {true}
                                    type = "password"
                                    maxLength = {20}
                                    placeholder = "6~20位数字或字母"
                                    label = "旧密码："/>
                        <LabelInput onChange = {this.changeInput.bind(this,"newpwd")}
                                    require = {true}
                                    type = "password"
                                    maxLength = {20}
                                    placeholder = "6~20位数字或字母"
                                    label = "新密码："/>
                        <LabelInput onChange = {this.changeInput.bind(this,"confirmPwd")}
                                    require = {true}
                                    type = "password"
                                    maxLength = {20}
                                    placeholder = "6~20位数字或字母"
                                    label = "确认密码："/>

                    </div>
                </RUI.Dialog>
            </div>
        )
    }
}