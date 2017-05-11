import OrderList from "./js/page/order/orderList";
import OrderDetail from "./js/page/order/order-detail";
import CommodityList from "./js/page/commodity/commodity-list";
import AddCommodity from "./js/page/commodity/add-commodity";
import CustomerList from "./js/page/customer/customer-list";
import Recharge from "./js/page/customer/recharge";
import AddCustomer from "./js/page/customer/add-customer";
import NoticeList from "./js/page/notice/notice-list";
import AddNotice from "./js/page/notice/add-notice";
import RechargeList from "./js/page/customer/recharge-list";
import AddOrder from "./js/page/order/add-order";
import AllSearchList from "./js/page/search/all-search";
const config = [
    {
        path:"orderList",
        component:OrderList
    },
    {
        path:"orderDetail",
        component:OrderDetail
    },
    {
        path:"commodityList",
        component:CommodityList
    },
    {
        path:"addCommodity",
        component:AddCommodity
    },
    {
        path:"customerList",
        component:CustomerList
    },
    {
        path:"recharge",
        component:Recharge
    },
    {
        path:"addCustomer",
        component:AddCustomer
    },
    {
        path:"noticeList",
        component:NoticeList
    },
    {
        path:"addNotice",
        component:AddNotice
    },
    {
        path:"rechargeList",
        component:RechargeList
    },
    {
        path:"addOrder",
        component:AddOrder
    },
    {
        path:"allSearchList",
        component:AllSearchList
    }
];
export default config;