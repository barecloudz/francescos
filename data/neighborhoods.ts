// Neighborhood data for SEO landing pages
export interface NeighborhoodData {
  slug: string; // URL slug (e.g., "garden-city")
  name: string; // Display name (e.g., "Garden City Beach")
  title: string; // Page title for SEO
  metaDescription: string; // Meta description
  heroSubheadline: string; // Hero subheadline
  introText: string; // Unique intro paragraph
  distanceFromFrancescos: string; // e.g., "2 miles north"
  deliveryTime: string; // e.g., "15-25 minutes"
  areasServed: string[]; // List of specific areas within neighborhood
  landmarks: string[]; // 2-3 local landmarks
  localAnecdote: string; // Community connection story
  testimonials: {
    name: string;
    location: string;
    text: string;
    rating: number;
  }[];
  keywords: string[]; // SEO keywords for this neighborhood
}

import { gardenCityData } from './neighborhoods/garden-city';
import { surfsideBeachData } from './neighborhoods/surfside-beach';
import { myrtleBeachData } from './neighborhoods/myrtle-beach';
import { northMyrtleBeachData } from './neighborhoods/north-myrtle-beach';
import { pawleysIslandData } from './neighborhoods/pawleys-island';
import { litchfieldBeachData } from './neighborhoods/litchfield-beach';
import { conwayData } from './neighborhoods/conway';
import { socasteeData } from './neighborhoods/socastee';
import { carolinaForestData } from './neighborhoods/carolina-forest';
import { marketCommonData } from './neighborhoods/market-common';
import { broadwayAtTheBeachData } from './neighborhoods/broadway-at-the-beach';
import { barefootResortData } from './neighborhoods/barefoot-resort';
import { littleRiverData } from './neighborhoods/little-river';
import { lorisData } from './neighborhoods/loris';
import { andrewsData } from './neighborhoods/andrews';
import { georgetownData } from './neighborhoods/georgetown-sc';
import { murrellsInletData } from './neighborhoods/murrells-inlet';
import { bucksportData } from './neighborhoods/bucksport';
import { forestbrookData } from './neighborhoods/forestbrook';
import { aynorData } from './neighborhoods/aynor';

export const allNeighborhoods: NeighborhoodData[] = [
  gardenCityData,
  surfsideBeachData,
  myrtleBeachData,
  northMyrtleBeachData,
  pawleysIslandData,
  litchfieldBeachData,
  conwayData,
  socasteeData,
  carolinaForestData,
  marketCommonData,
  broadwayAtTheBeachData,
  barefootResortData,
  littleRiverData,
  lorisData,
  andrewsData,
  georgetownData,
  murrellsInletData,
  bucksportData,
  forestbrookData,
  aynorData,
];

// Keep backward compatibility
export const neighborhoods = allNeighborhoods;

export function getAllNeighborhoodSlugs(): string[] {
  return allNeighborhoods.map(n => n.slug);
}

export function getNeighborhoodData(slug: string): NeighborhoodData | undefined {
  return allNeighborhoods.find(n => n.slug === slug);
}
