import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [row] = await sql`
      SELECT value FROM restaurant_settings WHERE key = 'catering_button_enabled' LIMIT 1
    `;
    return NextResponse.json({
      catering_button_enabled: row ? row.value !== 'false' : true
    });
  } catch {
    return NextResponse.json({ catering_button_enabled: true });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const enabled = body.catering_button_enabled !== false;

    await sql`
      INSERT INTO restaurant_settings (key, value)
      VALUES ('catering_button_enabled', ${String(enabled)})
      ON CONFLICT (key) DO UPDATE SET value = ${String(enabled)}
    `;

    return NextResponse.json({ catering_button_enabled: enabled });
  } catch {
    return NextResponse.json({ catering_button_enabled: true });
  }
}
