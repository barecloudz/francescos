import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json({ message: 'Name and phone are required.' }, { status: 400 });
    }

    // Create table if it doesn't already exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sms_leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      INSERT INTO sms_leads (name, phone) VALUES (${name}, ${phone})
    `);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/sms-leads error:', error);
    return NextResponse.json({ message: 'Failed to save. Please try again.' }, { status: 500 });
  }
}
