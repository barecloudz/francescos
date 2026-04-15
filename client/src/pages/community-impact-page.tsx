import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import {
  HeartHandshake,
  Calendar,
  Tag,
  Globe,
  ArrowRight,
  DollarSign,
  Users,
  Heart,
  Clock
} from 'lucide-react';
import Footer from '@/components/layout/footer';

interface CharityOrganization {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  promoCode: string;
  websiteUrl: string | null;
  customerDiscount: number;
  donationPercent: number;
  featuredDays: string[] | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
  totalRaised: string | null;
}

interface CommunityImpactSettings {
  comingSoon: boolean;
  pageTitle: string;
  pageDescription: string;
  monthlyGoal: string | null;
}

const CommunityImpactPage: React.FC = () => {
  // Fetch settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/community-impact/settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/community-impact/settings');
      return await response.json();
    }
  });

  // Fetch active charities
  const { data: charities, isLoading: charitiesLoading } = useQuery({
    queryKey: ['/api/charities/active'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/charities/active');
      return await response.json();
    }
  });

  const isLoading = settingsLoading || charitiesLoading;

  // Calculate totals
  const totalRaised = charities?.reduce((sum: number, charity: CharityOrganization) => {
    return sum + parseFloat(charity.totalRaised || '0');
  }, 0) || 0;

  const getTodaysFeaturedCharity = () => {
    if (!charities || charities.length === 0) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return charities.find((c: CharityOrganization) =>
      c.featuredDays && c.featuredDays.includes(today)
    );
  };

  const todaysFeatured = getTodaysFeaturedCharity();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Coming Soon mode
  if (settings?.comingSoon) {
    return (
      <>
        <Helmet>
          <title>Community Impact - Coming Soon | Francesco's Pizza Kitchen</title>
          <meta name="description" content="We're launching our community impact program soon. Stay tuned to learn how Francesco's Pizza gives back to Murrells Inlet!" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-24">
          <div className="container mx-auto px-4 py-16 text-center">
            <HeartHandshake className="h-24 w-24 mx-auto text-red-500 mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Community Impact
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're working on something special! Our community giving program is coming soon.
              Check back to see how Francesco's Pizza Kitchen gives back to Murrells Inlet.
            </p>
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <Clock className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-gray-600">
                Sign up for updates to be the first to know when we launch our community partnership program.
              </p>
            </div>
            <Link href="/">
              <Button className="mt-8 bg-red-500 hover:bg-red-600">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{settings?.pageTitle || 'Community Impact'} | Francesco's Pizza Kitchen</title>
        <meta name="description" content="Discover how Francesco's Pizza Kitchen partners with local organizations to give back to the Murrells Inlet community. Use partner promo codes for discounts while supporting great causes!" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <HeartHandshake className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {settings?.pageTitle || 'Community Impact'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {settings?.pageDescription || "At Francesco's Pizza Kitchen, we believe in giving back to the community that has supported us for over 40 years. Each month, we partner with local organizations to make a real difference in Murrells Inlet."}
          </p>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-bold mb-2">1. Monthly Partnerships</h3>
                <p className="text-sm text-gray-600">
                  Each month, we select local organizations to partner with
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-bold mb-2">2. Dedicated Days</h3>
                <p className="text-sm text-gray-600">
                  Each partner gets dedicated days where orders support them
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-bold mb-2">3. Promo Codes</h3>
                <p className="text-sm text-gray-600">
                  Use the partner's promo code for a discount while we donate a portion
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-bold mb-2">4. Monthly Results</h3>
                <p className="text-sm text-gray-600">
                  At month's end, each organization receives their total raised
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-red-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">${totalRaised.toFixed(2)}</p>
                <p className="text-red-100">Total Raised</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">{charities?.length || 0}</p>
                <p className="text-red-100">Active Partners</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">10%</p>
                <p className="text-red-100">Donated Per Order</p>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Featured Partner */}
        {todaysFeatured && (
          <section className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-yellow-500 text-white">Today's Featured Partner</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  {todaysFeatured.imageUrl ? (
                    <img
                      src={todaysFeatured.imageUrl}
                      alt={todaysFeatured.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-64 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <HeartHandshake className="h-24 w-24 text-yellow-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{todaysFeatured.name}</h3>
                  <p className="text-gray-600 mb-4">{todaysFeatured.description}</p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Your Discount</span>
                      <span className="font-bold text-green-600">{todaysFeatured.customerDiscount}% OFF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">We Donate</span>
                      <span className="font-bold text-red-500">{todaysFeatured.donationPercent}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 text-white rounded-lg p-4 text-center mb-4">
                    <p className="text-sm text-gray-400">Use code at checkout</p>
                    <p className="text-2xl font-mono font-bold">{todaysFeatured.promoCode}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/menu">
                      <Button className="bg-red-500 hover:bg-red-600">
                        Order Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    {todaysFeatured.websiteUrl && (
                      <a href={todaysFeatured.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          <Globe className="mr-2 h-4 w-4" /> Visit Website
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Partners */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">This Month's Partners</h2>

          {charities?.length === 0 ? (
            <div className="text-center py-12">
              <HeartHandshake className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No active partners this month. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charities?.map((charity: CharityOrganization) => (
                <Card key={charity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {charity.imageUrl ? (
                    <img
                      src={charity.imageUrl}
                      alt={charity.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <HeartHandshake className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{charity.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{charity.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <Tag className="h-4 w-4" />
                        {charity.customerDiscount}% off
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <Heart className="h-4 w-4" />
                        {charity.donationPercent}% donated
                      </span>
                    </div>

                    {charity.featuredDays && charity.featuredDays.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Featured: {charity.featuredDays.join(', ')}
                      </p>
                    )}

                    <div className="bg-gray-100 rounded-lg p-3 text-center mb-4">
                      <p className="text-xs text-gray-500">Promo Code</p>
                      <p className="font-mono font-bold text-lg">{charity.promoCode}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href="/menu" className="flex-1">
                        <Button className="w-full bg-red-500 hover:bg-red-600" size="sm">
                          Order Now
                        </Button>
                      </Link>
                      {charity.websiteUrl && (
                        <a href={charity.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl mb-6 text-red-100">
                Order today and support our community partners. Every pizza helps!
              </p>
              <Link href="/menu">
                <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Partner With Us */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Partner With Us?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you represent a local non-profit or community organization in Murrells Inlet and would like to partner with Francesco's Pizza Kitchen, we'd love to hear from you!
          </p>
          <a href="mailto:info@francescospizzamb.com?subject=Community Impact Partnership Inquiry">
            <Button variant="outline" size="lg">
              Contact Us About Partnerships
            </Button>
          </a>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default CommunityImpactPage;
