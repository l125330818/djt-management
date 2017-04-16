/**
 * Created by Administrator on 2017-4-16.
 */
import Layout from "../../component/layout";
import LabelText from "../../component/label-text";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import {changeNumMoneyToChinese} from "../../util/util";
import "../../../css/page/order.scss";
export default class Recharg extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            checked:false,
            ChineseNum:"",
            brandSelect:[{key:"一叶子",value:1},{key:"韩素",value:2}]
        };
        this.selectBrand = this.selectBrand.bind(this);
        this.checkChange = this.checkChange.bind(this);
      }
    checkChange(e){
        let checked = e.data.selected==1?true : false;
        this.setState({checked});
    }
    selectBrand(){}
    changeInput(type,e){
        let value = e.target.value;
        console.log(value)

        let ChineseNum = changeNumMoneyToChinese(value);
        this.setState({ChineseNum});
    }
    render(){
        let {checked,brandSelect,ChineseNum} = this.state;
        return(
            <Layout mark = "kh" bread = {["客户管理","充值"]}>
                <LabelText label = "公司名称：" text = "四川成都公司"/>
                <LabelText label = "姓名：" text = "张哥"/>
                <LabelText label = "代理级别：" text = "一级代理"/>
                <LabelText label = "地址：" text = "成都市高新区"/>
                <LabelText label = "联系方式：" text = "13568763633"/>
                <LabelText label = "QQ：" text = "125330818"/>
                <LabelText label = "微信：" text = "13568763633"/>
                <RUI.Checkbox value="1" className = "m-l-20"  onChange={this.checkChange}>
                    充值操作失误，可进行负数充值
                </RUI.Checkbox>
                <LabelSelect require = {true}
                             label = {checked? "负充值品牌：": "充值品牌："}
                             data = {brandSelect}
                             callback = {this.selectBrand}
                             default = {{key:"请选择",value:""}}/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            tips = {ChineseNum}
                            label = {checked? "负充值金额：": "充值金额："}/>
            </Layout>
        )
    }
}