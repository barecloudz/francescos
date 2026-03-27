"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  HeartHandshake,
  Calendar,
  DollarSign,
  Tag,
  Globe,
  Image,
  Save,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface CommunityImpactSettings {
  id?: number;
  comingSoon: boolean;
  pageTitle: string;
  pageDescription: string;
  monthlyGoal: string | null;
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function CommunityImpactTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCharity, setEditingCharity] = useState<CharityOrganization | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    promoCode: '',
    websiteUrl: '',
    customerDiscount: 5,
    donationPercent: 10,
    featuredDays: [] as string[],
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 0
  });

  // Fetch charities
  const { data: charities, isLoading: charitiesLoading } = useQuery({
    queryKey: ['/api/charities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/charities');
      return await response.json();
    }
  });

  // Fetch settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/community-impact/settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/community-impact/settings');
      return await response.json();
    }
  });

  // Create charity mutation
  const createCharityMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/admin/charities', data);
      if (!response.ok) throw new Error('Failed to create charity');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charities'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Charity organization created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update charity mutation
  const updateCharityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CharityOrganization> }) => {
      const response = await apiRequest('PUT', `/api/admin/charities/${id}`, data);
      if (!response.ok) throw new Error('Failed to update charity');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charities'] });
      setEditingCharity(null);
      toast({ title: 'Success', description: 'Charity organization updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Delete charity mutation
  const deleteCharityMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/charities/${id}`);
      if (!response.ok) throw new Error('Failed to delete charity');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charities'] });
      toast({ title: 'Success', description: 'Charity organization deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: CommunityImpactSettings) => {
      const response = await apiRequest('POST', '/api/admin/community-impact/settings', data);
      if (!response.ok) throw new Error('Failed to update settings');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-impact/settings'] });
      toast({ title: 'Success', description: 'Settings updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      promoCode: '',
      websiteUrl: '',
      customerDiscount: 5,
      donationPercent: 10,
      featuredDays: [],
      startDate: '',
      endDate: '',
      isActive: true,
      displayOrder: 0
    });
  };

  const handleEditClick = (charity: CharityOrganization) => {
    setEditingCharity(charity);
    setFormData({
      name: charity.name,
      description: charity.description,
      imageUrl: charity.imageUrl || '',
      promoCode: charity.promoCode,
      websiteUrl: charity.websiteUrl || '',
      customerDiscount: charity.customerDiscount,
      donationPercent: charity.donationPercent,
      featuredDays: charity.featuredDays || [],
      startDate: charity.startDate,
      endDate: charity.endDate,
      isActive: charity.isActive,
      displayOrder: charity.displayOrder
    });
  };

  const handleSubmit = () => {
    if (editingCharity) {
      updateCharityMutation.mutate({ id: editingCharity.id, data: formData });
    } else {
      createCharityMutation.mutate(formData);
    }
  };

  const toggleFeaturedDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      featuredDays: prev.featuredDays.includes(day)
        ? prev.featuredDays.filter(d => d !== day)
        : [...prev.featuredDays, day]
    }));
  };

  const getCharityStatus = (charity: CharityOrganization) => {
    const today = new Date().toISOString().split('T')[0];
    if (!charity.isActive) return { status: 'inactive', color: 'bg-gray-500' };
    if (charity.startDate > today) return { status: 'upcoming', color: 'bg-blue-500' };
    if (charity.endDate < today) return { status: 'ended', color: 'bg-gray-500' };
    return { status: 'active', color: 'bg-green-500' };
  };

  const calculateTotalRaised = () => {
    if (!charities) return 0;
    return charities.reduce((sum: number, charity: CharityOrganization) => {
      return sum + parseFloat(charity.totalRaised || '0');
    }, 0);
  };

  if (charitiesLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-red-500" />
            Community Impact
          </h2>
          <p className="text-gray-600">Manage charity partnerships and community giving programs</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Charity Partner</DialogTitle>
            </DialogHeader>
            <CharityForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              toggleFeaturedDay={toggleFeaturedDay}
              isLoading={createCharityMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">Partner Organizations</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Partners</p>
                    <p className="text-2xl font-bold">{charities?.length || 0}</p>
                  </div>
                  <HeartHandshake className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Now</p>
                    <p className="text-2xl font-bold">
                      {charities?.filter((c: CharityOrganization) => getCharityStatus(c).status === 'active').length || 0}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Raised</p>
                    <p className="text-2xl font-bold">${calculateTotalRaised().toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-2xl font-bold">
                      {charities?.filter((c: CharityOrganization) => getCharityStatus(c).status === 'upcoming').length || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charity List */}
          <div className="grid gap-4">
            {charities?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <HeartHandshake className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
                  <p className="text-gray-500 mb-4">Start building community impact by adding your first charity partner.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Partner
                  </Button>
                </CardContent>
              </Card>
            ) : (
              charities?.map((charity: CharityOrganization) => {
                const { status, color } = getCharityStatus(charity);
                return (
                  <Card key={charity.id} className={!charity.isActive ? 'opacity-60' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {charity.imageUrl ? (
                          <img
                            src={charity.imageUrl}
                            alt={charity.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                            <HeartHandshake className="h-8 w-8 text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {charity.name}
                                <Badge className={`${color} text-white text-xs`}>
                                  {status}
                                </Badge>
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">{charity.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(charity)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  if (confirm('Delete this charity partner?')) {
                                    deleteCharityMutation.mutate(charity.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">Promo Code</p>
                              <p className="font-mono font-bold text-sm">{charity.promoCode}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Customer Discount</p>
                              <p className="font-semibold text-sm">{charity.customerDiscount}% off</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Donation</p>
                              <p className="font-semibold text-sm">{charity.donationPercent}% donated</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Raised</p>
                              <p className="font-semibold text-sm text-green-600">${parseFloat(charity.totalRaised || '0').toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(charity.startDate).toLocaleDateString()} - {new Date(charity.endDate).toLocaleDateString()}
                            </span>
                            {charity.featuredDays && charity.featuredDays.length > 0 && (
                              <span>Featured: {charity.featuredDays.join(', ')}</span>
                            )}
                            {charity.websiteUrl && (
                              <a
                                href={charity.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:underline"
                              >
                                <Globe className="h-4 w-4" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Configure how the Community Impact page appears to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Coming Soon Mode</Label>
                  <p className="text-sm text-gray-500">Show a "Coming Soon" message instead of the full page</p>
                </div>
                <Switch
                  checked={settings?.comingSoon ?? true}
                  onCheckedChange={(checked) => {
                    updateSettingsMutation.mutate({
                      ...settings,
                      comingSoon: checked
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={settings?.pageTitle || 'Community Impact'}
                  onChange={(e) => {
                    updateSettingsMutation.mutate({
                      ...settings,
                      pageTitle: e.target.value
                    });
                  }}
                  placeholder="Community Impact"
                />
              </div>

              <div className="space-y-2">
                <Label>Page Description</Label>
                <Textarea
                  value={settings?.pageDescription || ''}
                  onChange={(e) => {
                    updateSettingsMutation.mutate({
                      ...settings,
                      pageDescription: e.target.value
                    });
                  }}
                  placeholder="Describe your community impact program..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Monthly Goal ($)</Label>
                <Input
                  type="number"
                  value={settings?.monthlyGoal || ''}
                  onChange={(e) => {
                    updateSettingsMutation.mutate({
                      ...settings,
                      monthlyGoal: e.target.value
                    });
                  }}
                  placeholder="1000"
                />
                <p className="text-sm text-gray-500">Set a monthly fundraising goal to display on the page</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Program Statistics</CardTitle>
              <CardDescription>Overview of your community impact program performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">All-Time Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Raised</span>
                      <span className="font-bold text-green-600">${calculateTotalRaised().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Partner Organizations</span>
                      <span className="font-bold">{charities?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Partners</span>
                      <span className="font-bold">{charities?.filter((c: CharityOrganization) => c.isActive).length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Top Performers</h3>
                  <div className="space-y-2">
                    {charities?.sort((a: CharityOrganization, b: CharityOrganization) =>
                      parseFloat(b.totalRaised || '0') - parseFloat(a.totalRaised || '0')
                    ).slice(0, 3).map((charity: CharityOrganization, index: number) => (
                      <div key={charity.id} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-gray-400">{index + 1}.</span>
                          {charity.name}
                        </span>
                        <span className="font-semibold">${parseFloat(charity.totalRaised || '0').toFixed(2)}</span>
                      </div>
                    ))}
                    {(!charities || charities.length === 0) && (
                      <p className="text-gray-500 text-sm">No data yet</p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Program Health</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {settings?.comingSoon ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>Page in Coming Soon mode</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Page is live</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {charities?.some((c: CharityOrganization) => getCharityStatus(c).status === 'active') ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Active partners available</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>No active partners</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingCharity} onOpenChange={(open) => !open && setEditingCharity(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Charity Partner</DialogTitle>
          </DialogHeader>
          <CharityForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            toggleFeaturedDay={toggleFeaturedDay}
            isLoading={updateCharityMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Charity form component
interface CharityFormProps {
  formData: {
    name: string;
    description: string;
    imageUrl: string;
    promoCode: string;
    websiteUrl: string;
    customerDiscount: number;
    donationPercent: number;
    featuredDays: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    displayOrder: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  onSubmit: () => void;
  toggleFeaturedDay: (day: string) => void;
  isLoading: boolean;
}

function CharityForm({ formData, setFormData, onSubmit, toggleFeaturedDay, isLoading }: CharityFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Organization Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Local Food Bank"
          />
        </div>
        <div className="space-y-2">
          <Label>Promo Code *</Label>
          <Input
            value={formData.promoCode}
            onChange={(e) => setFormData(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
            placeholder="FOODBANK"
            className="font-mono uppercase"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the organization and its mission..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>Website URL</Label>
          <Input
            value={formData.websiteUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Discount (%)</Label>
          <Input
            type="number"
            value={formData.customerDiscount}
            onChange={(e) => setFormData(prev => ({ ...prev, customerDiscount: parseInt(e.target.value) || 0 }))}
            min={0}
            max={100}
          />
          <p className="text-xs text-gray-500">Discount customers receive when using the promo code</p>
        </div>
        <div className="space-y-2">
          <Label>Donation Percentage (%)</Label>
          <Input
            type="number"
            value={formData.donationPercent}
            onChange={(e) => setFormData(prev => ({ ...prev, donationPercent: parseInt(e.target.value) || 0 }))}
            min={0}
            max={100}
          />
          <p className="text-xs text-gray-500">Percentage of order donated to the organization</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date *</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Featured Days (optional)</Label>
        <p className="text-xs text-gray-500">Select days when this organization is prominently featured</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {DAYS_OF_WEEK.map(day => (
            <Badge
              key={day}
              variant={formData.featuredDays.includes(day) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFeaturedDay(day)}
            >
              {day}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label>Active</Label>
        </div>
        <div className="space-y-1">
          <Label>Display Order</Label>
          <Input
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
            className="w-20"
            min={0}
          />
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isLoading || !formData.name || !formData.promoCode || !formData.startDate || !formData.endDate}>
          {isLoading ? 'Saving...' : 'Save Partner'}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default CommunityImpactTab;
