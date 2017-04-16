/**
 * Created by Administrator on 2017-2-19.
 */
const Input = React.createClass({
    render(){
        return(
            <div >

                <span className = "left-label ">
                    {
                        this.props.require &&
                        <i className="require">*</i>
                    }
                    {this.props.label || ""}</span>
               <span>{this.props.text || ""}</span>
            </div>
        )
    }
});
module.exports = Input;