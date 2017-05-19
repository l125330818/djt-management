/**
 * Created by luojie on 2017/4/12 14:25.
 */
import 'antd/dist/antd.css';
import Nav from "./nav";
import Header from "./header";
import moment from 'moment';
import 'moment/locale/zh-cn';
import Message from "./message";
import Pubsub from "../util/pubsub";
import Data from "../component/Data";
moment.locale('zh-cn');
window.commonUrl = "https://www.djtserver.cn";
window.userid = Data.userInfo.userid || "";
console.log(Data)
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
