import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    // Validate optional webhook token
    const webhookToken = process.env.SHIPDAY_WEBHOOK_TOKEN;
    if (webhookToken) {
      const providedToken =
        request.headers.get('x-shipday-token') ||
        request.headers.get('authorization')?.replace('Bearer ', '');
      if (!providedToken || providedToken !== webhookToken) {
        console.warn('ShipDay webhook rejected: invalid or missing token');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    console.log('ShipDay webhook received:', JSON.stringify(body));

    const { event_type, order_id, status, tracking_info } = body;

    if (event_type === 'order_status_updated' && order_id) {
      // ShipDay order IDs are formatted as FAV-<internalId>
      const internalOrderId = order_id.replace('FAV-', '');

      if (internalOrderId && !isNaN(parseInt(internalOrderId))) {
        try {
          await storage.updateOrder(parseInt(internalOrderId), {
            shipdayStatus: status,
            ...(tracking_info && { trackingInfo: JSON.stringify(tracking_info) }),
          });
          console.log(`Updated order #${internalOrderId} ShipDay status to: ${status}`);
        } catch (updateError: any) {
          console.error(`Failed to update order #${internalOrderId}:`, updateError.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/shipday/webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
