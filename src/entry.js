'use strict';
import "./css/base.scss";
import { Router, Route, hashHistory } from 'react-router';
import Login from "./js/page/login";
import config from "./entryConfig.js";
//最终渲染
ReactDOM.render((
    <Router history={hashHistory}>
        <Route>
            <Route  path='/' component={Login}/>
            {
                config.map((item,index)=>{
                    return(
                        <Route key = {index} path={item.path} component={item.component}/>
                    )
                })
            }
        </Route>
    </Router>
), document.getElementById('app'));
