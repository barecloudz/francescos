import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-utils';

// This endpoint previously sent a test print to a thermal printer.
// In the Next.js/serverless environment printer hardware is not available,
// so we return the processed template content instead for preview purposes.
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { template } = body;

    const sampleData = {
      orderNumber: 'TEST-' + Date.now(),
      orderTime: new Date().toLocaleString(),
      customerName: 'Test Customer',
      customerPhone: '(843) 555-1234',
      customerEmail: 'test@example.com',
      orderType: 'pickup',
      deliveryAddress: '',
      paymentMethod: 'card',
      staffMember: 'Admin',
      estimatedReadyTime: new Date(Date.now() + 20 * 60000).toLocaleTimeString(),
      total: '23.99',
      items: [
        { name: 'Margherita Pizza 12"', quantity: 1, price: 14.99, itemTotal: '14.99', modifications: ['Extra cheese'], specialInstructions: 'Well done' },
        { name: 'Garlic Bread', quantity: 2, price: 4.50, itemTotal: '9.00', modifications: [], specialInstructions: '' },
      ],
    };

    // Process template variables
    let processed = template;
    Object.entries(sampleData).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Template preview generated (printer not available in serverless environment)',
      preview: processed,
    });
  } catch (error: any) {
    console.error('POST /api/admin/test-receipt error:', error);
    return NextResponse.json({ success: false, message: 'Test preview failed', error: error.message }, { status: 500 });
  }
}
