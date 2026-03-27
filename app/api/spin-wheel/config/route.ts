import { NextResponse } from 'next/server';

// Default spin wheel configuration. In a future iteration this would be
// stored per-restaurant in the database via a dedicated table.
const DEFAULT_CONFIG = {
  slices: [
    { id: 1, label: '10% OFF', probability: 30, color: '#FF6B6B', isActive: true, reward: '10% discount on next order' },
    { id: 2, label: 'FREE DRINK', probability: 20, color: '#4ECDC4', isActive: true, reward: 'Free beverage with any order' },
    { id: 3, label: 'FREE APPETIZER', probability: 15, color: '#45B7D1', isActive: true, reward: 'Free appetizer with any order' },
    { id: 4, label: '20% OFF', probability: 10, color: '#96CEB4', isActive: true, reward: '20% discount on next order' },
    { id: 5, label: 'FREE PIZZA', probability: 5, color: '#FFEAA7', isActive: true, reward: 'Free medium pizza' },
    { id: 6, label: 'TRY AGAIN', probability: 20, color: '#DDA0DD', isActive: true, reward: 'Better luck next time!' },
  ],
};

export async function GET() {
  return NextResponse.json(DEFAULT_CONFIG);
}

export async function POST() {
  // Placeholder — future implementation would persist config to the database.
  return NextResponse.json(DEFAULT_CONFIG);
}
