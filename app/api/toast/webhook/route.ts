import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/toast/webhook
 * Receives real-time event pushes from Toast.
 * Register this URL in Toast Web → Developers → Webhooks.
 *
 * Supported event types (Standard tier):
 *   - MENU_PUBLISHED        → menu changed, trigger re-sync
 *   - ITEM_AVAILABILITY     → item 86'd or restocked
 *   - RESTAURANT_AVAILABILITY → location went online/offline
 *   - DIGITAL_SCHEDULE      → online ordering hours changed
 *   - ORDER                 → new/updated order
 *   - GUEST_ORDER_FULFILLMENT_STATUS → order ready/picked up
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType: string = body.eventType ?? body.type ?? 'UNKNOWN';

    console.log(`[Toast Webhook] Received event: ${eventType}`, JSON.stringify(body).slice(0, 500));

    switch (eventType) {
      case 'MENU_PUBLISHED': {
        // Menu changed in Toast — log for now, can trigger DB sync here later
        console.log('[Toast Webhook] Menu published — schedule a menu sync');
        break;
      }

      case 'ITEM_AVAILABILITY': {
        // Item went in/out of stock
        const items = body.availability ?? [];
        console.log(`[Toast Webhook] Stock change for ${items.length} items`);
        break;
      }

      case 'ORDER': {
        const order = body.order ?? body;
        console.log(`[Toast Webhook] Order event: ${order.guid ?? 'unknown guid'}`);
        break;
      }

      case 'RESTAURANT_AVAILABILITY': {
        console.log('[Toast Webhook] Restaurant availability changed:', body.online);
        break;
      }

      case 'DIGITAL_SCHEDULE': {
        console.log('[Toast Webhook] Online ordering schedule updated');
        break;
      }

      default:
        console.log(`[Toast Webhook] Unhandled event type: ${eventType}`);
    }

    // Toast expects a 200 response to confirm receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Toast Webhook] Error:', error.message);
    // Still return 200 so Toast doesn't retry endlessly
    return NextResponse.json({ received: true, error: error.message });
  }
}
