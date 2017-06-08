/**
 * Created by Administrator on 2017-2-19.
 */
import LimitInput from "./limitInput.js";
const Input = React.createClass({
    render(){
        return(
            <div className = "m-t-10">

                <label className = "left-label ">
                    {
                        this.props.require &&
                        <i className="require">*</i>
                    }
                    {this.props.label || ""}</label>
                {
                    this.props.reg?
                        <LimitInput  {...this.props}/>
                        :
                        <RUI.Input {...this.props}
                            value = {this.props.value}
                            disable = {this.props.disable || false}
                            placeholder = {this.props.placeholder || ""}
                            onChange = {(e)=>{this.props.onChange && this.props.onChange(e)}}/>
                }
                <span className="require m-l-10">{this.props.tips || ""}</span>
            </div>
        )
    }
});
module.exports = Input;