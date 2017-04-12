/**
 * Created by luojie on 2017/4/12 14:25.
 */
import 'antd/dist/antd.css';
import Nav from "./nav";
import Header from "./header";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class Layout extends React.Component{
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
            </div>
        )
    }
}
