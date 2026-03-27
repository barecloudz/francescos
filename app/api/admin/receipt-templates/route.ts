import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

function getDefaultCustomerTemplate(): string {
  return `FRANCESCO'S PIZZA & PASTA
2539 US-17S #6, Murrells Inlet SC
(843) 299-2700
======================

Order #: {{orderNumber}}
Time: {{orderTime}}
Customer: {{customerName}}
Ready: {{estimatedReadyTime}}
Type: {{orderType}}

ITEMS:
----------------------
{{#items}}
{{quantity}}x {{name}}
{{#modifications}}
  + {{.}}
{{/modifications}}
    ${{itemTotal}}
{{/items}}

======================
TOTAL: ${{total}}
Payment: {{paymentMethod}}

Thank you for your order!
{{#isPickup}}
Please wait for pickup call
{{/isPickup}}
{{#isDelivery}}
Your order is being prepared for delivery
{{/isDelivery}}

Visit us again soon!`;
}

function getDefaultKitchenTemplate(): string {
  return `*** KITCHEN COPY ***
===================

ORDER #{{orderNumber}}
{{orderTime}}
Customer: {{customerName}}
Type: {{orderType}}
{{#deliveryAddress}}
Address: {{deliveryAddress}}
{{/deliveryAddress}}

ITEMS TO PREPARE:
-----------------
{{#items}}
[{{quantity}}] {{name}}
{{#modifications}}
  >> {{.}}
{{/modifications}}
{{/items}}
===================`;
}

function getDefaultRecordsTemplate(): string {
  return `*** RECORDS COPY ***
FRANCESCO'S PIZZA & PASTA
===================

Order #: {{orderNumber}}
Date/Time: {{orderTime}}
Order Type: {{orderType}}

CUSTOMER INFO:
--------------
Name: {{customerName}}
Phone: {{customerPhone}}
Email: {{customerEmail}}

ORDER DETAILS:
--------------
{{#items}}
{{quantity}}x {{name}} @ ${{price}}
  Subtotal: ${{itemTotal}}
{{/items}}
===================
TOTAL: ${{total}}
Payment: {{paymentMethod}}

Record kept for business accounting purposes`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const templates = [
      {
        id: 'customer',
        name: 'Customer Receipt',
        description: 'Receipt given to customer with order details and pickup info',
        template: storage.getReceiptTemplate('customer') || getDefaultCustomerTemplate(),
        variables: ['orderNumber', 'orderTime', 'customerName', 'estimatedReadyTime', 'orderType', 'items', 'total', 'paymentMethod', 'isPickup', 'isDelivery'],
      },
      {
        id: 'kitchen',
        name: 'Kitchen Ticket',
        description: 'Ticket for kitchen staff with prep instructions (no prices)',
        template: storage.getReceiptTemplate('kitchen') || getDefaultKitchenTemplate(),
        variables: ['orderNumber', 'orderTime', 'customerName', 'orderType', 'deliveryAddress', 'items', 'estimatedReadyTime', 'isPickup', 'isDelivery'],
      },
      {
        id: 'records',
        name: 'Records Copy',
        description: 'Complete transaction record for business accounting',
        template: storage.getReceiptTemplate('records') || getDefaultRecordsTemplate(),
        variables: ['orderNumber', 'orderTime', 'orderType', 'staffMember', 'customerName', 'customerPhone', 'customerEmail', 'deliveryAddress', 'items', 'total', 'paymentMethod'],
      },
    ];

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('GET /api/admin/receipt-templates error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templates } = body;

    for (const template of templates) {
      await storage.saveReceiptTemplate(template.id, template.template);
    }

    return NextResponse.json({ success: true, message: 'Templates saved successfully' });
  } catch (error: any) {
    console.error('POST /api/admin/receipt-templates error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
