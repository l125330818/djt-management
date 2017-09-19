// import OrderList from "./js/page/order/orderList";
// import OrderDetail from "./js/page/order/order-detail";
// import CommodityList from "./js/page/commodity/commodity-list";
// import AddCommodity from "./js/page/commodity/add-commodity";
// import CustomerList from "./js/page/customer/customer-list";
// import Recharge from "./js/page/customer/recharge";
// import AddCustomer from "./js/page/customer/add-customer";
// import NoticeList from "./js/page/notice/notice-list";
// import AddNotice from "./js/page/notice/add-notice";
// import RechargeList from "./js/page/customer/recharge-list";
// import AddOrder from "./js/page/order/add-order";
// import AllSearchList from "./js/page/search/all-search";
// import CustomerDetail from "./js/page/customer/customer-detail";
// import CommodityAttr from "./js/page/commodity/commodity-attr";
// import SeriesList from "./js/page/commodity/commodity-series";
export const orderList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/order/orderList').default)
    },"orderList")
};
export const orderDetail = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/order/order-detail').default)
    },"orderDetail")
};
export const commodityList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-list').default)
    },"commodityList")
};
export const addCommodity = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/add-commodity').default)
    },"addCommodity")
};
export const customerList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/customer-list').default)
    },"customerList")
};
export const recharge = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/recharge').default)
    },"recharge")
};
export const addCustomer = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/add-customer').default)
    },"addCustomer")
};
export const noticeList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/notice/notice-list').default)
    },"noticeList")
};
export const addNotice = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/notice/add-notice').default)
    },"addNotice")
};
export const rechargeList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/recharge-list').default)
    },"rechargeList")
};
export const addOrder = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/order/add-order').default)
    },"addOrder")
};
export const allSearchList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/search/all-search').default)
    },"allSearchList")
};
export const customerDetail = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/customer-detail').default)
    },"customerDetail")
};
export const commodityAttr = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-attr').default)
    },"commodityAttr")
};
export const seriesList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-series').default)
    },"seriesList")
};
export const storageList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/storage-list').default)
    },"storageList")
};
export const addressList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/address-list').default)
    },"addressList")
};

