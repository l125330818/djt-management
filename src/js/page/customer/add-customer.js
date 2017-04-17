/**
 * Created by Administrator on 2017-4-17.
 */
import Layout from "../../component/layout";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import LabelDate from "../../component/label-date";

export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            brandSelect:[{key:"一级代理",value:1},{key:"二级代理",value:2}]
        };
      }
    changeInput(){}
    brandSelectFn(e){

    }
    dateChange(){}
    render(){
        let {brandSelect} = this.state;
        return(
            <Layout mark = "kh" bread = {["客户管理","新增客户"]}>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "公司名称："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "姓名："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "帐号："/>
                <LabelSelect require = {true}
                             label = "代理级别："
                             data = {brandSelect}
                             callback = {this.brandSelectFn}
                             default = {{key:"请选择",value:""}}/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "地址："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "联系方式："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "QQ："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "微信："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "邮箱："/>
                <LabelDate require = {true}
                           label = "签约时间："
                           onChange = {this.dateChange.bind(this)}/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "密码："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "确认密码："/>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "请输入备注"
                            label = "备注："/>
                <div className="footer js-footer">
                    <div className="left">
                        <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                        <RUI.Button className="primary" style={{marginLeft:"10px"}}
                                    onClick={this.saveData}>保存</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}