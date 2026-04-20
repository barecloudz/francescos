import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const animations = await sql`
      SELECT id, animation_key, is_enabled, settings, pages, start_date, end_date
      FROM animations_settings
      ORDER BY id ASC
    `;
    return NextResponse.json(animations);
  } catch {
    // Table may not exist yet — return empty array so the app doesn't crash
    return NextResponse.json([]);
  }
}
