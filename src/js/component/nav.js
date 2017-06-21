/**
 * Created by luojie on 2017/4/12 9:31.
 */
import "../../css/page/layout.scss";
import {Link} from "react-router";
export default class Nav extends React.Component{
    constructor(props){
        super(props);
        this.state={
            navList:[]
        }
    };
    componentDidMount(){
        let level = localStorage.level;
        let navList = [];
        if(level == 4){
            navList = [
                {mark:"dd",name:"订单管理",path:"/orderList"},
                {mark:"kh",name:"客户管理",path:"/customerList"},
                {mark:"sp",name:"商品管理",path:"/commodityList"},
                {mark:"rk",name:"入库记录",path:"/storageList"},
                {mark:"cx",name:"万能查询",path:"/allSearchList"},
            ];
        }else{
            navList = [
                {mark:"dd",name:"订单管理",path:"/orderList"},
                {mark:"kh",name:"客户管理",path:"/customerList"},
                {mark:"sp",name:"商品管理",path:"/commodityList"},
                {mark:"tz",name:"通知管理",path:"/noticeList"},
                {mark:"cz",name:"充值记录",path:"/rechargeList"},
                {mark:"rk",name:"入库记录",path:"/storageList"},
                {mark:"cx",name:"万能查询",path:"/allSearchList"},
            ];
        }
        this.setState({navList});
    }
    render(){
        let {navList} = this.state;
        return(
            <div className="nav-bar">
                <div className="user-wel">
                    <p>{localStorage.agentname}</p>
                    <p>欢迎你!</p>
                </div>

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