/**
 * Created by luojie on 2017/4/12 9:31.
 */
import "../../css/page/layout.scss";
import {Link} from "react-router"
export default class Nav extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    };
    static defaultProps = {
        navList:[
            {mark:"dd",name:"订单管理",path:"/orderList"},
            {mark:"kh",name:"客户管理",path:"/orderList"},
            {mark:"sp",name:"商品管理",path:"/commodityList"},
            {mark:"tz",name:"通知管理",path:"/orderList"},
            {mark:"cz",name:"充值记录",path:"/orderList"},
        ]
    };
    static propTypes = {
        navList: React.PropTypes.array,
    }
    render(){
        let {navList} = this.props;

        return(
            <div className="nav-bar">
                <ul>
                    {
                        navList.map((item,index)=>{
                            let liStyle = item.mark==this.props.mark?"nav-bar-li active":"nav-bar-li";
                            return(
                                <li className={liStyle} key = {index}>
                                    <Link to = {item.path} className={item.mark+""}>{item.name}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}