'use strict';
import "./css/base.scss";
import { Router, Route, hashHistory } from 'react-router';
import Login from "./js/page/login";
import Layout from "./js/component/layout";
import moment from 'moment';
import AntUpload from "./js/component/antUpload";
import LabelInput from "./js/component/label-input";
import LabelArea from "./js/component/label-textarea";
import LabelSelect from "./js/component/label-select";
import LabelDate from "./js/component/label-date";
import {
    orderList,
    orderDetail,
    commodityList,
    addCommodity,
    customerList,
    recharge,
    addCustomer,
    noticeList,
    addNotice,
    rechargeList,
    addOrder,
    allSearchList,
    customerDetail,
    commodityAttr,
    seriesList,
    storageList,
    addressList,
} from "./entryConfig";
//最终渲染
ReactDOM.render((
    <Router history={hashHistory}>
        <Route  path='/' component={Login}/>
        <Route  path='login' component={Login}/>
        <Route  path = "orderList" getComponent={orderList}/>
        <Route  path = "orderDetail" getComponent={orderDetail}/>
        <Route  path = "commodityList" getComponent={commodityList}/>
        <Route  path = "addCommodity" getComponent={addCommodity}/>
        <Route  path = "customerList" getComponent={customerList}/>
        <Route  path = "recharge" getComponent={recharge}/>
        <Route  path = "addCustomer" getComponent={addCustomer}/>
        <Route  path = "noticeList" getComponent={noticeList}/>
        <Route  path = "addNotice" getComponent={addNotice}/>
        <Route  path = "rechargeList" getComponent={rechargeList}/>
        <Route  path = "addOrder" getComponent={addOrder}/>
        <Route  path = "allSearchList" getComponent={allSearchList}/>
        <Route  path = "customerDetail" getComponent={customerDetail}/>
        <Route  path = "commodityAttr" getComponent={commodityAttr}/>
        <Route  path = "seriesList" getComponent={seriesList}/>
        <Route  path = "storageList" getComponent={storageList}/>
        <Route  path = "addressList" getComponent={addressList}/>
    </Router>
), document.getElementById('app'));
