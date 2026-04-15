import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertPauseServiceSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const pauseServices = await storage.getAllPauseServices();
    return NextResponse.json(pauseServices);
  } catch (error: any) {
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
    const validatedData = insertPauseServiceSchema.parse(body);
    const pauseService = await storage.createPauseService({ ...validatedData, createdBy: user.id });
    return NextResponse.json(pauseService, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create pause service' }, { status: 500 });
  }
}
