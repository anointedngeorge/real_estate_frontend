import { useState } from 'react';
import { Plus, Search, MoreHorizontal, ChevronRight, Users, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KPICard } from '@/components/dashboard/KPICard';
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
import { mockRealtors, formatCurrency, formatDate, formatNumber } from '@/data/mockData';
import { COMMISSION_RULES } from '@/types';
import { useUserListing } from '@/lib/axios_functions';
import { UsersRealtorListingInterface } from '@/interfaces/general';
import { useNavigate } from 'react-router-dom';
import { CreateRealtor } from '@/components/users/add_new_realtors';




export default function RealtorsPage() {



  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const { data, isLoading, error } = useUserListing({ page: 1, url:'/realtors/list?'});
  const [users, setUsers] = useState<UsersRealtorListingInterface[]>(data?.items);
   



  const filteredRealtors = data?.items?.filter((realtor: UsersRealtorListingInterface) => {
    const matchesSearch =
      realtor?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor?.referral_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || realtor?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  

    
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Realtors Management"
        description="Manage agents, track performance, and handle commissions"
      >
        <CreateRealtor />
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Realtors"
          value={formatNumber(data?.count)}
          subtitle={`${data?.count} active`}
          icon={Users}
        />
        <KPICard
          title="Total Sales"
          value={formatNumber(230000)}
          subtitle="Properties sold"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="Total Commission"
          value={formatCurrency(1290567)}
          subtitle="All time earnings"
          icon={Wallet}
          variant="accent"
        />
        <KPICard
          title="Commission Rules"
          value={`${COMMISSION_RULES.DIRECT * 100}% / ${COMMISSION_RULES.DOWNLINER * 100}%`}
          subtitle="Direct / Downliner"
          icon={Wallet}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search realtors, codes..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Realtors Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-muted/50">
              <tr>
                <th>Realtor</th>
                <th>Referral Code</th>
                <th>Role</th>
                <th>Total Sales</th>
                <th>Commission Earned</th>
                <th>Paid / Unpaid</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRealtors?.map((realtor: UsersRealtorListingInterface) => (
                <tr key={realtor?.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {realtor?.avatar ? (
                        <img
                          src={realtor?.avatar}
                          alt={`${realtor?.first_name} ${realtor?.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {realtor?.first_name[0]}{realtor?.last_name[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{realtor?.first_name} {realtor?.last_name}</p>
                        <p className="text-xs text-muted-foreground">{realtor?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                      {realtor?.referral_code}
                    </code>
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {realtor?.role?.toUpperCase()}
                  </td>
                
                  <td className="font-medium">{789}</td>
                  <td className="text-success font-medium">
                    {formatCurrency(1300000)}
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-success">✓ {formatCurrency(200000)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-warning">○ {formatCurrency(1100000)}</span>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={realtor?.is_active? "active": 'inactive'} /></td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/realtors/profile", {
                            state: {
                                userID: realtor?.id
                            }
                        })}>View Profile </DropdownMenuItem>
                        <DropdownMenuItem>View Hierarchy</DropdownMenuItem>
                        <DropdownMenuItem>View Sales</DropdownMenuItem>
                        <DropdownMenuItem>Commission History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-warning">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
