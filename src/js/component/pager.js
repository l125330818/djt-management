/**
 * Created by luojie on 2017/2/15 11:19.
 */
const Pager = React.createClass({
   render(){
       return(
           <div className="footer">
               {
                   this.props.returnButton &&
                   <div className="left">
                       <RUI.Button href="javascript:window.history.go(-1)">返回</RUI.Button>
                   </div>
               }
               <div className="right">
                   <RUI.Pagination {...this.props} onPage={(page)=>{this.props.onPage && this.props.onPage(page)}} />
               </div>
           </div>
       )
   }
});
module.exports = Pager;