/**
 * Created by Administrator on 2017-2-19.
 */
const Input = React.createClass({
    selectFn(e){
        console.log(e)
    },
    render(){
        return(
            <div className = "m-t-10">
                <label className = "left-label ">
                    {
                        this.props.require &&
                        <i className="require">*</i>
                    }
                    {this.props.label || ""}</label>
                <RUI.Select
                    {...this.props}
                    data={this.props.data || []}
                    value={this.props.default ||{}}
                    stuff={true}
                    callback = {(e)=>{this.props.callback && this.props.callback(e)}}
                    className={"rui-theme-1 w-245 " + this.props.className}>
                </RUI.Select>
                {this.props.children}
            </div>
        )
    }
});
module.exports = Input;