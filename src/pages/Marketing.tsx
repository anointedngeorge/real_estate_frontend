import { useState } from 'react';
import { Facebook, Instagram, Plus, Calendar, Heart, Share2, Users, Image, Clock, Send } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockProperties, formatCurrency } from '@/data/mockData';

const scheduledPosts = [
  {
    id: '1',
    property: 'Luxury 4-Bedroom Duplex',
    platform: 'facebook',
    scheduledFor: '2026-01-21T10:00:00Z',
    status: 'scheduled',
  },
  {
    id: '2',
    property: '5-Bedroom Mansion',
    platform: 'instagram',
    scheduledFor: '2026-01-22T14:00:00Z',
    status: 'scheduled',
  },
];

const engagementData = [
  { property: 'Luxury 4-Bedroom Duplex', likes: 245, shares: 32, leads: 8, platform: 'facebook' },
  { property: 'Commercial Plot', likes: 189, shares: 28, leads: 12, platform: 'instagram' },
  { property: '3-Bedroom Apartment', likes: 312, shares: 45, leads: 15, platform: 'facebook' },
  { property: '5-Bedroom Mansion', likes: 567, shares: 89, leads: 23, platform: 'instagram' },
];

export default function MarketingPage() {
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: true,
    instagram: false,
  });

  const totalLikes = engagementData.reduce((acc, e) => acc + e.likes, 0);
  const totalShares = engagementData.reduce((acc, e) => acc + e.shares, 0);
  const totalLeads = engagementData.reduce((acc, e) => acc + e.leads, 0);

  const availableProperties = mockProperties.filter(p => p.status === 'available');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Social Media Marketing"
        description="Manage property posts and track engagement across platforms"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Property Post</DialogTitle>
              <DialogDescription>
                Create a new post for social media platforms.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="property">Select Property</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {formatCurrency(property.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write an engaging caption for your property..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="facebook" defaultChecked />
                    <Label htmlFor="facebook" className="flex items-center gap-1">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="instagram" />
                    <Label htmlFor="instagram" className="flex items-center gap-1">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" />
                  <Input type="time" className="w-32" />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Post Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Connected Accounts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={`cursor-pointer transition-all ${connectedAccounts.facebook ? 'border-info/50 bg-info/5' : ''}`}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${connectedAccounts.facebook ? 'bg-info/20 text-info' : 'bg-muted text-muted-foreground'}`}>
              <Facebook className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Facebook</p>
              <p className="text-sm text-muted-foreground">
                {connectedAccounts.facebook ? 'Connected' : 'Not connected'}
              </p>
            </div>
            <Switch
              checked={connectedAccounts.facebook}
              onCheckedChange={(checked) => setConnectedAccounts(prev => ({ ...prev, facebook: checked }))}
            />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${connectedAccounts.instagram ? 'border-pink-500/50 bg-pink-500/5' : ''}`}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${connectedAccounts.instagram ? 'bg-pink-500/20 text-pink-500' : 'bg-muted text-muted-foreground'}`}>
              <Instagram className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">
                {connectedAccounts.instagram ? 'Connected' : 'Not connected'}
              </p>
            </div>
            <Switch
              checked={connectedAccounts.instagram}
              onCheckedChange={(checked) => setConnectedAccounts(prev => ({ ...prev, instagram: checked }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Likes"
          value={totalLikes.toLocaleString()}
          subtitle="Across all posts"
          icon={Heart}
          trend={{ value: 24, isPositive: true }}
          variant="accent"
        />
        <KPICard
          title="Total Shares"
          value={totalShares.toLocaleString()}
          subtitle="Content shared"
          icon={Share2}
          trend={{ value: 18, isPositive: true }}
        />
        <KPICard
          title="Leads Generated"
          value={totalLeads.toString()}
          subtitle="From social media"
          icon={Users}
          trend={{ value: 32, isPositive: true }}
          variant="success"
        />
        <KPICard
          title="Scheduled Posts"
          value={scheduledPosts.length.toString()}
          subtitle="Upcoming posts"
          icon={Calendar}
        />
      </div>

      {/* Scheduled Posts & Engagement */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scheduled Posts */}
        <ChartCard
          title="Scheduled Posts"
          subtitle="Upcoming social media posts"
        >
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  post.platform === 'facebook' ? 'bg-info/20 text-info' : 'bg-pink-500/20 text-pink-500'
                }`}>
                  {post.platform === 'facebook' ? <Facebook className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{post.property}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.scheduledFor).toLocaleDateString('en-NG', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            ))}
            {scheduledPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No scheduled posts</p>
              </div>
            )}
          </div>
        </ChartCard>

        {/* Top Performing Posts */}
        <ChartCard
          title="Post Engagement"
          subtitle="Performance by property"
        >
          <div className="space-y-4">
            {engagementData.map((data, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  data.platform === 'facebook' ? 'bg-info/20 text-info' : 'bg-pink-500/20 text-pink-500'
                }`}>
                  {data.platform === 'facebook' ? <Facebook className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{data.property}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {data.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" /> {data.shares}
                    </span>
                    <span className="flex items-center gap-1 text-success">
                      <Users className="h-3.5 w-3.5" /> {data.leads} leads
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
