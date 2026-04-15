import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NeighborhoodPageTemplate from '@/components/neighborhood/neighborhood-page-template';
import { getNeighborhoodData, getAllNeighborhoodSlugs } from '@/data/neighborhoods';

interface Props {
  params: Promise<{ neighborhood: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllNeighborhoodSlugs();
  return slugs.map((neighborhood) => ({ neighborhood }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood } = await params;
  const data = getNeighborhoodData(neighborhood);
  if (!data) return { title: "Not Found" };
  return {
    title: data.title,
    description: data.metaDescription,
    alternates: { canonical: `https://francescosmurrellsinlet.com/${data.slug}` },
    keywords: data.keywords.join(', '),
  };
}

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood } = await params;
  const data = getNeighborhoodData(neighborhood);
  if (!data) notFound();
  return <NeighborhoodPageTemplate data={data} />;
}
