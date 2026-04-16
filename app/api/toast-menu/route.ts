import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getMenus } from '@/lib/toast-api';

// Cache the full menu build for 5 minutes — avoids hitting Toast API on every cold start
const getCachedMenu = unstable_cache(
  async () => {
    const data: any = await getMenus();
    const menus: any[] = data.menus || [];
    const modGroupRefs: Record<string, any> = data.modifierGroupReferences || {};
    const modOptionRefs: Record<string, any> = data.modifierOptionReferences || {};

    let id = 1;
    const items: any[] = [];

    for (const menu of menus) {
      for (const group of menu.menuGroups || []) {
        const categoryName: string = group.name || 'Other';
        for (const item of group.menuItems || []) {
          if (Array.isArray(item.visibility) && !item.visibility.includes('TOAST_ONLINE_ORDERING')) continue;

          let basePrice = 0;
          let sizes: { name: string; price: string }[] | undefined;

          if (item.price != null) {
            basePrice = item.price;
          } else if (item.pricingStrategy === 'SIZE_PRICE') {
            const sizeGroup = (item.modifierGroupReferences || [])
              .map((refId: number) => modGroupRefs[String(refId)])
              .find((g: any) => g?.name === 'Size');

            if (sizeGroup) {
              const sizeOptions = (sizeGroup.modifierOptionReferences || [])
                .map((optId: number) => modOptionRefs[String(optId)])
                .filter(Boolean);

              if (sizeOptions.length > 0) {
                basePrice = sizeOptions[0].price ?? 0;
                if (sizeOptions.length > 1) {
                  sizes = sizeOptions.map((o: any) => ({
                    name: o.name,
                    price: (o.price ?? 0).toFixed(2),
                  }));
                }
              }
            }
          }

          items.push({
            id: id++,
            toastGuid: item.guid,
            name: item.name,
            description: item.description || '',
            basePrice: basePrice.toFixed(2),
            category: categoryName,
            imageUrl: item.image || null,
            isAvailable: true,
            sizes,
          });
        }
      }
    }
    return items;
  },
  ['toast-menu'],
  { revalidate: 300 } // refresh every 5 minutes
);

/**
 * GET /api/toast-menu
 * Returns the cached menu (refreshed every 5 minutes from Toast API).
 */
export async function GET() {
  try {
    const items = await getCachedMenu();
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (error: any) {
    console.error('[Toast] Menu fetch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
