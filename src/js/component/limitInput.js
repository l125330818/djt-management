
import RUI from "react-component-lib";

export default class Limit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            keyDownText:"",
            changeText:this.props.value?this.props.value:""
        },
        this.inputBlurFn = this.inputBlurFn.bind(this);
        this.inputTextFn = this.inputTextFn.bind(this);
        this.inputTextFocus = this.inputTextFocus.bind(this);
    }
    componentDidMount(){
        this.setState({changeText:""});
    }
    inputTextFn(e){
        var _this = this;
        if(_this.props.reg){
            var reg = _this.props.reg;
            if(e.target.value==""){
                _this.setState({changeText:""});
                this.props.onChange&&this.props.onChange.call(null,e);
                return;
            }

            if((typeof reg == "function" && !reg(e.target.value)) || (reg.test && !(reg.test(e.target.value)))){
                _this.setState({changeText:_this.state.keyDownText});
            }else{
                _this.setState({changeText:e.target.value});
                this.props.onChange&&this.props.onChange.call(null,e);
            }
        }
    }
    inputTextFocus(e){
        this.setState({keyDownText:e.target.value});
    }
    inputBlurFn(){
        this.props.onBlur&&this.props.onBlur.call(null,e);
    }
    render(){
        return(
            <RUI.Input className={this.props.className}
                       maxLength={this.props.maxLength?this.props.maxLength:""}
                       disabled={this.props.disabled}
                       placeholder={this.props.placeholder}
                       type="text"
                       value={this.props.value}
                       onBlur={this.inputBlurFn}
                       onChange={this.inputTextFn}
                       onKeyDown={this.inputTextFocus} />
        )
    }
}