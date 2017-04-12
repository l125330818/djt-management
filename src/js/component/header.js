/**
 * Created by luojie on 2017/4/12 14:26.
 */
import moment from 'moment';
import  Breadcrumb  from 'antd/lib/Breadcrumb';
import  Icon  from 'antd/lib/Icon';
export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            year:moment().format('LL'),
            week:moment().format('dddd'),
            day:moment().format('LTS'),
        }
    }
    componentDidMount(){
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(()=>{
            this.setState({day:moment().format('LTS')});
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
                            <Icon type="home" />
                        </Breadcrumb.Item>
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