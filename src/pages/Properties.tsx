import { useState } from 'react';
import { Plus, Search, MoreHorizontal, MapPin, Ruler, Tag } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KPICard } from '@/components/dashboard/KPICard';
import { Building2, Home, Landmark, Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { mockProperties, formatCurrency, formatDate, formatNumber } from '@/data/mockData';
import type { PropertyStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useUserListing } from '@/lib/axios_functions';
import { PropertyListInterface } from '@/interfaces/general';
import { CreateProperties } from '@/components/users/add_new_properties';

const propertyTypeIcons = {
  land: Landmark,
  house: Home,
  apartment: Building2,
  commercial: Building,
};


interface Stats  {
   total: number,
   sold: number,
   available: number,
   price_summation: number
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const navigate = useNavigate();

  const { data, isLoading, error } = useUserListing({ page: 1, url:'/properties/list?'});
  const stats:Stats = data?.stats;

  const checkStatus = (property, fallback) => {
      if (property) {
          return property.status.charAt(0).toUpperCase() + property.status.slice(1)
      }
      return fallback
  }
  

  const filteredProperties = data?.items?.filter((property: PropertyListInterface) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.property_types === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });


  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Properties Management"
        description="Manage property listings, availability, and assignments"
      >
        <CreateProperties />
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value={formatNumber(stats?.total)}
          subtitle="All listings"
          icon={Building2}
        />
        <KPICard
          title="Available"
          value={formatNumber(stats?.available)}
          subtitle="Ready for sale"
          icon={Home}
          variant="success"
        />
        <KPICard
          title="Sold"
          value={formatNumber(stats?.sold)}
          subtitle="Completed sales"
          icon={Tag}
          variant="accent"
        />
        <KPICard
         className='text-sm'
          title="Portfolio Value"
          value={formatCurrency(stats?.price_summation)}
          subtitle="Total inventory"
          icon={Landmark}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties?.map((property: PropertyListInterface) => {
            const TypeIcon = propertyTypeIcons[property.property_types];
            return (
              <Card key={property?.id} className="overflow-hidden group cursor-pointer hover:shadow-soft transition-shadow">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={property?.image}
                    alt={property?.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    
                    <StatusBadge status={checkStatus(property, 'reserved')} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(property.selling_price ? property.selling_price : property.actual_price)}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold truncate">{property.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                              navigate("/properties/details", {
                                state: {
                                  propID: property?.id,
                                },
                              })
                            }
                          >
                            View Details{" "}
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TypeIcon className="h-4 w-4" />
                      <span className="capitalize">{property?.property_types}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      <span>{property?.features?.size || '300qm'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
     
    </div>
  );
}
