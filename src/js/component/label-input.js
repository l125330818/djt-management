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
                <LimitInput  {...this.props}/>
                <span className="require m-l-10">{this.props.tips || ""}</span>
            </div>
        )
    }
});
module.exports = Input;