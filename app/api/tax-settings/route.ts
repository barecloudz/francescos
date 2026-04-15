import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertTaxSettingsSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const taxSettings = await storage.getTaxSettings();
    return NextResponse.json(taxSettings || {
      taxApplication: 'on_top',
      taxName: 'Sales Tax',
      deliveryFeeTaxRate: '0',
      tipsTaxRate: '0',
      serviceFeeTaxRate: '4.75',
      currency: 'USD',
      currencySymbol: '$',
      currencyPosition: 'before',
      decimalPlaces: 2,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertTaxSettingsSchema.partial().parse(body);
    const taxSettings = await storage.updateTaxSettings(validatedData);

    if (!taxSettings) {
      return NextResponse.json({ message: 'Failed to update tax settings' }, { status: 500 });
    }

    return NextResponse.json(taxSettings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update tax settings' }, { status: 500 });
  }
}
