'use strict';
import "./css/base.scss";
import { Router, Route, hashHistory } from 'react-router';
import Login from "./js/page/order/orderList";
//最终渲染
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={Login}/>
    </Router>
), document.getElementById('app'));
