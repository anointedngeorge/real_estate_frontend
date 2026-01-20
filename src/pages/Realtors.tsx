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

export default function RealtorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRealtors = mockRealtors.filter((realtor) => {
    const matchesSearch =
      realtor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realtor.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || realtor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRealtors = mockRealtors.length;
  const activeRealtors = mockRealtors.filter(r => r.status === 'active').length;
  const totalCommission = mockRealtors.reduce((acc, r) => acc + r.totalCommissionEarned, 0);
  const totalSales = mockRealtors.reduce((acc, r) => acc + r.totalSales, 0);

  const getUplineName = (uplineId?: string) => {
    if (!uplineId) return 'None (Top Level)';
    const upline = mockRealtors.find(r => r.id === uplineId);
    return upline ? `${upline.firstName} ${upline.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Realtors Management"
        description="Manage agents, track performance, and handle commissions"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Realtor
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Realtors"
          value={formatNumber(totalRealtors)}
          subtitle={`${activeRealtors} active`}
          icon={Users}
        />
        <KPICard
          title="Total Sales"
          value={formatNumber(totalSales)}
          subtitle="Properties sold"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="Total Commission"
          value={formatCurrency(totalCommission)}
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
                <th>Upline</th>
                <th>Downlines</th>
                <th>Total Sales</th>
                <th>Commission Earned</th>
                <th>Paid / Unpaid</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRealtors.map((realtor) => (
                <tr key={realtor.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {realtor.avatar ? (
                        <img
                          src={realtor.avatar}
                          alt={`${realtor.firstName} ${realtor.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {realtor.firstName[0]}{realtor.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{realtor.firstName} {realtor.lastName}</p>
                        <p className="text-xs text-muted-foreground">{realtor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                      {realtor.referralCode}
                    </code>
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {getUplineName(realtor.uplineId)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{realtor.downlineIds.length}</span>
                      {realtor.downlineIds.length > 0 && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="font-medium">{realtor.totalSales}</td>
                  <td className="text-success font-medium">
                    {formatCurrency(realtor.totalCommissionEarned)}
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-success">✓ {formatCurrency(realtor.paidCommission)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-warning">○ {formatCurrency(realtor.unpaidCommission)}</span>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={realtor.status} /></td>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
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
