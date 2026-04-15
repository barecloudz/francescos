import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const storeHours = await storage.getAllStoreHours();
    return NextResponse.json(storeHours);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
