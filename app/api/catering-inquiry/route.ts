import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cateringInquiries } from '@shared/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phoneNumber,
      eventDate,
      eventType,
      guestCount,
      serviceType,
      preferredContact,
      specialRequests,
      deliveryAddress,
    } = body;

    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Save to database if table exists, otherwise just log
    try {
      await db.insert(cateringInquiries).values({
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        event_date: eventDate || null,
        event_type: eventType || null,
        guest_count: guestCount ? parseInt(guestCount) : null,
        service_type: serviceType || null,
        preferred_contact: preferredContact || 'email',
        special_requests: specialRequests || null,
        delivery_address: deliveryAddress || null,
        created_at: new Date(),
      });
    } catch (dbError) {
      // Table may not exist yet — log and continue so the customer gets a success response
      console.error('[Catering] DB insert failed (table may not exist):', dbError);
    }

    console.log('[Catering Inquiry]', { fullName, email, phoneNumber, eventDate, eventType, guestCount });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Catering] Error:', error.message);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
