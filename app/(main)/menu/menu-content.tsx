'use client';

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVacationMode } from "@/hooks/use-vacation-mode";
import { useStoreStatus } from "@/hooks/use-store-status";

const TOAST_ORDER_URL = "https://order.toasttab.com/online/francesco's-pizza-pasta-murrells-inlet";

const CATEGORY_STYLES: Record<string, { emoji: string; bg: string }> = {
  'Pizza': { emoji: '🍕', bg: 'bg-red-50' },
  "Francesco's Squared": { emoji: '🍕', bg: 'bg-rose-50' },
  'Cauliflower Pizza GF': { emoji: '🌿', bg: 'bg-green-50' },
  'Stromboli': { emoji: '🥙', bg: 'bg-amber-50' },
  'Cheese Calzone': { emoji: '🥪', bg: 'bg-orange-50' },
  'Salads': { emoji: '🥗', bg: 'bg-emerald-50' },
  'Appetizers': { emoji: '🧀', bg: 'bg-yellow-50' },
  'Wings': { emoji: '🍗', bg: 'bg-orange-50' },
  'Pasta Classics': { emoji: '🍝', bg: 'bg-yellow-50' },
  'Baked Pasta': { emoji: '🍝', bg: 'bg-amber-50' },
  'Entrees': { emoji: '🍽️', bg: 'bg-purple-50' },
  'Heros': { emoji: '🥖', bg: 'bg-amber-50' },
  'Wraps & Paninis': { emoji: '🌯', bg: 'bg-teal-50' },
  'Desserts': { emoji: '🍰', bg: 'bg-pink-50' },
};
const DEFAULT_STYLE = { emoji: '🍴', bg: 'bg-gray-50' };

const MenuContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const { isOrderingPaused, displayMessage } = useVacationMode();
  const { isPastCutoff, cutoffMessage, storeStatus } = useStoreStatus();

  // Check if delivery is available
  const { data: deliveryAvailability } = useQuery({
    queryKey: ['delivery-availability'],
    queryFn: async () => {
      const response = await fetch('/api/delivery-availability');
      if (response.ok) {
        return await response.json();
      }
      return { delivery_enabled: true };
    }
  });
  const isDeliveryDisabled = deliveryAvailability?.delivery_enabled === false;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
      return "0.00";
    }
    return numPrice.toFixed(2);
  };

  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ["/api/toast-menu"],
    queryFn: async () => {
      const response = await fetch('/api/toast-menu');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to load menu');
    }
  });

  // Keep existing data fetching hooks
  const { data: choiceGroups = [] } = useQuery({
    queryKey: ['choice-groups'],
    queryFn: async () => {
      const response = await fetch('/api/choice-groups');
      if (response.ok) return await response.json();
      return [];
    }
  });

  const { data: choiceItems = [] } = useQuery({
    queryKey: ['choice-items'],
    queryFn: async () => {
      const response = await fetch('/api/choice-items');
      if (response.ok) return await response.json();
      return [];
    }
  });

  const { data: categoryChoiceGroups = [] } = useQuery({
    queryKey: ['category-choice-groups'],
    queryFn: async () => {
      const response = await fetch('/api/category-choice-groups');
      if (response.ok) return await response.json();
      return [];
    }
  });

  const { data: menuItemChoiceGroups = [] } = useQuery({
    queryKey: ['menu-item-choice-groups'],
    queryFn: async () => {
      const response = await fetch('/api/menu-item-choice-groups');
      if (response.ok) return await response.json();
      return [];
    }
  });

  // Derive categories directly from Toast menu items
  const categoriesData = React.useMemo(() => {
    if (!menuItems || menuItems.length === 0) return { categories: [] };
    const seen = new Set<string>();
    const categories: any[] = [];
    let order = 1;
    for (const item of menuItems) {
      const name = item.category || 'Other';
      if (!seen.has(name)) {
        seen.add(name);
        categories.push({ id: order, name, order: order++, isActive: true, imageUrl: null, isTemporarilyUnavailable: false });
      }
    }
    return { categories };
  }, [menuItems]);

  // Get category and item from URL params
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const categoryFromUrl = urlParams.get('category');
  const itemIdFromUrl = urlParams.get('item');

  // Set initial category from URL
  useEffect(() => {
    if (categoryFromUrl && !selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, selectedCategory]);

  // Handle direct link to specific item from homepage
  const hasScrolledToItem = useRef(false);

  useEffect(() => {
    if (itemIdFromUrl && menuItems && menuItems.length > 0 && !hasScrolledToItem.current) {
      const targetItem = menuItems.find((item: any) => item.id === parseInt(itemIdFromUrl));
      if (targetItem) {
        hasScrolledToItem.current = true;
        setTimeout(() => {
          const itemElement = document.getElementById(`menu-item-${targetItem.id}`);
          if (itemElement) {
            itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            itemElement.classList.add('ring-4', 'ring-red-500', 'ring-offset-2');
            setTimeout(() => {
              itemElement.classList.remove('ring-4', 'ring-red-500', 'ring-offset-2');
            }, 3000);
          }
        }, 300);
      }
    }
  }, [itemIdFromUrl, menuItems]);

  // Categories with item counts
  const categories = (categoriesData?.categories || [])
    .map((cat: any) => ({
      id: cat.name,
      name: cat.name,
      count: (menuItems || []).filter((item: any) => item.category === cat.name).length,
    }))
    .filter((cat: any) => cat.count > 0);

  const isSearchActive = searchQuery.trim().length > 0;

  const filteredItems = (menuItems || []).filter((item: any) => {
    const matchesSearch =
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const itemCategory = categoriesData?.categories?.find((cat: any) => cat.name === item.category);
    const categoryUnavailable = itemCategory?.isTemporarilyUnavailable || false;

    if (item.isAvailable === false || categoryUnavailable) return false;

    if (isSearchActive) return matchesSearch;

    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesCategory;
  });

  // Group items by category for display
  const itemsByCategory = (filteredItems || []).reduce((acc: any, item: any) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const sortedCategoryEntries = Object.entries(itemsByCategory).sort(
    ([catA], [catB]) => {
      const a = categoriesData?.categories?.find((c: any) => c.name === catA);
      const b = categoriesData?.categories?.find((c: any) => c.name === catB);
      return (a?.order || 999) - (b?.order || 999);
    }
  );

  const handleCategoryTabClick = (catName: string | null) => {
    setSelectedCategory(catName);
    if (catName === null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Wait a tick so the DOM updates if switching from filtered view
    setTimeout(() => {
      const el = document.getElementById(`cat-section-${catName}`);
      if (el) {
        // Offset for sticky header + red banner + tab bar (~160px total)
        const top = el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d73a31] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Failed to load menu</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-20 pt-0">

      {/* Vacation Mode Banner */}
      {isOrderingPaused && (
        <div className="bg-yellow-500 border-b-4 border-yellow-600 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-white">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-lg">ASAP Orders Temporarily Paused</p>
              <p className="text-sm mb-1">{displayMessage}</p>
              <p className="text-sm font-medium bg-yellow-600 bg-opacity-50 px-2 py-1 rounded inline-block">
                Scheduled orders for later pickup/delivery are still available!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Store Hours Cutoff Banner */}
      {!isOrderingPaused && isPastCutoff && (
        <div className="bg-yellow-500 border-b-4 border-yellow-600 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-white">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-lg">ASAP Orders Closed</p>
              <p className="text-sm mb-1">{cutoffMessage}</p>
              <p className="text-sm font-medium bg-yellow-600 bg-opacity-50 px-2 py-1 rounded inline-block">
                You can still schedule an order for when we open{storeStatus?.nextOpenTime ? ` at ${storeStatus.nextOpenTime}` : ''}!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Unavailable Banner */}
      {isDeliveryDisabled && (
        <div className="bg-red-500 border-b-4 border-red-600 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-white">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Delivery is currently unavailable. We are working to restore this.</p>
              <p className="text-sm opacity-90">Pickup orders are still available!</p>
            </div>
          </div>
        </div>
      )}

      {/* Red "Browse / Order Online" sticky banner */}
      <div className="bg-[#d73a31] px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-white text-center sm:text-left">
            <p className="font-bold text-lg leading-tight">Browse our menu below</p>
            <p className="text-red-100 text-sm">Ready to order? Place your order online through Toast</p>
          </div>
          <a
            href={TOAST_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-[#d73a31] font-bold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base whitespace-nowrap shadow-sm"
          >
            Order Online →
          </a>
        </div>
      </div>

      {/* Page header + search bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 pt-5 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
            <a
              href={TOAST_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#d73a31] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#b52e26] transition-colors text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Order Now
            </a>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Category tab bar — hidden when search is active */}
      {!isSearchActive && (
        <div className="bg-white border-b border-gray-100 sticky top-[72px] z-30 shadow-sm">
          <div
            ref={tabBarRef}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-3 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All" pill */}
            <button
              onClick={() => handleCategoryTabClick(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === null
                  ? 'bg-[#d73a31] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
              }`}
            >
              All
            </button>

            {categories.map((cat: any) => {
              const style = CATEGORY_STYLES[cat.name] ?? DEFAULT_STYLE;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryTabClick(cat.name)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? 'bg-[#d73a31] text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                  }`}
                >
                  <span aria-hidden="true">{style.emoji}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu items */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {sortedCategoryEntries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No items found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or selecting a different category</p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedCategoryEntries.map(([categoryName, items]: [string, any]) => {
                const style = CATEGORY_STYLES[categoryName] ?? DEFAULT_STYLE;
                return (
                  <section
                    key={categoryName}
                    id={`cat-section-${categoryName}`}
                    className="scroll-mt-44"
                    aria-labelledby={`cat-heading-${categoryName}`}
                  >
                    {/* Category heading */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${style.bg}`} aria-hidden="true">
                        {style.emoji}
                      </div>
                      <h2
                        id={`cat-heading-${categoryName}`}
                        className="text-xl font-bold text-gray-900"
                      >
                        {categoryName}
                      </h2>
                      <span className="text-sm text-gray-400 font-normal">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Items grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((item: any) => {
                        const hasSizes = item.sizes && item.sizes.length > 0;
                        const displayPrice = hasSizes
                          ? `from $${formatPrice(item.basePrice)}`
                          : `$${formatPrice(item.basePrice)}`;

                        return (
                          <div
                            key={item.id}
                            id={`menu-item-${item.id}`}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
                          >
                            <div className="flex items-center gap-4 p-4">
                              {/* Emoji icon */}
                              <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${style.bg}`}
                                aria-hidden="true"
                              >
                                {style.emoji}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 leading-snug">
                                  {item.name}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                                    {item.description}
                                  </p>
                                )}
                                {hasSizes && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {item.sizes.map((size: any) => (
                                      <span
                                        key={size.name}
                                        className="inline-flex items-center text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
                                      >
                                        {size.name} &mdash; ${formatPrice(size.price)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Price + order link */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0 pl-2">
                                <span className="text-[#d73a31] font-bold text-base whitespace-nowrap">
                                  {displayPrice}
                                </span>
                                <a
                                  href={TOAST_ORDER_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-[#d73a31] hover:text-[#b52e26] transition-colors whitespace-nowrap"
                                  aria-label={`Order ${item.name} online`}
                                >
                                  Order →
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuContent;
