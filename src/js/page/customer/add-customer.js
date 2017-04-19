/**
 * Created by Administrator on 2017-4-17.
 */
import Layout from "../../component/layout";
import LabelInput from "../../component/label-input";
import LabelSelect from "../../component/label-select";
import LabelDate from "../../component/label-date";
import "../../library/cityData.js";
import "../../../css/page/customer.scss"

let qqReg = /^\d+$/
export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            brandSelect:[{key:"一级代理",value:1},{key:"二级代理",value:2}],
            provinceData:[],
            cityData:[],
            countyData:[],
            defaultProvince:{key:"请选择",value:0},
            defaultCity:{key:"请选择",value:0},
            defaultCounty:{key:"请选择",value:0},
            request:{
                qq:""
            }
        };
        this.provinceChangeFn = this.provinceChangeFn.bind(this);
        this.cityChangeFn = this.cityChangeFn.bind(this);
        this.countyChangeFn = this.countyChangeFn.bind(this);
      }
    componentDidMount(){
        var proArr =  [{key:"请选择",value:0}];
        var provinceList = cityTool.getProvinceList();
        for(var i=0;i<provinceList.length;i++){
            proArr.push({key:provinceList[i].name,value:provinceList[i].value});
        }
        this.setState({provinceData:proArr});
    }
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({request});
    }
    brandSelectFn(e){

    }
    provinceChangeFn(e){
        var value = e.value;
        var cityArr = [{key:"请选择",value:0}];
        var cityList = cityTool.getCityList(value);
        if(value==0){
            this.setState({cityData:cityArr,countyData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }else{
            for(var i = 0 ; i<cityList.length;i++){
                cityArr.push({key:cityList[i].name,value:cityList[i].value});
            }
            this.setState({cityData:cityArr,defaultCity:{key:"请选择",value:0},defaultCounty:{key:"请选择",value:0}});
        }
        this.setState({province:value});

    }
    cityChangeFn(e){
        var value = e.value;
        var province = this.state.province;
        var countyArr = [{key:"请选择",value:0}];
        if(value==0){
            this.setState({countyData:countyArr,defaultCounty:{key:"请选择",value:0}});
        }else{
            var countList = cityTool.getCountyList(province,value);
            if(countList.length){
                for(var i = 0; i<countList.length;i++){
                    countyArr.push({key:countList[i].name,value:countList[i].value});
                }
                this.setState({hasCounty:true,countyData:countyArr,defaultCity:{key:e.key,value:e.value},defaultCounty:{key:"请选择",value:0}});
            }else{
                this.setState({hasCounty:false,countyData:countyArr,defaultCity:{key:e.key,value:e.value},defaultCounty:{key:"请选择",value:0}});
            }

        }
        this.setState({city:value});
    }
    countyChangeFn(e){
        var value = e.value;
        this.setState({county:value,defaultCounty:{key:e.key,value:e.value}});
    }
    dateChange(){}
    render(){
        let {brandSelect,request,provinceData,defaultProvince,cityData,defaultCity,countyData,defaultCounty,hasCounty} = this.state;
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
                <div className="clearfix m-t-10">
                    <label className="left-label left"> <span className="require">*</span> 地址：</label>
                    <div>
                        <RUI.Select
                            data={provinceData}
                            value={defaultProvince}
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.provinceChangeFn}>
                        </RUI.Select>
                        <RUI.Select
                            data={cityData}
                            value={defaultCity}
                            className="rui-theme-1 province-select"
                            stuff={true}
                            event={"click"}
                            callback={this.cityChangeFn}>
                        </RUI.Select>
                        {
                            hasCounty&&<RUI.Select
                                data={countyData}
                                value={defaultCounty}
                                className="rui-theme-1 province-select"
                                stuff={false}
                                event={"click"}
                                callback={this.countyChangeFn}>
                            </RUI.Select>
                        }
                    </div>
                </div>
                <LabelInput onChange = {this.changeInput.bind(this,"name")}
                            require = {true}
                            placeholder = "2~10个字符"
                            label = "联系方式："/>
                <LabelInput onChange = {this.changeInput.bind(this,"qq")}
                            require = {true}
                            placeholder = "2~10个字符"
                            value = {request.qq}
                            reg = {qqReg}
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