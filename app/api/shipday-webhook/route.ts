import { NextRequest, NextResponse } from 'next/server';
import { shipdayService } from '@/lib/shipday';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    await shipdayService.handleWebhook(payload);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('POST /api/shipday-webhook error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
