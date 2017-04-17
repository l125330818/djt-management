import OrderList from "./js/page/order/orderList";
import CommodityList from "./js/page/commodity/commodity-list";
import AddCommodity from "./js/page/commodity/add-commodity";
import CustomerList from "./js/page/customer/customer-list";
import Recharge from "./js/page/customer/recharge";
const config = [
    {
        path:"orderList",
        component:OrderList
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
];
export default config;