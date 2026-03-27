import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const deliverySettings = await storage.getDeliverySettings();
    const deliveryZones = await storage.getDeliveryZones();

    if (!deliverySettings) {
      return NextResponse.json({ error: 'Delivery settings not configured' }, { status: 500 });
    }

    // Return fallback fee when Google Maps is not configured
    if (!deliverySettings.isGoogleMapsEnabled || !deliverySettings.googleMapsApiKey) {
      return NextResponse.json({
        success: true,
        distance: null,
        deliveryFee: parseFloat(deliverySettings.fallbackDeliveryFee),
        zone: null,
        isEstimate: true,
        message: 'Delivery fee calculated using fallback pricing',
      });
    }

    // Calculate distance via Google Maps Distance Matrix API
    const distance = await storage.calculateDistance(
      deliverySettings.restaurantAddress,
      address,
      deliverySettings.googleMapsApiKey
    );

    // Block orders beyond the configured radius
    if (distance > parseFloat(deliverySettings.maxDeliveryRadius)) {
      return NextResponse.json({
        success: false,
        distance,
        deliveryFee: 0,
        zone: null,
        isEstimate: false,
        message: `Delivery not available. Address is ${distance.toFixed(2)} miles away (max: ${deliverySettings.maxDeliveryRadius} miles)`,
      });
    }

    // Select the cheapest applicable zone for this distance
    const activeZones = deliveryZones.filter((zone: any) => zone.isActive);
    const sortedZones = activeZones.sort((a: any, b: any) => parseFloat(a.maxRadius) - parseFloat(b.maxRadius));

    let selectedZone = null;
    let deliveryFee = parseFloat(deliverySettings.fallbackDeliveryFee);

    for (const zone of sortedZones) {
      if (distance <= parseFloat(zone.maxRadius)) {
        selectedZone = zone;
        deliveryFee = parseFloat(zone.deliveryFee);
        break;
      }
    }

    if (!selectedZone) {
      return NextResponse.json({
        success: false,
        distance,
        deliveryFee: 0,
        zone: null,
        isEstimate: false,
        message: `Delivery not available to this location (${distance.toFixed(2)} miles)`,
      });
    }

    return NextResponse.json({
      success: true,
      distance: Math.round(distance * 100) / 100,
      deliveryFee,
      zone: { id: selectedZone.id, name: selectedZone.name, maxRadius: selectedZone.maxRadius },
      isEstimate: false,
      message: `Delivery available to ${selectedZone.name} (${distance.toFixed(2)} miles away)`,
    });
  } catch (error: any) {
    console.error('POST /api/delivery-fee error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
