import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertOrderSchema, insertOrderItemSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { shipdayService } from '@/lib/shipday';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const orders = await storage.getOrdersByUserId(user.id);
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getAuthUser(request);

    // Support both authenticated users and guest orders
    const userId = user ? user.id : body.userId;

    const orderData = { ...body, userId };
    const validatedData = insertOrderSchema.parse(orderData);
    const order = await storage.createOrder(validatedData);

    // Create order items
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        const orderItemData = { ...item, orderId: order.id };
        const validatedItemData = insertOrderItemSchema.parse(orderItemData);
        await storage.createOrderItem(validatedItemData);
      }
    }

    const completedOrder = await storage.getOrderWithItems(order.id);

    // Auto-accept orders when monitor mode is off (default behavior)
    const monitorMode = process.env.MONITOR_MODE === 'true';
    if (!monitorMode) {
      await storage.updateOrderStatus(order.id, 'processing');
      completedOrder.status = 'processing';

      if (completedOrder.fulfillmentTime === 'asap') {
        await storage.updateOrderStatus(order.id, 'completed');
        completedOrder.status = 'completed';
        completedOrder.completedAt = new Date();
      }
    }

    // Collect menu item names for ShipDay integration
    const menuItemNames = new Map<number, string>();
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        const menuItem = await storage.getMenuItem(item.menuItemId);
        if (menuItem) {
          menuItemNames.set(item.menuItemId, menuItem.name);
        }
      }
    }

    // Push to ShipDay for delivery orders
    if (body.orderType === 'delivery' && body.addressData && shipdayService.isConfigured()) {
      try {
        const customerName = user ? `${user.firstName} ${user.lastName}` : 'Customer';
        const customerEmail = user?.email || '';

        const shipdayOrderData = {
          orderId: `FAV-${completedOrder.id}`,
          customerName,
          customerPhone: body.phone,
          customerEmail,
          address: {
            fullAddress: body.addressData.fullAddress,
            street: body.addressData.street,
            city: body.addressData.city,
            state: body.addressData.state,
            zipCode: body.addressData.zipCode,
          },
          items: body.items.map((item: any) => {
            let itemName = menuItemNames.get(item.menuItemId) || `Item #${item.menuItemId}`;

            if (item.options && Array.isArray(item.options) && item.options.length > 0) {
              const optionsText = item.options.map((opt: any) => `${opt.groupName}: ${opt.itemName}`).join(', ');
              itemName += ` (${optionsText})`;
            }

            if (item.specialInstructions?.trim()) {
              itemName += ` - Special: ${item.specialInstructions.trim()}`;
            }

            return {
              name: itemName,
              quantity: item.quantity,
              price: parseFloat(item.price),
            };
          }),
          totalAmount: parseFloat(body.total),
          specialInstructions: body.specialInstructions || '',
          restaurantName: "Francesco's",
          restaurantPhone: '(843) 299-2700',
          restaurantAddress: '2539 US-17S #6, Murrells Inlet SC 29576',
          fulfillmentTime: completedOrder.fulfillmentTime || 'asap',
          scheduledTime: completedOrder.scheduledTime
            ? completedOrder.scheduledTime.toISOString()
            : undefined,
        };

        const shipdayResult = await shipdayService.createDeliveryOrder(shipdayOrderData);
        if (shipdayResult.success) {
          await storage.updateOrder(completedOrder.id, {
            shipdayOrderId: shipdayResult.orderId,
            shipdayStatus: 'pending',
          });
        }
      } catch (shipdayError: any) {
        console.error(`ShipDay error for order #${completedOrder.id}:`, shipdayError.message);
      }
    }

    return NextResponse.json(completedOrder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
