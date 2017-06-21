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
    })
};
export const orderDetail = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/order/order-detail').default)
    })
};
export const commodityList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-list').default)
    })
};
export const addCommodity = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/add-commodity').default)
    })
};
export const customerList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/customer-list').default)
    })
};
export const recharge = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/recharge').default)
    })
};
export const addCustomer = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/add-customer').default)
    })
};
export const noticeList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/notice/notice-list').default)
    })
};
export const addNotice = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/notice/add-notice').default)
    })
};
export const rechargeList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/recharge-list').default)
    })
};
export const addOrder = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/order/add-order').default)
    })
};
export const allSearchList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/search/all-search').default)
    })
};
export const customerDetail = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/customer/customer-detail').default)
    })
};
export const commodityAttr = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-attr').default)
    })
};
export const seriesList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/commodity-series').default)
    })
};
export const storageList = (location, callback) => {
    require.ensure([], require => {
        callback(null, require('./js/page/commodity/storage-list').default)
    })
};

