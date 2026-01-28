import {
    IconDashboard,
    IconPills,
    IconReport,
    IconListDetails,
    IconTruckDelivery,
    IconUsers,
} from "@tabler/icons-react"

export const DASHBOARD_NAV_ITEMS = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
    },
    {
        title: "Products",
        url: "/dashboard/products",
        icon: IconPills,
    },
    {
        title: "Penjualan",
        url: "/dashboard/sales",
        icon: IconReport,
    },
    {
        title: "Pembelian",
        url: "/dashboard/purchases",
        icon: IconListDetails,
    },
    {
        title: "Pengiriman",
        url: "/dashboard/shippings",
        icon: IconTruckDelivery,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: IconUsers,
        role: "admin",
    },
]
