import { NextResponse } from 'next/server';

// Advent calendar feature scrapped — no Toast write capability.
export async function GET() {
  return NextResponse.json({ enabled: false, calendar: [], daysUntilChristmas: null });
}

export async function POST() {
  return NextResponse.json({ error: 'Feature not available' }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Feature not available' }, { status: 404 });
}
