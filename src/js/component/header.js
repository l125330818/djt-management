/**
 * Created by luojie on 2017/4/12 14:26.
 */
import  Breadcrumb  from 'antd/lib/Breadcrumb';
import 'antd/lib/Breadcrumb/style/css';
let week = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日",]
export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            year:new Date().Format("yyyy-MM-dd"),
            week:week[new Date().getDay()-1],
            day:new Date().Format(" hh:mm:ss"),
        }
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
    render(){
        let {year,week,day} = this.state;
        return(
            <div>
                <div className="header">
                    <div className="header-title">
                        <h1>Hello</h1>
                    </div>
                    <div>
                        <span className="m-r-10">{year}</span>
                        <span>{week}</span>
                        <p>{day}</p>
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
            </div>
        )
    }
}