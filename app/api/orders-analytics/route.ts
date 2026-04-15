import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storage } from '@/lib/storage';
import { orders } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';

// Mirrors /api/orders/analytics — the frontend may call either path.
let analyticsCache: { data: any; timestamp: number } | null = null;
const ANALYTICS_CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const now = Date.now();
    if (analyticsCache && now - analyticsCache.timestamp < ANALYTICS_CACHE_TTL) {
      return NextResponse.json(analyticsCache.data);
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let ordersData: any[];
    try {
      ordersData = await db.select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        orderType: orders.orderType,
        createdAt: orders.createdAt,
        paymentStatus: orders.paymentStatus,
      }).from(orders);
    } catch {
      ordersData = await storage.getAllOrders();
    }

    let filteredOrders = ordersData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredOrders = ordersData.filter((o: any) => {
        const d = new Date(o.createdAt);
        return d >= start && d <= end;
      });
    }

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = filteredOrders.reduce((acc: any, o: any) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const orderTypeCounts = filteredOrders.reduce((acc: any, o: any) => {
      acc[o.orderType] = (acc[o.orderType] || 0) + 1;
      return acc;
    }, {});

    const itemCounts: Record<string, number> = {};
    filteredOrders.forEach((o: any) => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          if (item.name) {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
          }
        });
      }
    });
    const topSellingItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const uniqueCustomers = new Set<string>();
    filteredOrders.forEach((o: any) => {
      if (o.customerEmail) uniqueCustomers.add(o.customerEmail);
      else if (o.customerPhone) uniqueCustomers.add(o.customerPhone);
    });

    const customerOrderCounts = filteredOrders.reduce((acc: any, o: any) => {
      const key = o.customerEmail || o.customerPhone || 'anonymous';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const repeatCustomers = Object.values(customerOrderCounts).filter((c: any) => c > 1).length;
    const repeatCustomerPercentage = uniqueCustomers.size > 0 ? (repeatCustomers / uniqueCustomers.size) * 100 : 0;
    const avgOrdersPerCustomer = uniqueCustomers.size > 0 ? totalOrders / uniqueCustomers.size : 0;

    const analyticsData = {
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2),
      statusCounts,
      orderTypeCounts,
      topSellingItems,
      customerInsights: {
        totalCustomers: uniqueCustomers.size,
        repeatCustomers,
        repeatCustomerPercentage: repeatCustomerPercentage.toFixed(1),
        avgOrdersPerCustomer: avgOrdersPerCustomer.toFixed(1),
      },
      orders: filteredOrders,
    };

    analyticsCache = { data: analyticsData, timestamp: now };
    return NextResponse.json(analyticsData);
  } catch (error: any) {
    console.error('GET /api/orders-analytics error:', error);
    return NextResponse.json({
      totalOrders: 0, totalRevenue: '0.00', averageOrderValue: '0.00',
      statusCounts: {}, orderTypeCounts: {}, topSellingItems: [],
      customerInsights: { totalCustomers: 0, repeatCustomers: 0, repeatCustomerPercentage: '0.0', avgOrdersPerCustomer: '0.0' },
      orders: [],
    });
  }
}
