import { NextRequest, NextResponse } from 'next/server';

// FAQs are not yet in the database. Return an empty array so the frontend
// doesn't retry on a 404. Populate via admin panel once the table is set up.
export async function GET(request: NextRequest) {
  return NextResponse.json([]);
}
