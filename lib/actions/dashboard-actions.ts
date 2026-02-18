"use server"

import prisma from "@/lib/prisma"
// @ts-expect-error - date-fns v4 has module resolution issues with "bundler"
import { startOfMonth, subMonths, format } from "date-fns"

const serialize = (data: any): any => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getDashboardStats() {
    try {
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const prevMonthStart = startOfMonth(subMonths(now, 1))

        // 1. Total Revenue (Lifetime vs Current Month)
        const totalRevenueResult = await prisma.penjualan.aggregate({
            _sum: { total_bayar: true }
        })
        const currentMonthRevenue = await prisma.penjualan.aggregate({
            where: { tgl_penjualan: { gte: currentMonthStart } },
            _sum: { total_bayar: true }
        })
        const prevMonthRevenue = await prisma.penjualan.aggregate({
            where: {
                tgl_penjualan: {
                    gte: prevMonthStart,
                    lt: currentMonthStart
                }
            },
            _sum: { total_bayar: true }
        })

        // 2. Counts
        const totalSales = await prisma.penjualan.count()
        const totalProducts = await prisma.obat.count()
        const totalCustomers = await prisma.pelanggan.count()

        // 3. Chart Data (Last 6 months)
        const chartData = []
        for (let i = 5; i >= 0; i--) {
            const mStart = startOfMonth(subMonths(now, i))
            const mEnd = startOfMonth(subMonths(now, i - 1 || 0))
            const rev = await prisma.penjualan.aggregate({
                where: {
                    tgl_penjualan: {
                        gte: mStart,
                        lt: i === 0 ? undefined : mEnd
                    }
                },
                _sum: { total_bayar: true }
            })
            chartData.push({
                month: format(mStart, "MMM"),
                revenue: rev._sum.total_bayar || 0,
            })
        }

        // 4. Recent Orders for Table
        const recentOrders = await prisma.penjualan.findMany({
            take: 10,
            orderBy: { created_at: "desc" },
            include: {
                pelanggan: true,
                jenis_pengiriman: true
            }
        })

        // 5. Recent Purchases for Table
        const recentPurchases = await prisma.pembelian.findMany({
            take: 10,
            orderBy: { created_at: "desc" },
            include: {
                distributor: true,
                details: {
                    include: {
                        obat: true
                    }
                }
            }
        })

        // Growth Calculation
        const revGrowth = prevMonthRevenue._sum.total_bayar
            ? ((currentMonthRevenue._sum.total_bayar || 0) - prevMonthRevenue._sum.total_bayar) / prevMonthRevenue._sum.total_bayar * 100
            : 0

        return serialize({
            stats: {
                totalRevenue: totalRevenueResult._sum.total_bayar || 0,
                revenueGrowth: revGrowth.toFixed(1),
                totalSales,
                totalProducts,
                totalCustomers,
            },
            chartData,
            recentOrders,
            recentPurchases
        })
    } catch (error) {
        console.error("Dashboard Stats Error:", error)
        throw new Error("Gagal mengambil data dashboard")
    }
}
