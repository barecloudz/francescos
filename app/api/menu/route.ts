import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertMenuItemSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const menuItems = await storage.getAllMenuItems();

    // If no menu items exist, seed sample data so the storefront is never empty
    // on a fresh database.
    if (!menuItems || menuItems.length === 0) {
      const sampleItems = [
        { name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, and basil', basePrice: '12.99', category: 'Traditional Pizza', imageUrl: '/images/f1.png', isAvailable: true },
        { name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella and tomato sauce', basePrice: '14.99', category: 'Traditional Pizza', imageUrl: '/images/f2.jpg', isAvailable: true },
        { name: 'BBQ Chicken Pizza (10")', description: 'BBQ sauce, grilled chicken, red onions, and mozzarella', basePrice: '16.99', category: '10" Specialty Gourmet Pizzas', imageUrl: '/images/f3.jpg', isAvailable: true },
        { name: 'Buffalo Chicken Pizza (10")', description: 'Buffalo sauce, grilled chicken, blue cheese, and celery', basePrice: '17.99', category: '10" Specialty Gourmet Pizzas', imageUrl: '/images/f4.jpg', isAvailable: true },
        { name: 'Supreme Pizza (14")', description: 'Pepperoni, sausage, bell peppers, onions, mushrooms, olives', basePrice: '22.99', category: '14" Specialty Gourmet Pizzas', imageUrl: '/images/f5.jpg', isAvailable: true },
        { name: 'Hawaiian Pizza (14")', description: 'Ham, pineapple, and mozzarella cheese', basePrice: '20.99', category: '14" Specialty Gourmet Pizzas', imageUrl: '/images/f6.jpg', isAvailable: true },
        { name: 'Meat Lovers Pizza (16")', description: 'Pepperoni, sausage, bacon, ham, and mozzarella', basePrice: '28.99', category: '16" Specialty Gourmet Pizzas', imageUrl: '/images/f1.png', isAvailable: true },
        { name: 'Sicilian Margherita', description: 'Thick crust Sicilian style with fresh mozzarella and basil', basePrice: '18.99', category: 'Sicilian Pizzas', imageUrl: '/images/f2.jpg', isAvailable: true },
        { name: 'Garlic Bread', description: 'Fresh baked bread with garlic butter and herbs', basePrice: '4.99', category: 'Appetizers', imageUrl: '/images/f3.jpg', isAvailable: true },
        { name: 'Mozzarella Sticks', description: 'Breaded mozzarella sticks served with marinara sauce', basePrice: '6.99', category: 'Appetizers', imageUrl: '/images/f4.jpg', isAvailable: true },
        { name: 'Caesar Salad', description: 'Fresh romaine lettuce, parmesan cheese, and caesar dressing', basePrice: '8.99', category: 'Sides', imageUrl: '/images/f5.jpg', isAvailable: true },
        { name: 'French Fries', description: 'Crispy golden fries served with ketchup', basePrice: '3.99', category: 'Sides', imageUrl: '/images/f6.jpg', isAvailable: true },
        { name: 'Tiramisu', description: 'Classic Italian dessert with coffee and mascarpone', basePrice: '6.99', category: 'Desserts', imageUrl: '/images/f1.png', isAvailable: true },
        { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', basePrice: '7.99', category: 'Desserts', imageUrl: '/images/f2.jpg', isAvailable: true },
        { name: 'Coca-Cola', description: 'Classic Coca-Cola soft drink', basePrice: '2.99', category: 'Beverages', imageUrl: '/images/f3.jpg', isAvailable: true },
        { name: 'Italian Soda', description: 'Sparkling water with flavored syrup', basePrice: '3.99', category: 'Beverages', imageUrl: '/images/f4.jpg', isAvailable: true },
      ];

      const created = [];
      for (const item of sampleItems) {
        created.push(await storage.createMenuItem(item));
      }

      return NextResponse.json(created, {
        headers: { 'Cache-Control': 'public, max-age=300' },
      });
    }

    return NextResponse.json(menuItems, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error: any) {
    console.error('GET /api/menu error:', error);
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
    const validatedData = insertMenuItemSchema.parse(body);
    const menuItem = await storage.createMenuItem(validatedData);
    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error('POST /api/menu error:', error);
    return NextResponse.json({ message: 'Failed to create menu item' }, { status: 500 });
  }
}
