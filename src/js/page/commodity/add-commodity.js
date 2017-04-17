/**
 * Created by Administrator on 2017-4-16.
 */
import Layout from "../../component/layout";
import "../../../css/page/order.scss";
import Upload from "../../component/upload";
import LabelInput from "../../component/label-input";
import LabelArea from "../../component/label-textarea";
import LabelSelect from "../../component/label-select";
export default class Add extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgUrl:[],
            brandSelect:[],
            seriesSelect:[],
            brandDefault:{key:"请选择",value:""},
            seriesDefault:{key:"请选择",value:""},
            specType:1,
            specArr:[{price:"",num:"",spec:"",volume:"",productCode:"",barCode:"",}],
        };
        this.uploadCallback = this.uploadCallback.bind(this);
        this.selectBrand = this.selectBrand.bind(this);
        this.groupChange = this.groupChange.bind(this);
        this.addSpec = this.addSpec.bind(this);
      }

    componentDidMount() {
        let arr = [
            {key:"阿玛尼",value:1,son:[{key:"阿玛尼1",value:4},{key:"阿玛尼2",value:5}]},
            {key:"一叶子",value:2,son:[{key:"一叶子1",value:6},{key:"一叶子2",value:7}]},
            {key:"哈哈哈",value:3,son:[{key:"哈哈哈1",value:8},{key:"哈哈哈2",value:9}]},
        ];
        this.setState({
            brandSelect:arr
        })
    }
    uploadCallback(url){
        let {imgUrl} = this.state;
        imgUrl.push({url});
        this.setState({});
    }
    changeInput(){}
    selectBrand(e){
        let {seriesSelect,seriesDefault} = this.state;
        console.log(e)
        if(e.value){
            seriesSelect = e.son;
        }else{
            seriesSelect = [];
            seriesDefault = {key:"请选择",value:""}
        }
        console.log(seriesSelect)
        this.setState({seriesSelect,seriesDefault});
    }
    groupChange(e){
        let specType  = e.data;
        this.setState({specType});
    }
    addSpec(){
        let {specArr} = this.state;
        specArr.push({price:"",num:"",spec:"",volume:"",productCode:"",barCode:"",});
        this.setState({specArr});
    }
    deleteSpec(index){
        let {specArr} = this.state;
        specArr.splice(0,index);
        this.setState({specArr});
    }
    render(){
        let {imgUrl,brandSelect,brandDefault,seriesSelect,seriesDefault,specType,specArr} = this.state;
        return(
            <Layout mark = "sp" bread = {["商品管理","新增商品  "]}>
                <div className="add-content">
                    <div className="clearfix">
                        <label className="left-label left"> <span className="require">*</span> 商品图片：</label>
                        <Upload className = "add-upload" callback = {this.uploadCallback} url = {imgUrl}/>
                    </div>
                    <LabelInput onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "商品名称："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "商品描述1："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "商品描述2："/>
                    <LabelArea onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "商品描述3："/>
                    <LabelSelect require = {true}
                                 label = "品牌："
                                 data = {brandSelect}
                                 callback = {this.selectBrand}
                                 default = {brandDefault}>
                        <RUI.Button className = "primary">新增品牌/系列</RUI.Button>
                    </LabelSelect>


                    <LabelSelect require = {true}
                                 label = "系列："
                                 data = {seriesSelect}
                                 callback = {this.select}
                                 default = {seriesDefault}/>
                    <LabelInput onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "分类："/>
                    <LabelInput onChange = {this.changeInput.bind(this,"name")} require = {true}  label = "单位："/>
                    <div className = "m-t-10">
                        <label className="left-label left"> <span className="require">*</span>库存以及价格：</label>
                        <RUI.RadioGroup ref="radioGroup" onChange={this.groupChange} defaultValue={"1"}>
                            <RUI.Radio value="1">同一规格</RUI.Radio>
                            <RUI.Radio value="2">多规格</RUI.Radio>
                        </RUI.RadioGroup>
                    </div>
                    <div className = "m-t-10 m-l-110">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>价格(元)</td>
                                    <td>总数量</td>
                                    {
                                        specType==2 &&
                                        <td>规格</td>
                                    }
                                    <td>容量</td>
                                    <td>产品编码</td>
                                    <td>条形码</td>
                                    {
                                        specType==2 &&
                                        <td className="p-l-r-10">操作</td>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                            {
                                specType==1?
                                    <tr>
                                        <td>
                                            <RUI.Input className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input className = "w-80"/>
                                        </td>
                                        <td>
                                            <RUI.Input className = "w-80"/>
                                        </td>
                                    </tr>
                                    :
                                    specArr.map((item,index)=>{
                                        return(
                                            <tr>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    <RUI.Input className = "w-80"/>
                                                </td>
                                                <td>
                                                    {
                                                        index !=0 &&
                                                        <a className="p-l-r-10" onClick = {this.deleteSpec.bind(this,index)}>删除</a>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                            }

                            </tbody>
                        </table>
                        {
                            specType == 2 &&
                            <RUI.Button onClick = {this.addSpec}>添加</RUI.Button>
                        }
                    </div>
                </div>
            </Layout>
        )
    }
}