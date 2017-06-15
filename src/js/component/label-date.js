/**
 * Created by Administrator on 2017-2-19.
 */
import DatePicker  from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import moment from 'moment';
const Input = React.createClass({
    getDefaultProps(){
        return{
            value:moment(new Date()).format("YYYY-MM-DD"),
            defaultValue:moment(new Date()).format("YYYY-MM-DD"),
        }
    },
    datePickerChange(_,d){
        this.props.onChange && this.props.onChange(d);
    },
    render(){
        let {showTime} = this.props;
        let format = this.props.format || "YYYY-MM-DD";
        return(
            <div className = "m-t-10 clearfix">

                <label className = "left-label left">
                    {
                        this.props.require &&
                        <i className="require">*</i>
                    }
                    {this.props.label || ""}</label>
                <DatePicker onChange={this.datePickerChange}
                            size = "large"
                            format = {format}
                            showTime = {showTime}
                            allowClear ={false}
                            disabled = {this.props.disabled}
                            value={moment(this.props.value, format)}
                            defaultValue={moment(this.props.defaultValue, format)}/>
            </div>
        )
    }
});
module.exports = Input;