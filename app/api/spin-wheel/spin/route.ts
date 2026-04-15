import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-utils';

const SLICES = [
  { id: 1, label: '10% OFF', probability: 30, color: '#FF6B6B', isActive: true, reward: '10% discount on next order' },
  { id: 2, label: 'FREE DRINK', probability: 20, color: '#4ECDC4', isActive: true, reward: 'Free beverage with any order' },
  { id: 3, label: 'FREE APPETIZER', probability: 15, color: '#45B7D1', isActive: true, reward: 'Free appetizer with any order' },
  { id: 4, label: '20% OFF', probability: 10, color: '#96CEB4', isActive: true, reward: '20% discount on next order' },
  { id: 5, label: 'FREE PIZZA', probability: 5, color: '#FFEAA7', isActive: true, reward: 'Free medium pizza' },
  { id: 6, label: 'TRY AGAIN', probability: 20, color: '#DDA0DD', isActive: true, reward: 'Better luck next time!' },
];

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const activeSlices = SLICES.filter(s => s.isActive);
    const totalProbability = activeSlices.reduce((sum, s) => sum + s.probability, 0);
    const random = Math.random() * totalProbability;

    let currentSum = 0;
    let winningSlice = activeSlices[activeSlices.length - 1];

    for (const slice of activeSlices) {
      currentSum += slice.probability;
      if (random <= currentSum) {
        winningSlice = slice;
        break;
      }
    }

    console.log(`User ${user.id} spun the wheel and won: ${winningSlice.label}`);

    return NextResponse.json({
      success: true,
      reward: winningSlice,
      message: `Congratulations! You won: ${winningSlice.label}`,
    });
  } catch (error: any) {
    console.error('POST /api/spin-wheel/spin error:', error);
    return NextResponse.json({ success: false, message: 'Spin failed', error: error.message }, { status: 500 });
  }
}
